# AI Chat App

A modern chat application built with Vue 3 and TypeScript that enables conversations with AI personas. Features a clean, responsive UI and robust backend integration.

## Features

### Chat Interface
- 💬 Real-time chat with multiple AI personas
- 🔄 Smooth message animations and transitions
- 📱 Fully responsive design for mobile and desktop
- 🎭 Multiple persona support (Celebrity, Therapist, Language Tutor, etc.)

### Technical Features
- 🔒 Rate limiting to prevent message flooding
- 🔄 Message synchronization across tabs using BroadcastChannel
- ⚠️ Comprehensive error handling and retry mechanism
- 🎯 Type-safe implementation with TypeScript
- 🏗️ Component-based architecture for maintainability

### Security & Performance
- 🔑 API key authentication for backend requests
- 🚦 CORS protection for API endpoints
- ⚡ Optimized message rendering and animations
- 🛡️ Input sanitization and validation

## Tech Stack

- Vue 3 with Composition API
- TypeScript
- Tailwind CSS
- Vite
- Pinia for state management
- Vitest for unit testing

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/yourusername/ai-chat-app.git
cd ai-chat-app
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Add your API key to .env
```

4. Start development server
```bash
npm run dev
```

## Architecture

The application follows a modular architecture:
- `components/chat/` - Reusable chat components
- `stores/` - Pinia stores for state management
- `services/` - API, rate limiting, and sync services
- `types/` - TypeScript type definitions

## Development Considerations

- Rate limiting: Implements cooldown periods between messages
- Error handling: Graceful error recovery with retry options
- Cross-tab sync: Uses BroadcastChannel API for chat synchronization
- Mobile-first: Responsive design with mobile navigation
- Testing: Unit tests for critical functionality

## License

MIT 