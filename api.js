const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');

const app = express();
app.use(cors()); // Enable CORS for frontend requests
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: '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', // Replace with your actual API key
});

// New endpoint to handle chatbot messages
app.post('/chat', async (req, res) => {
  const { message } = req.body;
  console.log('Received message:', message); // Log the incoming message

  // Validate request body
  if (!message) {
    console.log("Missing message field");
    return res.status(400).json({ error: "Missing required field: message." });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: "You are a helpful AI travel assistant." },
        { role: 'user', content: message },
      ],
      max_tokens: 200,
    });

    console.log('AI response:', response); // Log the AI response
    const reply = response.choices[0].message.content.trim();
    res.json({ reply }); // Return AI's reply to the user
  } catch (error) {
    console.error('Error with AI response:', error); // Log the error
    res.status(500).send('Error generating response');
  }
});

app.listen(8000, () => {
  console.log('Server is running on port 8000');
});
