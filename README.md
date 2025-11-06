# RAG Agent Builder - Frontend

A modern web application for creating, managing, and deploying AI-powered RAG (Retrieval-Augmented Generation) agents. Build intelligent chatbots that can query and understand your custom knowledge bases from multiple data sources.

## Features

### Agent Management

- Create and configure custom RAG agents
- Multi-source knowledge integration (files, websites, text, Notion)
- Interactive playground for testing agents
- Real-time analytics and activity monitoring
- Agent deployment and widget management

### Data Sources

- **File Upload**: Support for various document formats
- **Website Scraping**: Extract content from web URLs
- **Text Input**: Direct text knowledge base creation
- **Notion Integration**: Sync with Notion workspaces

### Authentication & Security

- Secure authentication powered by [Clerk](https://clerk.com)
- Protected routes with middleware
- User-specific agent management

### UI/UX

- Modern, responsive design with Tailwind CSS
- Smooth animations with Framer Motion
- Accessible components built with Radix UI
- Dark mode support (via Tailwind)
- Interactive chatbot interface

## Tech Stack

- **Framework**: [Next.js 15.5.5](https://nextjs.org) with App Router
- **React**: 19.1.0
- **TypeScript**: Type-safe development
- **Styling**: Tailwind CSS 4 with PostCSS
- **State Management**:
  - Zustand for global state
  - TanStack Query for server state
- **Authentication**: Clerk
- **UI Components**: Radix UI primitives
- **HTTP Client**: Axios
- **Code Quality**: Biome for linting and formatting
- **Build Tool**: Turbopack for faster builds

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory with the required variables:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
# Add other environment variables as needed
```

### Development

Run the development server with Turbopack:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

### Code Quality

Run linting:

```bash
npm run lint
```

Format code:

```bash
npm run format
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── agents/            # Agent management pages
│   ├── create-agent/      # Agent creation flow
│   ├── home/              # Dashboard and analytics
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── ...               # Feature-specific components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── store/                 # Zustand state stores
└── middleware.ts          # Auth and routing middleware
```

## Key Features Details

### Agent Creation Flow

Navigate through a multi-step process to create agents:

1. Configure agent settings
2. Select and configure data sources
3. Test in the playground
4. Deploy and share

### Analytics Dashboard

Monitor your agents with:

- Usage statistics
- Activity logs
- Performance metrics

### Deployment Options

Deploy agents as:

- Embeddable widgets
- Standalone chatbots
- API endpoints

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Authentication](https://clerk.com/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [Radix UI](https://www.radix-ui.com)
- [Tailwind CSS](https://tailwindcss.com)

## Contributing

Contributions are welcome! Please ensure code quality by running linting and formatting before submitting pull requests.
