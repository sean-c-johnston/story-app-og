import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from '../$types';
import { generateAStory } from '$lib/aiService';

const stories: { [userId: string]: string[] } = {};
const questions: { [userId: string]: string[] } = {};

const getStoryFor = (userId: string) => stories[userId] || [];
const setStoryFor = (userId: string, story: string[]) => (stories[userId] = story);

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { user } = await safeGetSession();

	return {
		story: getStoryFor(user.id),
		questions: questions[user.id] || []
	};
};

export const actions = {
	// todo: rename 'add'
	add: async ({ locals: { safeGetSession } }) => {
		const { user } = await safeGetSession();

		const { story } = await generateAStory();

		let allText = "";

		for (const chapter of story.chapters){
			for (const paragraph of chapter.paragraphs) {
				allText += paragraph;
			}
		}

		setStoryFor(user.id, allText);

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
