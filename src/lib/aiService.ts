import OpenAi from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { zodResponseFormat } from 'openai/helpers/zod';
import { storySchema, systemPrompt } from '../prompts/system';

const openai = new OpenAi({ apiKey: OPENAI_API_KEY });

export async function generateAStory(): Promise<AiResponse> {
	const messages: ChatCompletionMessageParam[] = [
		{ role: 'system', content: systemPrompt },
		{ role: 'user', content: 'Please help me tell a wonderful bedtime story.' },
	];

	const completion = await openai.beta.chat.completions.parse({
		model: 'gpt-4o-mini',
		messages: messages,
		response_format: zodResponseFormat(storySchema, 'story')
	});

	const response = completion.choices[0].message;

	if (response.refusal) {
		console.error(response.refusal);
	}

	const parsedResponse = completion.choices[0].message.parsed;

	if (!parsedResponse) {
		return {success: false, story: null}
	}

	return {
		success: true,
		story: parsedResponse
	}
}

interface AiResponse {
	success: boolean;
	story: {
		name: string;
		chapters: {
			name: string;
			paragraphs: string[];
		}[];
	} | null;
}
