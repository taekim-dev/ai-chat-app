# AI Chat App

A modern chat application built with Vue 3 and TypeScript that enables conversations with AI personas. Features a clean, responsive UI and robust backend integration.

## Design Documents
- [Product Specification](https://docs.google.com/document/d/1MOKA2w-WOVfi3vF1Wz0JkO5jviHYwb-70OiWReTA0j4/edit?usp=drive_link)
- [System Design](https://docs.google.com/document/d/12gZt0aRicgOZG0L7zlEik6H5yyBAnWfAf3Fx870aHuk/edit?usp=drive_link)

## Features

### Chat Interface
- 💬 Real-time chat with AI personas
- 🔄 Message animations and transitions
- 📱 Responsive design for all devices
- 🎭 Multiple personas (Celebrity, Therapist, Language Tutor, etc.)

### Technical Features
- 🔒 Rate limiting for message control
- 🔄 Cross-tab message sync using BroadcastChannel
- ⚠️ Error handling with retry options
- 🎯 Type-safe implementation
- 🏗️ Component-based architecture

### Security & Performance
- 🔑 API key authentication
- 🚦 CORS protection
- ⚡ Optimized message handling
- 🛡️ Input validation

## Tech Stack

- Vue 3 with Composition API
- TypeScript
- Tailwind CSS
- Vite
- Pinia for state management
- Vitest for unit testing
- Playwright for E2E testing

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

## Development

### Testing
The project uses two types of tests:

#### Unit Tests
```bash
npm run test        # Run unit tests
npm run test:unit   # Same as above
```

#### E2E Tests with Playwright
```bash
npm run test:e2e    # Run E2E tests headlessly
npm run test:e2e:ui # Run E2E tests with UI for debugging
```

### Component Development
We use Storybook for component development and documentation:
```bash
npm run storybook   # Start Storybook development server
```

## Architecture

The application follows a modular architecture:
- `components/chat/` - Chat UI components
- `stores/` - Pinia stores for state management
- `services/` - API and utility services
- `types/` - TypeScript definitions
- `e2e/` - Playwright E2E tests

## License

MIT 