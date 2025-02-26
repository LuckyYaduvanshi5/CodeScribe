import React, { useEffect, useRef } from 'react';
import Editor, { Monaco, OnMount } from '@monaco-editor/react';
import { editor } from 'monaco-editor';

interface CodeEditorProps {
  value: string;
  language: string;
  onChange: (value: string) => void;
}

export default function CodeEditor({ value, language, onChange }: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  
  // Handle editor mounting
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Focus the editor after mounting
    editor.focus();
  };

  useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        // Update language if model exists
        const currentMonaco = (window as any).monaco;
        if (currentMonaco) {
          currentMonaco.editor.setModelLanguage(model, language);
        }
      }
    }
  }, [language]);

  return (
    <Editor
      height="500px"
      defaultLanguage={language}
      language={language}
      value={value}
      onChange={(value) => onChange(value || '')}
      onMount={handleEditorDidMount}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
      }}
    />
  );
}