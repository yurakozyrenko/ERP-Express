import express from 'express';
const router = express.Router();

import authRoutes from './auth.routes';
router.use('/auth', authRoutes);

import filesRoutes from './files.routes';
router.use('/file', filesRoutes);

export default router;
