# Create Next.js project with TypeScript
npx create-next-app@latest code-scribe --typescript

# Navigate to project directory
cd code-scribe

# Install dependencies
npm install @monaco-editor/react axios openai tailwindcss postcss autoprefixer
npm install -D @types/node @types/react

# Setup Tailwind CSS
npx tailwindcss init -p

# Create backend folder
mkdir backend
cd backend
npm init -y
npm install express cors dotenv openai mongoose
npm install -D typescript ts-node nodemon @types/express @types/cors