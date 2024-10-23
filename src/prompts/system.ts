import { z } from 'zod';

export const systemPrompt = `
Write a children's story that will be read aloud by a parent. It should be around 7 minutes in length. It should be written with children 3-5 years old in mind, and should use concepts and language which children of that age will understand.

Do not use the phrase "Once upon a time".

** Steps **
- Choose a theme from this list: [Animals, Cowboys, Dinosaurs, Construction Vehicles, Fairytales, Fantasy, Princesses, Space & Planets]
- Thinking on the chosen theme, define a high-level plot outline in bullet point form, each bullet point consisting of 1 sentece. This should follow a standard narrative structure.
- Create names for 4-5 chapters based on the plot outline.
- Using the chapter names as inspiration, write full chapters of 1-2 minutes each. Each chapter should be made up of 1-3 short paragraphs.

** Output **
A story, with a name and multiple chapters.
Each chapter should contain 1-3 short paragraphs.
`

export const storySchema = z.object({
  name: z.string(),
  chapters: z.array(
    z.object({
      name: z.string(),
      paragraphs: z.array(z.string()),
    })
  )
});