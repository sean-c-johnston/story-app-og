import type { Actions, PageServerLoad } from './$types';

const chapters = [
	{
		id: "ulid1",
		text: "Once upon a test, there was some text here."
	},
	{
		id: "ulid2",
		text: "Then the text was more and it tested."
	},
	{
		id: "ulid3",
		text: "And they all passed QA happily ever after."
	},
];

export const load: PageServerLoad = () => {
	return {
		chapters: chapters,
		questions: [
			"What happened next?",
			"Then who showed up?",
			"Why would that happen?"
		],
	}
};

export const actions = {
	add: async ({ request }) => {
		chapters.push({id: "idk", text: "Another text lol"})

		return null;
	}
} satisfies Actions;