# AI Chat Application

A Vue 3 + TypeScript chat application featuring multiple AI personas and real-time sync across tabs.

## Features

- Multiple AI personas (Therapist, Tutor, Chef, Trainer)
- Celebrity guessing game mode
- Real-time sync across browser tabs
- Offline support with IndexedDB
- Rate limiting and error handling
- TypeScript support

## Project Structure

```
src/
├── assets/      # Static assets
├── components/  # Vue components
├── composables/ # Vue composables
├── config/      # App configuration
├── router/      # Vue Router setup
├── services/    # Core services
├── stores/      # Pinia stores
├── styles/      # Global styles
├── types/       # TypeScript types
├── utils/       # Utilities
└── views/       # Vue views
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Add environment variables:
```bash
cp .env.example .env
```

3. Run development server:
```bash
npm run dev
```

## Key Technologies

- Vue 3
- TypeScript
- Pinia
- Vue Router
- IndexedDB
- Tailwind CSS
- Zod

## Development

- Use `npm run lint` to check code style
- Use `npm run test` to run tests
- Use `npm run build` to create production build

## Architecture

- Uses Pinia for state management
- Implements service layer pattern
- Follows composition API patterns
- Includes error boundary handling
- Features real-time sync via BroadcastChannel API

## Documentation

- [Product Specification](https://docs.google.com/document/d/1MOKA2w-WOVfi3vF1Wz0JkO5jviHYwb-70OiWReTA0j4/edit?usp=sharing)
- [System Design](https://docs.google.com/document/d/12gZt0aRicgOZG0L7zlEik6H5yyBAnWfAf3Fx870aHuk/edit?usp=sharing)

## Key Features

- One-on-one chat with AI personas
- Persistent chat history
- Cross-tab synchronization
- Responsive design
- Error handling and retry mechanism 