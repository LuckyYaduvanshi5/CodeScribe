import React, { useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import axios from 'axios';

// Dynamically import Monaco Editor to avoid SSR issues
const CodeEditor = dynamic(
  () => import('../components/CodeEditor'),
  { ssr: false }
);

export default function Home() {
  const [code, setCode] = useState<string>('// Paste your code here or upload a file');
  const [documentation, setDocumentation] = useState<string>('');
  const [language, setLanguage] = useState<string>('javascript');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const languages = [
    'javascript', 'typescript', 'python', 'java', 'c', 'cpp', 'csharp',
    'go', 'ruby', 'php', 'swift', 'rust'
  ];

  const generateDocumentation = async () => {
    if (!code.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Use the correct API endpoint that matches your backend
      const response = await axios.post('http://localhost:5000/api/generate-documentation', {
        code,
        language
      });
      
      setDocumentation(response.data.documentation);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate documentation');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>CodeScribe - AI Documentation Generator</title>
        <meta name="description" content="Generate comprehensive code documentation using AI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          CodeScribe <span className="text-blue-600">AI Documentation Generator</span>
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Code Input</h2>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1"
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
            <CodeEditor 
              value={code} 
              language={language} 
              onChange={setCode} 
            />
            <button
              onClick={generateDocumentation}
              disabled={isLoading || !code}
              className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Generating...' : 'Generate Documentation'}
            </button>
            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Generated Documentation</h2>
            <div className="prose max-w-none min-h-[500px] p-4 border border-gray-300 rounded whitespace-pre-wrap overflow-auto">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                </div>
              ) : documentation ? (
                <div dangerouslySetInnerHTML={{ __html: documentation.replace(/\n/g, '<br/>') }} />
              ) : (
                <p className="text-gray-500">Documentation will appear here after generation</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}