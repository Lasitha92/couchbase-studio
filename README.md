# Couchbase Studio

A desktop application for querying Couchbase databases built with Electron, React, and TypeScript.

## About

Couchbase Studio is a simple yet powerful desktop application that allows you to connect to and query Couchbase databases. Built with modern web technologies and packaged as a desktop application using Electron, it provides a user-friendly interface for database management and query execution.

### Features

- **Database Connection**: Connect to Couchbase servers with custom credentials
- **Query Execution**: Execute multiple queries simultaneously with separate tabs
- **JSON View**: View query results in a formatted JSON viewer
- **Configuration Management**: Save and load connection configurations
- **Cross-platform**: Works on Windows, macOS, and Linux

### Technology Stack

- **Frontend**: React 18 with TypeScript
- **UI Framework**: Material-UI (MUI)
- **Desktop Framework**: Electron
- **Database**: Couchbase SDK
- **Build Tool**: Vite
- **Package Manager**: npm

## How to Run Locally

### Prerequisites

- Node.js (Tested with v20.8.1)
- npm (comes with Node.js)
- A Couchbase server instance

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd couchbase-studio
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up configuration**

   Create a `configs.json` file in your Documents folder:
   - **Windows**: `%USERPROFILE%\Documents\CouchbaseStudio\configs.json`
   - **macOS**: `~/Documents/CouchbaseStudio/configs.json`
   - **Linux**: `~/Documents/CouchbaseStudio/configs.json`

   Use the provided `configs_example.json` as a template:

   ```json
   {
     "serverUrl": "couchbase://localhost",
     "username": "your-username",
     "password": "your-password",
     "bucketName": "your-bucket",
     "scopeName": "your-scope"
   }
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   This will start both the Vite development server and the Electron application.

### Usage

1. **Connect to Database**: Use the connection form to enter your Couchbase server details
2. **Execute Queries**: Use the query tabs to write and execute N1QL queries
3. **View Results**: Query results will be displayed in a formatted JSON viewer

## How to Build

### Development Build

For testing the application in development mode:

```bash
npm run dev
```

### Production Build

To create a distributable application:

1. **Build the application**

   ```bash
   npm run build
   ```

   This command will:
   - Compile TypeScript files
   - Build the React application with Vite
   - Package the application with Electron Builder

2. **Find the built application**

   The built application will be available in the `dist` folder:
   - **Windows**: `release/Couchbase Studio Setup.exe`
   - **macOS**: `release/Couchbase Studio.dmg`
   - **Linux**: `release/Couchbase Studio.AppImage`

### Build Configuration

The build process is configured in `electron-builder.json5` and uses the following scripts from `package.json`:

- `dev`: Starts the development server
- `build`: Compiles TypeScript, builds the React app, and packages with Electron Builder
- `preview`: Previews the built application
- `lint`: Runs ESLint for code quality checks

## Project Structure

```
couchbase-studio/
├── electron/                # Electron main process
│   ├── main.ts              # Main process entry point
│   ├── preload.ts           # Preload script
│   └── services/            # Backend services
│       └── CouchbaseConnector.ts
├── src/                     # React application
│   ├── components/          # React components
│   ├── App.tsx              # Main React component
│   └── main.tsx             # React entry point
├── public/                  # Static assets
├── package.json             # Project configuration
├── electron-builder.json5   # Electron Builder configuration
└── vite.config.ts           # Vite configuration
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- **Developer**: Lasitha Bandara
- **Email**: lybandara@gmail.com

## Version

Current version: 1.0.0
