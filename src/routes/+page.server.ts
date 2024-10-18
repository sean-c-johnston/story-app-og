import type { Actions, PageServerLoad } from './$types';
import { OPENAI_API_KEY } from '$env/static/private';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';
import { systemPrompt } from '../prompts/system';
import OpenAi from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

interface StorySegment {
	id: string;
	type: 'prompt' | 'chapter';
	text: string;
}

interface AiResponse {
	nextChapter: string;
	newQuestions: string[];
}

const story: StorySegment[] = [];
let questions: string[] = [];

export const load: PageServerLoad = () => {
	return {
		story: story,
		questions: questions
	};
};

export const actions = {
	add: async ({ request }) => {
		const formData = await request.formData();

		const chosenQuestion = formData.get('chosenQuestion') as string;
		story.push({
			id: 'chosen id',
			type: 'prompt',
			text: chosenQuestion
		});

		const response = await doOpenAiStuff(chosenQuestion);

		story.push({
			id: 'new id',
			type: 'chapter',
			text: response.nextChapter
		});
		questions = response.newQuestions;

		return null;
	},
} satisfies Actions;

async function doOpenAiStuff(chosenQuestion: string): Promise<AiResponse> {
	const responseSchema = z.object({
		section: z.string(),
		questions: z.array(z.string()),
		instructions: z.string().optional(),
	});

	const storyMessages: ChatCompletionMessageParam[] = story
		.filter((segment) => segment.type === 'chapter')
		.map((segment) => ({
			role: 'assistant',
			content: segment.text
		}));

	const openai = new OpenAi({ apiKey: OPENAI_API_KEY });
	const completion = await openai.beta.chat.completions.parse({
		model: 'gpt-4o-mini',
		messages: [
			{ role: 'system', content: systemPrompt },
			...storyMessages,
			{
				role: 'user',
				content: chosenQuestion
			}
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
