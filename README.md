# Professor X

Xavier provides 24/7 virtual mental health support, offering personalized, empathetic conversations and proactive care through AI-driven avatars. Accessible and culturally inclusive, it bridges mental health gaps for diverse communities in need.

## Prerequisites

- Node.js and pnpm (for web frontend and Node.js agent)
- LiveKit Cloud or self-hosted LiveKit server
- OpenAI API key
- HeyGen API key

## Getting Started

### Agent Setup

1. Navigate to the `/agent` directory
2. Copy the sample environment file: `cp .env.sample .env.local`
3. Open `.env.local` in a text editor and enter your LiveKit credentials

#### Node.js Version

1. Install dependencies: `pnpm install`
2. Load the environment variables:
   - On macOS and Linux: `source .env.local`
   - On Windows: `set -a; . .env.local; set +a`
3. Run the agent in development mode: `pnpm dev`

### Web Frontend Setup

1. Navigate to the `/web` directory
2. Copy the sample environment file: `cp .env.sample .env.local`
3. Open `.env.local` in a text editor and enter your LiveKit credentials:
4. Install dependencies: `pnpm install`
5. Run the development server: `pnpm dev`
6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Additional Resources

1. LiveKit: [https://livekit.io](https://livekit.io)

1. Realtime API: [https://platform.openai.com/docs/guides/realtime](https://platform.openai.com/docs/guides/realtime)

1. HeyGen: [https://docs.heygen.com/docs/streaming-avatar-sdk-reference](https://docs.heygen.com/docs/streaming-avatar-sdk-reference)

1. Gamma AI

1. Eleven Labs

Starter Code bases

https://github.com/HeyGen-Official/InteractiveAvatarNextJSDemo

https://github.com/livekit-examples/realtime-playground
