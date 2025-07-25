require("dotenv").config();
// import express from 'express';
// import cors from 'cors';
// import { verifyAWSCredentials } from './config/aws.js';
// import todoRoutes from './routes/todos.js';
// import healthRoutes from './routes/health.js';
// import errorHandler from './middleware/errorHandler.js';
// import path from 'path';
// import { fileURLToPath } from 'url';

const express=require('express');
const cors=require('cors');
const { verifyAWSCredentials }=require('./config/aws.js');
const todoRoutes=require('./routes/todos.js');
const healthRoutes=require('./routes/health.js');
const errorHandler=require('./middleware/errorHandler.js');
const path=require('path');
const { fileURLToPath }=require('url');





// MUST BE FIRST: Load environment variables before anything else
// dotenv.config();
console.log('TODO_TABLE_NAME:', process.env.TODO_TABLE_NAME);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Declare server early (hoisted)
let server;  // Changed to let

// Middleware
app.use(cors());
app.use(express.json());

// Initialize server asynchronously
async function init() {
  await verifyAWSCredentials();  // Async operation

  // Routes
  app.use('/api/todos', todoRoutes);
  app.use('/health', healthRoutes);

  // Production setup
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'public')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
  }

  // 404 & Error Handling
  app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
  app.use(errorHandler);

  // Create server instance
  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  // Register signal handlers AFTER server is initialized
  registerSignalHandlers();
}

// Graceful shutdown handlers
function registerSignalHandlers() {
  const shutdown = (signal) => {
    console.info(`${signal} received. Closing server`);
    if (server) {
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    } else {
      console.log('No server instance, exiting immediately');
      process.exit(0);
    }
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

// Start the application
init().catch((err) => {
  console.error('Initialization failed:', err);
  process.exit(1);
});