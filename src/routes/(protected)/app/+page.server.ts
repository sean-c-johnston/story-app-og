import { getNextChapterFromOpenAi } from '$lib/aiService';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { AiResponse, StorySegment } from '$lib/types';
import type { User } from '@supabase/supabase-js';

const stories: { [userId: string]: StorySegment[] } = {};
const questions: { [userId: string]: string[] } = {};

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { user } = await safeGetSession();
	return {
		story: stories[user.id] || [],
		questions: questions[user.id] || []
	};
};

export const actions = {
	add: async ({ request, locals: { safeGetSession } }) => {
		const { user } = await safeGetSession();

		const formData = await request.formData();
		const chosenQuestion = formData.get('chosenQuestion') as string;

		const openAiResponse = await getNextChapterFromOpenAi(stories[user.id], chosenQuestion);

		updateServerState(user, chosenQuestion, openAiResponse);

		return null;
	},
	clear: async ({ locals: { safeGetSession } }) => {
		const { user } = await safeGetSession();
		stories[user.id] = [];
		questions[user.id] = [];
	},
	logout: async ({ locals: { supabase } }) => {
		const { error } = await supabase.auth.signOut();

		if (error) {
			console.error(error);
			return null;
		}

		redirect(307, '/');
	}
} satisfies Actions;

function updateServerState(user: User, chosenQuestion: string, response: AiResponse) {
	const newStory = [...stories[user.id]];

	newStory.push({
		id: 'chosen id',
		type: 'prompt',
		text: chosenQuestion
	});

	newStory.push({
		id: 'new id',
		type: 'section',
		text: response.section
	});

	stories[user.id] = newStory;
	questions[user.id] = response.questions;
}
