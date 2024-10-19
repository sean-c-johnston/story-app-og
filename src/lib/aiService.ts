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
	question_answer: z.union([z.string(), z.null()])
});

const openai = new OpenAi({ apiKey: OPENAI_API_KEY });

const getChaptersFromStory = (storySoFar: StorySegment[]): ChatCompletionMessageParam[] =>
	storySoFar.map((chapter) => ({
		role: 'assistant',
		content: chapter.text
	}));

export async function getNextChapterFromOpenAi(
	storySoFar: StorySegment[],
	chosenQuestion: string
): Promise<AiResponse> {
	const storyMessages = getChaptersFromStory(storySoFar);

	const messages: ChatCompletionMessageParam[] = [
		{ role: 'system', content: systemPrompt },
		...storyMessages,
		{ role: 'user', content: chosenQuestion }
	];

	const completion = await openai.beta.chat.completions.parse({
		model: 'gpt-4o-mini',
		messages: messages,
		response_format: zodResponseFormat(responseSchema, 'story_section_response')
	});

	const response = completion.choices[0].message;

	if (response.refusal) {
		console.error(response.refusal);
	}

	// todo: null check r
	const r = completion.choices[0].message.parsed!;

	console.log(r.question_answer);

	return {
		section: r.section,
		questions: r.questions,
		questionAnswer: r.question_answer
	};
}
