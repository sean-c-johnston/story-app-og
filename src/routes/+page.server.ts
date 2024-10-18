import type { Actions, PageServerLoad } from './$types';

const chapters = [
	{
		id: "ulid1",
		text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
	},
	{
		id: "ulid2",
		text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt."
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