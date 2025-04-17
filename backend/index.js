const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { OpenAI } = require('openai');
const { getTranscript } = require('youtube-transcript');
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const ttsClient = new textToSpeech.TextToSpeechClient({
  keyFilename: 'credentials.json',
});

const summarizeWithGPT = async (transcript) => {
  const prompt = `
You are an AI assistant. Given this YouTube transcript:

"${transcript}"

1. Provide a **short summary** (3-4 lines).
2. Provide a **detailed summary**.
3. List **actionable takeaways** (bulleted).

Respond in JSON like:
{
  "shortSummary": "...",
  "detailedSummary": "...",
  "takeaways": "..."
}
  `;

  const completion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-4',
  });

  try {
    return JSON.parse(completion.choices[0].message.content);
  } catch {
    console.error('Failed to parse GPT response');
    return {
      shortSummary: 'Summary unavailable.',
      detailedSummary: '',
      takeaways: '',
    };
  }
};

const generateAudioSummary = async (text, filename = 'summary.mp3') => {
  const request = {
    input: { text },
    voice: { languageCode: 'en-US', ssmlGender: 'FEMALE' },
    audioConfig: { audioEncoding: 'MP3' },
  };

  const [response] = await ttsClient.synthesizeSpeech(request);
  const writeFile = util.promisify(fs.writeFile);
  await writeFile(`public/${filename}`, response.audioContent, 'binary');

  return `http://localhost:${port}/${filename}`;
};

app.use('/public', express.static('public'));

app.post('/generate-summary', async (req, res) => {
  const { videoId } = req.body;

  try {
    const transcriptSegments = await getTranscript(videoId);
    const transcript = transcriptSegments.map(seg => seg.text).join(' ');

    const summaries = await summarizeWithGPT(transcript);
    const audioUrl = await generateAudioSummary(summaries.shortSummary);

    res.json({ ...summaries, audioUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to summarize video' });
  }
});

app.listen(port, () => console.log(`🚀 Server running at http://localhost:${port}`));
