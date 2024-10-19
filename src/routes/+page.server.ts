import type { Actions, PageServerLoad } from './$types';
import { getNextChapterFromOpenAi } from '$lib/aiService';
import type { AiResponse, StorySegment } from '$lib/types';

let story: StorySegment[] = [];
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

		const openAiResponse = await getNextChapterFromOpenAi(story, chosenQuestion);

		updateServerState(chosenQuestion, openAiResponse);

		return null;
	},
	clear: async () => {
		story = [];
		questions = [];
	}
} satisfies Actions;

function updateServerState(chosenQuestion: string, response: AiResponse) {
	story.push({
		id: 'chosen id',
		type: 'prompt',
		text: chosenQuestion
	});

	// if (response.questionAnswer) {
	// 	story.push({
	// 		id: 'answer_id',
	// 		type: 'answer',
	// 		text: response.questionAnswer || ''
	// 	});
	// }

	story.push({
		id: 'new id',
		type: 'section',
		text: response.section
	});
	questions = response.questions;
}
