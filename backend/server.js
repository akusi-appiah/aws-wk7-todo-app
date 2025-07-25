import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import todoRoutes from './routes/todos.js';
import healthRoutes from './routes/health.js';
import errorHandler from './middleware/errorHandler.js';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/todos', todoRoutes);
app.use('/health', healthRoutes);

// Serve Angular frontend in production
if (process.env.NODE_ENV === 'production') {
    // Serve static files
    app.use(express.static(path.join(__dirname, 'public')));
    
    // Handle Angular routing - return index.html for all other routes
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
}

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.info('SIGTERM signal received. Closing server');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.info('SIGINT signal received. Closing server');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});