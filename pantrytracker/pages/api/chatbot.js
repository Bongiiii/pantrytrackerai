import { OpenAIAPI } from 'openai';

// Initialize the OpenAI client
const openai = new OpenAIAPI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  const { message, pantryItems, timeOfDay } = req.body;

  const prompt = `Suggest a recipe using the following pantry items: ${pantryItems.join(', ')} for ${timeOfDay}. User said: ${message}`;

  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 150,
    });

    res.status(200).json({ reply: completion.choices[0].text.trim() });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch response' });
  }
}
