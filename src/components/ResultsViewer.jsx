import React from 'react';
import { Table, Alert, Typography, Space, Card, Spin } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

function ResultsViewer({ result, loading }) {
  if (loading) {
    return (
      <Card className="results-container">
        <Space direction="vertical" align="center" style={{ width: '100%', padding: '40px' }}>
          <Spin size="large" />
          <Text>Executing query...</Text>
        </Space>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="results-container">
        <Text type="secondary">No results yet. Execute a query to see results here.</Text>
      </Card>
    );
  }

  if (result.error) {
    return (
      <Card className="results-container">
        <Alert
          message="Query Error"
          description={result.error}
          type="error"
          icon={<CloseCircleOutlined />}
          showIcon
        />
      </Card>
    );
  }

  if (result.type === 'SELECT') {
    const columns = result.fields.map((field) => ({
      title: field.name,
      dataIndex: field.name,
      key: field.name,
      ellipsis: true,
    }));

    const dataSource = result.rows.map((row, index) => ({
      ...row,
      key: index,
    }));

    return (
      <Card className="results-container">
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Space>
            <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} />
            <Text strong>
              {result.rowCount} row(s) returned in {result.executionTime}ms
            </Text>
          </Space>
          <div className="results-table">
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={{
                pageSize: 50,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} rows`,
              }}
              scroll={{ x: 'max-content' }}
              size="small"
              bordered
            />
          </div>
        </Space>
      </Card>
    );
  }

  if (result.type === 'DML' || result.type === 'DDL' || result.type === 'OTHER') {
    return (
      <Card className="results-container">
        <Space direction="vertical" size="middle">
          <Alert
            message={result.message || 'Query executed successfully'}
            type="success"
            icon={<CheckCircleOutlined />}
            showIcon
          />
          <Space direction="vertical">
            {result.rowCount !== undefined && (
              <Text>
                <strong>Affected Rows:</strong> {result.rowCount}
              </Text>
            )}
            <Text>
              <strong>Execution Time:</strong> {result.executionTime}ms
            </Text>
            {result.command && (
              <Text>
                <strong>Command:</strong> {result.command}
              </Text>
            )}
          </Space>
        </Space>
      </Card>
    );
  }

  return (
    <Card className="results-container">
      <Alert
        message="Query executed"
        description="Query completed successfully"
        type="info"
        showIcon
      />
    </Card>
  );
}

export default ResultsViewer;
