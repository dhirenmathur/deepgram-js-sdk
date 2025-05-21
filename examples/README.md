# Examples

This directory contains example scripts demonstrating how to use the Deepgram JavaScript SDK and integrate with various APIs and webhooks.

## List of Examples

- **node-linear-comment-created/**: Example Express server to handle Linear's "comment created" webhook event. See details below.
- node-agent-live/
- node-auth/
- node-live/
- node-prerecorded/
- node-read/
- node-speak/
- node-speak-live/
- browser-live/
- browser-prerecorded/
- disabled_deno-prerecorded/

## node-linear-comment-created

Demonstrates how to listen for Linear's "comment created" webhook event and process the payload.

**How to use:**

1. Install dependencies (if not already):
   ```bash
   npm install express body-parser
   ```
2. Start the server:
   ```bash
   node examples/node-linear-comment-created/index.js
   ```
3. In Linear, set your webhook URL to `http://<your-public-url>/webhook/linear` (use [ngrok](https://ngrok.com/) or similar for local testing).
4. When a comment is created in Linear, the endpoint will log the comment details.

**Webhook payload reference:**
See [Linear Webhook Payload Docs](https://linear.app/developers/webhooks#webhook-payload)
