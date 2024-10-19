export interface StorySegment {
	id: string;
	type: 'prompt' | 'section' | 'answer';
	text: string;
}

export interface AiResponse {
	section: string;
	questions: string[];
	questionAnswer: string | null | undefined;
}