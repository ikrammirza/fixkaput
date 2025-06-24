import axios from 'axios';
import servicesData from '../../data/servicesData';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userMessage } = req.body;

    // Generate a dynamic system message using your custom data
    const serviceDescriptions = Object.entries(servicesData)
      .map(
        ([service, { description, pricing }]) =>
          `Service: ${service}\nDescription: ${description}\nPricing: ${pricing}`
      )
      .join("\n\n");

    const systemMessage = `You are a helpful assistant for a service platform that offers the following services:\n\n${serviceDescriptions}\n\nUse this information to answer user questions accurately.`;

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemMessage },
            { role: "user", content: userMessage },
          ],
          max_tokens: 150
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const chatbotResponse = response.data.choices[0].message.content;
      res.status(200).json({ reply: chatbotResponse });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch chatbot response' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}