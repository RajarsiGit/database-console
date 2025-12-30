const { getPool } = require('./connection');

function detectQueryType(query) {
  const trimmedQuery = query.trim().toUpperCase();

  if (trimmedQuery.startsWith('SELECT') || trimmedQuery.startsWith('WITH')) {
    return 'SELECT';
  } else if (
    trimmedQuery.startsWith('INSERT') ||
    trimmedQuery.startsWith('UPDATE') ||
    trimmedQuery.startsWith('DELETE')
  ) {
    return 'DML';
  } else if (
    trimmedQuery.startsWith('CREATE') ||
    trimmedQuery.startsWith('ALTER') ||
    trimmedQuery.startsWith('DROP') ||
    trimmedQuery.startsWith('TRUNCATE')
  ) {
    return 'DDL';
  } else {
    return 'OTHER';
  }
}

async function executeQuery(serverId, database, query) {
  if (!query || query.trim().length === 0) {
    throw new Error('Query cannot be empty');
  }

  if (!database) {
    throw new Error('Database must be selected');
  }

  const pool = getPool(serverId, database);
  const queryType = detectQueryType(query);

  try {
    const startTime = Date.now();
    const result = await pool.query(query);
    const executionTime = Date.now() - startTime;

    if (queryType === 'SELECT') {
      return {
        type: 'SELECT',
        rows: result.rows,
        fields: result.fields.map(field => ({
          name: field.name,
          dataType: field.dataTypeID,
        })),
        rowCount: result.rowCount,
        executionTime,
      };
    } else if (queryType === 'DML') {
      return {
        type: 'DML',
        rowCount: result.rowCount,
        command: result.command,
        executionTime,
        message: `${result.command} executed successfully. ${result.rowCount} row(s) affected.`,
      };
    } else if (queryType === 'DDL') {
      return {
        type: 'DDL',
        command: result.command,
        executionTime,
        message: `${result.command} executed successfully.`,
      };
    } else {
      return {
        type: 'OTHER',
        rowCount: result.rowCount || 0,
        command: result.command,
        executionTime,
        message: `Query executed successfully.`,
        rows: result.rows || [],
      };
    }
  } catch (error) {
    throw new Error(`Query execution failed: ${error.message}`);
  }
}

module.exports = {
  executeQuery,
};
