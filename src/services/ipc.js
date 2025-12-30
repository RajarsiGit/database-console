export const dbService = {
  async getServers() {
    try {
      return await window.electronAPI.getServers();
    } catch (error) {
      console.error('Error fetching servers:', error);
      return { success: false, error: error.message };
    }
  },

  async getDatabases(serverId) {
    try {
      return await window.electronAPI.getDatabases(serverId);
    } catch (error) {
      console.error('Error fetching databases:', error);
      return { success: false, error: error.message };
    }
  },

  async executeQuery(serverId, database, query) {
    try {
      return await window.electronAPI.executeQuery(serverId, database, query);
    } catch (error) {
      console.error('Error executing query:', error);
      return { success: false, error: error.message };
    }
  },

  async testConnection(serverId) {
    try {
      return await window.electronAPI.testConnection(serverId);
    } catch (error) {
      console.error('Error testing connection:', error);
      return { success: false, error: error.message };
    }
  },
};
