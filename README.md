# Database Console

A desktop application for PostgreSQL database management with a modern SQL editor and query execution interface.

## Features

- **Secure Credentials Management**: Upload and cache database credentials via JSON file
- Server selection from configured PostgreSQL servers
- Dynamic database listing based on selected server
- SQL editor with syntax highlighting (Monaco Editor)
- Support for all SQL operations (SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, etc.)
- Tabular results display for SELECT queries
- Execution time and affected rows tracking
- Keyboard shortcut (Ctrl+Enter) to run queries
- Persistent credential storage across app restarts

## Installation

Dependencies are already installed. If you need to reinstall:

```bash
npm install
```

## Configuration

### Credentials Setup

The application uses a secure credentials upload system. You can upload a JSON file containing your database server credentials, which will be cached for successive application sessions.

#### Step 1: Create Your Credentials File

Create a JSON file (e.g., `my-credentials.json`) with your PostgreSQL server configurations:

```json
{
  "servers": [
    {
      "id": "local-postgres",
      "name": "Local PostgreSQL",
      "host": "localhost",
      "port": 5432,
      "user": "postgres",
      "password": "your_password_here"
    },
    {
      "id": "production",
      "name": "Production Server",
      "host": "prod.example.com",
      "port": 5432,
      "user": "prod_user",
      "password": "prod_password"
    }
  ]
}
```

A template file (`credentials.template.json`) is provided in the project root for reference.

Each server requires:
- `id`: Unique identifier
- `name`: Display name
- `host`: Server hostname or IP
- `port`: PostgreSQL port (default: 5432)
- `user`: Database username
- `password`: Database password

#### Step 2: Upload Your Credentials

1. Launch the application
2. Click the "Upload Credentials" button at the top
3. Select your credentials JSON file
4. The credentials will be validated and cached securely
5. Your servers will now be available in the dropdown

#### Managing Credentials

- **Update**: Click the "Update" button to upload a new credentials file
- **Clear**: Click the "Clear" button to remove all cached credentials
- **Persistent Storage**: Credentials are cached using electron-store and persist across app restarts
- **Security**: Credentials are stored locally on your machine

**Note**: The old `config/servers.json` file still works as a fallback if no credentials are uploaded.

## Running the Application

Start the development environment:

```bash
npm run dev
```

This will:
1. Start the Vite development server for React
2. Launch the Electron application
3. Open Developer Tools for debugging

## Building for Production

To create a distributable desktop application:

```bash
npm run build
npm run build:electron
```

The built application will be in the `dist` directory.

## Usage

1. **Upload Credentials** (first time only):
   - Click "Upload Credentials" button
   - Select your credentials JSON file
   - Wait for validation and confirmation

2. **Execute Queries**:
   - Select a server from the dropdown
   - Wait for databases to load, then select a database
   - Write your SQL query in the editor
   - Click "Run Query" or press Ctrl+Enter
   - View results in the results panel

3. **Update Credentials** (when needed):
   - Click the "Update" button in the credentials alert
   - Upload a new JSON file with updated credentials

## Supported Operations

- **SELECT**: Returns data in tabular format
- **INSERT/UPDATE/DELETE**: Shows affected row count
- **CREATE/ALTER/DROP**: Shows success message
- **Transactions**: Full transaction support

## Security Notes

### Current Implementation

- Credentials are stored locally using electron-store
- Data is persisted on your machine in an encrypted format (OS-level encryption)
- Credentials are never transmitted over the network except to connect to your databases
- JSON credentials file is only read during upload, not stored permanently

### Best Practices

For enhanced security:
- **Keep your credentials file secure**: Don't commit it to version control (add to `.gitignore`)
- **Use strong passwords**: Ensure database passwords are complex
- **Limit database permissions**: Use database users with minimal required permissions
- **Regular rotation**: Update credentials periodically using the "Update" feature
- **Local machine security**: Ensure your local machine is encrypted and secure

### Future Enhancements

Planned security features:
- Master password encryption
- Credentials encryption at rest
- Support for credential managers (e.g., Windows Credential Manager)
- Connection over SSL/TLS

## Technologies Used

- Electron 28
- React 18
- Vite 5
- Ant Design 5
- Monaco Editor (VS Code editor)
- node-postgres (pg)

## Troubleshooting

### Connection Errors
- Verify server credentials in `config/servers.json`
- Ensure PostgreSQL server is running
- Check network connectivity and firewall rules

### Application Won't Start
- Check that all dependencies are installed: `npm install`
- Verify Node.js version (v16 or higher recommended)
- Check console for error messages

## Future Enhancements

- Query history
- Multiple query tabs
- Export results to CSV/Excel
- Dark/Light theme toggle
- Server configuration UI
- Query auto-completion
- Performance metrics
