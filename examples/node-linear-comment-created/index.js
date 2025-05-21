// Example: Linear 'Comment Created' Webhook Trigger
// Usage: node examples/node-linear-comment-created/index.js

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Webhook endpoint for Linear
app.post('/webhook/linear', (req, res) => {
  const event = req.body;
  // According to https://linear.app/developers/webhooks#webhook-payload
  if (
    event.type === 'Comment' &&
    event.action === 'create' &&
    event.data && event.data.body
  ) {
    console.log('New Linear comment created!');
    console.log('Comment ID:', event.data.id);
    console.log('Comment Body:', event.data.body);
    console.log('Comment Author:', event.data.user?.name || event.data.userId);
    console.log('Associated Issue:', event.data.issueId);
    // Add any additional processing here
  } else {
    console.log('Received non-comment or non-create event:', event.type, event.action);
  }
  res.status(200).send('OK');
});

app.listen(PORT, () => {
  console.log(`Linear webhook listener running on port ${PORT}`);
  console.log(`POST Linear webhooks to http://localhost:${PORT}/webhook/linear`);
});

/*
How to use:
1. Start this server: node examples/node-linear-comment-created/index.js
2. In Linear, set your webhook URL to http://<your-public-url>/webhook/linear
   (use ngrok or similar for local testing)
3. When a comment is created in Linear, this endpoint will log the comment details.
*/
