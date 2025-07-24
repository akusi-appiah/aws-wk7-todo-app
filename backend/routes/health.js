import express from 'express';
import { checkDatabaseHealth, getSystemStatus } from '../services/health';

const router = express.Router();

// Basic health check for load balancer
router.get('/', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Comprehensive health check for monitoring
router.get('/full', async (req, res) => {
  const dbHealth = await checkDatabaseHealth();
  
  res.json({
    status: dbHealth.status === 'UP' ? 'UP' : 'DOWN',
    components: {
      database: dbHealth,
      system: getSystemStatus(),
    },
  });
});

export default router;