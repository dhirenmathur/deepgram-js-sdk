import { DeepgramClient } from '../src/DeepgramClient';
import fs from 'fs';

async function streamAudio() {
  const dg = new DeepgramClient({ apiKey: process.env.DEEPGRAM_API_KEY! });
  const live = dg.conversationAnalyticsLive({ language: 'en-US' });

  live.connect((event) => {
    console.log('Streaming event:', event);
  });

  // Simulate streaming audio from file
  const audioStream = fs.createReadStream('path/to/audio.wav');
  for await (const chunk of audioStream) {
    live.sendAudio(chunk);
  }
  live.disconnect();
}

streamAudio();
