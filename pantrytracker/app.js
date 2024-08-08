// server.js or app.js (Backend)
const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAI } = require('openai'); // Correct OpenAI import

const app = express();
const port = 3001;

// Configure OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Use your API key from environment variables
});
const openai = new OpenAI(configuration);

app.use(bodyParser.json());

app.post('/api/chatbot', async (req, res) => {
  const { message, pantryItems, timeOfDay } = req.body;

  // Prepare your prompt based on pantry items and time of day
  const prompt = `Suggest recipes based on the following items: ${pantryItems.join(', ')}. Consider the time of day: ${timeOfDay}.`;

  try {
    // Call OpenAI API
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 100,
    });

    res.json({ reply: response.data.choices[0].text.trim() });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    res.status(500).json({ error: "Failed to get response from OpenAI" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
