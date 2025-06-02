# StudyMate - Your Personalized Study Planner

StudyMate is an intelligent study planning platform that helps students learn any topic efficiently by generating structured daily study plans. Built with Next.js and modern web technologies, StudyMate provides a comprehensive solution for effective learning.

## Features

- **Smart Study Planning**: Generate personalized study plans based on your topic and timeframe
- **Curated Learning Resources**: Access carefully selected YouTube videos for each topic
- **Interactive Learning Tools**:
  - Take and organize notes
  - Bookmark important content
  - AI-powered content summarization
- **Progress Tracking**: Monitor your learning journey with detailed insights and reports
- **Personalized Experience**: Get recommendations based on your learning style and progress

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Authentication**: NextAuth.js
- **Database**: Prisma ORM
- **AI Integration**: Google Generative AI, Groq SDK
- **Development**: ESLint, TypeScript, PostCSS

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

- `/src` - Source code
  - `/app` - Next.js app router pages and layouts
  - `/components` - Reusable React components
  - `/lib` - Utility functions and shared logic
- `/prisma` - Database schema and migrations
- `/public` - Static assets

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
