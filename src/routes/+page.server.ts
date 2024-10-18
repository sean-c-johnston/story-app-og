import type { Actions, PageServerLoad } from './$types';

interface StorySegment {
	id: string
	type: 'prompt' | 'chapter'
	text: string
}

interface AiResponse {
	nextChapter: string
	newQuestions: string[]
}

const story: StorySegment[] = [];
let questions: string[] = [];

export const load: PageServerLoad = () => {
	return {
		story: story,
		questions: questions
	}
};

export const actions = {
	add: async ({ request }) => {
		const formData = await request.formData();

		const chosenQuestion = formData.get('chosenQuestion') as string;
		story.push({
			id: "chosen id",
			type: 'prompt',
			text: chosenQuestion,
		})


		const response: AiResponse = {
			nextChapter: 'Bit of text from OpenAI',
			newQuestions: ['Question 1', 'Question 2', 'Question 3']
		};

		story.push({
			id: 'new id',
			type: 'chapter',
			text: response.nextChapter,
		});
		questions = response.newQuestions;

		return null;
	}
} satisfies Actions;
