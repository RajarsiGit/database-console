import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Typography, Space } from 'antd';

const { Text } = Typography;

function SqlEditor({ value, onChange, onExecute }) {
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      if (onExecute) {
        onExecute();
      }
    });
  };

  return (
    <Space direction="vertical" size="small" style={{ width: '100%' }}>
      <Text strong>SQL Query Editor (Ctrl+Enter to run):</Text>
      <div className="monaco-editor-container">
        <Editor
          height="300px"
          defaultLanguage="sql"
          value={value}
          onChange={onChange}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
          }}
        />
      </div>
    </Space>
  );
}

export default SqlEditor;
