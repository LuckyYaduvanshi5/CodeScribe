import React, { useState } from 'react';
import CodeEditor from './CodeEditor';
import { generateDocumentation } from '../services/apiClient';

const DocumentationGenerator: React.FC = () => {
  const [code, setCode] = useState('// Enter your code here');
  const [language, setLanguage] = useState('javascript');
  const [documentation, setDocumentation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateDocumentation = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await generateDocumentation(code, language);
      setDocumentation(result.documentation);
    } catch (err) {
      setError('Failed to generate documentation. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CodeScribe Documentation Generator</h1>
      
      <div className="mb-4">
        <label className="block mb-2">Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="p-2 border rounded w-full md:w-1/3"
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Code</label>
        <CodeEditor
          value={code}
          language={language}
          onChange={setCode}
        />
      </div>

      <button
        onClick={handleGenerateDocumentation}
        disabled={isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
      >
        {isLoading ? 'Generating...' : 'Generate Documentation'}
      </button>

      {error && <div className="text-red-500 mt-4">{error}</div>}

      {documentation && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">Documentation</h2>
          <div className="border p-4 rounded bg-gray-50">
            <MarkdownRenderer content={documentation} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentationGenerator;
