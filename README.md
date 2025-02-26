# CodeScribe - AI-Powered Documentation Generator

CodeScribe is an application that automatically generates comprehensive documentation for your code using artificial intelligence.

## Features

- Support for multiple programming languages
- Detailed documentation generation
- Interactive code editor
- File upload support

## Project Structure

```
CodeScribe/
├── frontend/           # Next.js frontend
│   ├── components/     # React components
│   ├── pages/          # Next.js pages
│   └── public/         # Static assets
│
└── backend/            # Express backend
    ├── controllers/    # API controllers
    ├── routes/         # API routes
    └── server.js       # Server entry point
```

## Setup Instructions

### Prerequisites

- Node.js 16+
- npm or yarn
- MongoDB (optional, for storing user data)

### Environment Variables

Create `.env` files in both frontend and backend directories based on the `.env.example` file.

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Usage

1. Navigate to `http://localhost:3000` in your browser
2. Paste your code or upload a file
3. Select the appropriate language
4. Click "Generate Documentation"
5. Copy or export the generated documentation

## License

MIT