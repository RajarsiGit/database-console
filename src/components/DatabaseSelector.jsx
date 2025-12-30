import React, { useState, useEffect } from 'react';
import { Select, Space, Typography, Spin, message } from 'antd';
import { DatabaseFilled } from '@ant-design/icons';

const { Text } = Typography;

function DatabaseSelector({ serverId, selectedDatabase, onDatabaseChange }) {
  const [databases, setDatabases] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (serverId) {
      loadDatabases();
    } else {
      setDatabases([]);
    }
  }, [serverId]);

  const loadDatabases = async () => {
    setLoading(true);
    try {
      const response = await window.electronAPI.getDatabases(serverId);
      if (response.success) {
        setDatabases(response.data);
      } else {
        message.error(`Failed to load databases: ${response.error}`);
        setDatabases([]);
      }
    } catch (error) {
      message.error(`Failed to load databases: ${error.message}`);
      setDatabases([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Space direction="vertical" size="small">
      <Text strong>Database:</Text>
      <Select
        style={{ width: 250 }}
        placeholder="Select a database"
        value={selectedDatabase}
        onChange={onDatabaseChange}
        loading={loading}
        disabled={!serverId || loading}
        suffixIcon={loading ? <Spin size="small" /> : <DatabaseFilled />}
        size="large"
      >
        {databases.map((db) => (
          <Select.Option key={db} value={db}>
            {db}
          </Select.Option>
        ))}
      </Select>
    </Space>
  );
}

export default DatabaseSelector;
