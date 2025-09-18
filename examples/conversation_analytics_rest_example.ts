import { DeepgramClient } from '../src/DeepgramClient';

async function run() {
  const dg = new DeepgramClient({ apiKey: process.env.DEEPGRAM_API_KEY! });
  const response = await dg.conversationAnalytics.analyzeConversation({
    url: 'https://audio-hosting.com/file.wav',
    language: 'en-US',
    detect_speakers: true,
  });
  console.log('Analysis:', JSON.stringify(response, null, 2));
}

run();
