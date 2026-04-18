import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { InferenceClient } from '@huggingface/inference';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const client = new InferenceClient(process.env.HF_API_KEY);

app.post('/api/symptom-check', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  try {
    const result = await client.chatCompletion({
      model: 'Qwen/Qwen2.5-72B-Instruct',
      messages: [
        { role: 'user', content: prompt }
      ],
      max_tokens: 1024
    });

    const reply = result.choices?.[0]?.message?.content || "❌ Sorry, I couldn't process that.";
    res.json({ reply });
  } catch (err) {
    console.error('Hugging Face API error:', err);
    res.status(500).json({ error: 'Failed to contact Hugging Face API', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});