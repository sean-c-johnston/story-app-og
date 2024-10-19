import { z } from 'zod';
import OpenAi from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { systemPrompt } from '../prompts/system';
import { zodResponseFormat } from 'openai/helpers/zod';
import { OPENAI_API_KEY } from '$env/static/private';
import type { AiResponse, StorySegment } from '$lib/types';

const responseSchema = z.object({
	section: z.string(),
	questions: z.array(z.string()),
	instructions: z.string().optional()
});

const openai = new OpenAi({ apiKey: OPENAI_API_KEY });

const getChaptersFromStory = (storySoFar: StorySegment[]): ChatCompletionMessageParam[] =>
	storySoFar
		// .filter((segment) => segment.type === 'chapter')
		.map((chapter) => ({
			role: 'assistant',
			content: chapter.text
		}));

export async function getNextChapterFromOpenAi(
	storySoFar: StorySegment[],
	chosenQuestion: string
): Promise<AiResponse> {
	const storyMessages = getChaptersFromStory(storySoFar);

	const completion = await openai.beta.chat.completions.parse({
		model: 'gpt-4o-mini',
		messages: [
			{ role: 'system', content: systemPrompt },
			...storyMessages,
			{ role: 'user', content: chosenQuestion }
		],
		response_format: zodResponseFormat(responseSchema, 'storySectionResponse')
	});

	// todo: null check r
	const r = completion.choices[0].message.parsed!;

	return {
		nextChapter: r.section,
		newQuestions: r.questions
	};
}
