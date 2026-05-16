import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

import { GoogleGenAI } from '@google/genai';

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
}) : null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ... previous endpoints ...
  
  // Homework AI Helper Endpoint
  app.post('/api/ai/homework-helper', async (req, res) => {
    const { prompt, history, subject, depth } = req.body;

    if (!genAI) {
      return res.status(500).json({ success: false, message: "Gemini API not configured" });
    }

    try {
      const depthPrompts = {
        hint: "Provide a subtle hint to help the student solve it themselves. Do not give the answer.",
        guided: "Break down the problem into steps and guide the student through the first few steps without giving the final final answer yet.",
        full: "Provide a detailed step-by-step solution with clear explanations for each part."
      };

      const systemInstruction = `You are a premium Academic Assistant in the Smart Academic Ecosystem. 
      You are helping a student with ${subject}. 
      Your current instruction level is "${depth}".
      Guideline: ${depthPrompts[depth as keyof typeof depthPrompts] || depthPrompts.hint}
      Keep your response academic, encouraging, and clear. Use Markdown for formatting.`;

      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: 'user', parts: [{ text: `Previous history: ${JSON.stringify(history)}` }] },
          { role: 'user', parts: [{ text: prompt }] }
        ],
        config: { systemInstruction }
      });

      res.json({ success: true, answer: response.text });
    } catch (error: any) {
      console.error("AI Error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // ... 

  // Feature Flags API (Dynamic Management)
  app.get('/api/config/features', (req, res) => {
    res.json({
      homeworkHelper: true,
      studyPlanner: true,
      lostFound: true,
      wellnessCorner: true
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
