const { DeepgramClient } = require('../../src');
const client = new DeepgramClient({ apiKey: process.env.DG_KEY });

async function main() {
  const resp = await client.conversation.rest.analyzeConversationUrl({ url: 'https://example.com/file.wav' });
  console.log(resp);
}

main();
