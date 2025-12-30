import React, { useState, useEffect } from 'react';
import { Button, Upload, message, Modal, Typography, Space, Alert } from 'antd';
import { UploadOutlined, CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';

const { Text } = Typography;

function CredentialsManager({ onCredentialsLoaded }) {
  const [credentialsLoaded, setCredentialsLoaded] = useState(false);
  const [serverCount, setServerCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkCredentials();
  }, []);

  const checkCredentials = async () => {
    setLoading(true);
    try {
      const response = await window.electronAPI.checkCredentials();
      if (response.success && response.hasCredentials) {
        setCredentialsLoaded(true);
        setServerCount(response.serverCount);
        if (onCredentialsLoaded) {
          onCredentialsLoaded(true);
        }
      }
    } catch (error) {
      console.error('Failed to check credentials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const content = e.target.result;
        const credentials = JSON.parse(content);

        // Validate JSON structure
        if (!credentials.servers || !Array.isArray(credentials.servers)) {
          message.error('Invalid credentials file format. Must contain a "servers" array.');
          return;
        }

        // Validate each server has required fields
        for (const server of credentials.servers) {
          if (!server.id || !server.name || !server.host || !server.port || !server.user) {
            message.error('Invalid server configuration. Each server must have id, name, host, port, and user.');
            return;
          }
        }

        // Save credentials via IPC
        const response = await window.electronAPI.saveCredentials(credentials);

        if (response.success) {
          message.success(`Credentials loaded successfully! ${credentials.servers.length} server(s) configured.`);
          setCredentialsLoaded(true);
          setServerCount(credentials.servers.length);
          if (onCredentialsLoaded) {
            onCredentialsLoaded(true);
          }
        } else {
          message.error(`Failed to save credentials: ${response.error}`);
        }
      } catch (error) {
        message.error(`Invalid JSON file: ${error.message}`);
      }
    };

    reader.onerror = () => {
      message.error('Failed to read file');
    };

    reader.readAsText(file);
    return false; // Prevent default upload behavior
  };

  const handleClearCredentials = () => {
    Modal.confirm({
      title: 'Clear Credentials',
      content: 'Are you sure you want to clear all saved credentials? You will need to upload a new credentials file.',
      okText: 'Yes, Clear',
      okType: 'danger',
      onOk: async () => {
        try {
          const response = await window.electronAPI.clearCredentials();
          if (response.success) {
            message.success('Credentials cleared successfully');
            setCredentialsLoaded(false);
            setServerCount(0);
            if (onCredentialsLoaded) {
              onCredentialsLoaded(false);
            }
          } else {
            message.error(`Failed to clear credentials: ${response.error}`);
          }
        } catch (error) {
          message.error(`Failed to clear credentials: ${error.message}`);
        }
      },
    });
  };

  if (loading) {
    return null;
  }

  return (
    <Space direction="vertical" size="small" style={{ marginBottom: '16px' }}>
      {credentialsLoaded ? (
        <Alert
          message={
            <Space>
              <CheckCircleOutlined />
              <Text strong>Credentials Loaded ({serverCount} server{serverCount !== 1 ? 's' : ''})</Text>
            </Space>
          }
          type="success"
          action={
            <Space>
              <Upload
                accept=".json"
                showUploadList={false}
                beforeUpload={handleFileUpload}
              >
                <Button size="small" icon={<UploadOutlined />}>
                  Update
                </Button>
              </Upload>
              <Button size="small" danger onClick={handleClearCredentials}>
                Clear
              </Button>
            </Space>
          }
        />
      ) : (
        <Alert
          message={
            <Space>
              <WarningOutlined />
              <Text strong>No Credentials Loaded</Text>
            </Space>
          }
          description="Please upload a JSON file containing your database server credentials to get started."
          type="warning"
          action={
            <Upload
              accept=".json"
              showUploadList={false}
              beforeUpload={handleFileUpload}
            >
              <Button type="primary" icon={<UploadOutlined />}>
                Upload Credentials
              </Button>
            </Upload>
          }
        />
      )}
    </Space>
  );
}

export default CredentialsManager;
