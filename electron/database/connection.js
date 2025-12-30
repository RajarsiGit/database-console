const { Pool } = require('pg');
const fs = require('node:fs');
const path = require('node:path');

let serversConfig = null;
const connectionPools = new Map();

function setCredentials(credentials) {
  serversConfig = credentials;
  // Clear existing connection pools when credentials change
  for (const pool of connectionPools.values()) {
    pool.end().catch(err => console.error('Error closing pool:', err));
  }
  connectionPools.clear();
}

function loadServersConfig() {
  if (serversConfig) {
    return serversConfig;
  }

  // Try to load from config file as fallback
  const configPath = path.join(__dirname, '../../config/servers.json');

  if (!fs.existsSync(configPath)) {
    throw new Error('No credentials loaded. Please upload a credentials JSON file.');
  }

  const configData = fs.readFileSync(configPath, 'utf8');
  serversConfig = JSON.parse(configData);
  return serversConfig;
}

function getServers() {
  const config = loadServersConfig();
  return config.servers.map(server => ({
    id: server.id,
    name: server.name,
    host: server.host,
    port: server.port,
  }));
}

function getServerConfig(serverId) {
  const config = loadServersConfig();
  const server = config.servers.find(s => s.id === serverId);

  if (!server) {
    throw new Error(`Server with id '${serverId}' not found`);
  }

  return server;
}

function getPool(serverId, database = null) {
  const poolKey = database ? `${serverId}:${database}` : serverId;

  if (connectionPools.has(poolKey)) {
    return connectionPools.get(poolKey);
  }

  const serverConfig = getServerConfig(serverId);

  const poolConfig = {
    host: serverConfig.host,
    port: serverConfig.port,
    user: serverConfig.user,
    password: serverConfig.password,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  };

  if (database) {
    poolConfig.database = database;
  }

  const pool = new Pool(poolConfig);
  connectionPools.set(poolKey, pool);

  return pool;
}

async function getDatabases(serverId) {
  const pool = getPool(serverId);

  try {
    const result = await pool.query(
      `SELECT datname FROM pg_database
       WHERE datistemplate = false
       ORDER BY datname`
    );

    return result.rows.map(row => row.datname);
  } catch (error) {
    throw new Error(`Failed to fetch databases: ${error.message}`);
  }
}

async function closeAllPools() {
  for (const pool of connectionPools.values()) {
    await pool.end();
  }
  connectionPools.clear();
}

module.exports = {
  setCredentials,
  getServers,
  getServerConfig,
  getPool,
  getDatabases,
  closeAllPools,
};
