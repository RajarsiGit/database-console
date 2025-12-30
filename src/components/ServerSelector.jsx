import React, { useState, useEffect } from 'react';
import { Select, Space, Typography, Spin } from 'antd';
import { DatabaseOutlined } from '@ant-design/icons';

const { Text } = Typography;

function ServerSelector({ selectedServer, onServerChange }) {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServers();
  }, []);

  const loadServers = async () => {
    setLoading(true);
    try {
      const response = await window.electronAPI.getServers();
      if (response.success) {
        setServers(response.data);
      } else {
        console.error('Failed to load servers:', response.error);
      }
    } catch (error) {
      console.error('Failed to load servers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Space direction="vertical" size="small">
      <Text strong>Server:</Text>
      <Select
        style={{ width: 250 }}
        placeholder="Select a server"
        value={selectedServer}
        onChange={onServerChange}
        loading={loading}
        suffixIcon={loading ? <Spin size="small" /> : <DatabaseOutlined />}
        size="large"
      >
        {servers.map((server) => (
          <Select.Option key={server.id} value={server.id}>
            {server.name} ({server.host}:{server.port})
          </Select.Option>
        ))}
      </Select>
    </Space>
  );
}

export default ServerSelector;
