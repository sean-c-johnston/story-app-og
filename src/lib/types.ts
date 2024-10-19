export interface StorySegment {
	id: string;
	type: 'prompt' | 'chapter';
	text: string;
}

export interface AiResponse {
	nextChapter: string;
	newQuestions: string[];
}