import express from 'express';
const router = express.Router();

import authRoutes from './auth.routes';
router.use('/', authRoutes);

import filesRoutes from './files.routes';
router.use('/file', filesRoutes);

export default router;
