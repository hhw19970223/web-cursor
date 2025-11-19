'use client'

import React, { useRef } from 'react';

import Editor from '@monaco-editor/react';

interface Props {
  language: string
  content: string,
  onChange: (value?: string) => void
}
export function MonacoEditor({language, content, onChange}: Props) {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  return (
    <Editor
      height="100%"
      defaultLanguage={ language }
      defaultValue={ content }
      onMount={(editor) => {
        editorRef.current = editor;
      }}
      className=''
      onChange={onChange}
      theme={'vs-dark'}
      loading={<span></span>}
      options={{
        minimap: { enabled: false },
      }}
      beforeMount={(monaco) => {
        console.log(monaco.languages.getLanguages());
        monacoRef.current = monaco;
      }}
    />
  );
}