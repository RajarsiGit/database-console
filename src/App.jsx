import React, { useState } from 'react';
import { Layout, Typography, Space, Button, message } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import CredentialsManager from './components/CredentialsManager';
import ServerSelector from './components/ServerSelector';
import DatabaseSelector from './components/DatabaseSelector';
import SqlEditor from './components/SqlEditor';
import ResultsViewer from './components/ResultsViewer';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  const [credentialsLoaded, setCredentialsLoaded] = useState(false);
  const [selectedServer, setSelectedServer] = useState(null);
  const [selectedDatabase, setSelectedDatabase] = useState(null);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCredentialsLoaded = (loaded) => {
    setCredentialsLoaded(loaded);
    if (!loaded) {
      setSelectedServer(null);
      setSelectedDatabase(null);
      setResult(null);
    }
  };

  const handleServerChange = (serverId) => {
    setSelectedServer(serverId);
    setSelectedDatabase(null);
    setResult(null);
  };

  const handleDatabaseChange = (database) => {
    setSelectedDatabase(database);
  };

  const handleQueryChange = (newQuery) => {
    setQuery(newQuery);
  };

  const executeQuery = async () => {
    if (!selectedServer) {
      message.error('Please select a server');
      return;
    }

    if (!selectedDatabase) {
      message.error('Please select a database');
      return;
    }

    if (!query.trim()) {
      message.error('Please enter a query');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await window.electronAPI.executeQuery(
        selectedServer,
        selectedDatabase,
        query
      );

      if (response.success) {
        setResult(response.data);
        message.success('Query executed successfully');
      } else {
        message.error(response.error);
        setResult({ error: response.error });
      }
    } catch (error) {
      message.error(`Failed to execute query: ${error.message}`);
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#001529', padding: '0 24px' }}>
        <Title level={3} style={{ color: 'white', margin: '14px 0' }}>
          Database Console
        </Title>
      </Header>
      <Content style={{ padding: '24px' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <CredentialsManager onCredentialsLoaded={handleCredentialsLoaded} />

          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
            <ServerSelector
              selectedServer={selectedServer}
              onServerChange={handleServerChange}
            />
            <DatabaseSelector
              serverId={selectedServer}
              selectedDatabase={selectedDatabase}
              onDatabaseChange={handleDatabaseChange}
            />
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={executeQuery}
              loading={loading}
              disabled={!selectedServer || !selectedDatabase || !query.trim()}
              size="large"
              style={{
                height: '40px',
                fontWeight: '600',
                borderRadius: '6px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              Run Query
            </Button>
          </div>

          <SqlEditor value={query} onChange={handleQueryChange} onExecute={executeQuery} />

          <ResultsViewer result={result} loading={loading} />
        </Space>
      </Content>
    </Layout>
  );
}

export default App;
