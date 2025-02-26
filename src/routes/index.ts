import express from 'express';
const router = express.Router();

import requestsRoutes from './authRoutes';
router.use('/auth', requestsRoutes);

export default router;