const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai');

const app = express();
app.use(cors()); // Enable CORS for frontend requests
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: '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', // Replace with your actual API key
});

app.post('/generate-itinerary', async (req, res) => {
    const { travelDates, interests, budget } = req.body;
  
    // Validate request body
    if (!travelDates || !travelDates.start || !travelDates.end || !interests || !budget) {
      return res.status(400).json({ error: "Missing required fields: travelDates, interests, or budget." });
    }
  
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: "You are a helpful AI travel assistant." },
          { role: 'user', content: `Create a travel itinerary for someone traveling from ${travelDates.start} to ${travelDates.end}, interested in ${interests}, with a budget of ${budget}.` }
        ],
        max_tokens: 200,
      });
  
      const itinerary = response.choices[0].message.content.trim();
      res.json({ itinerary });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error generating itinerary');
    }
  });  

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
