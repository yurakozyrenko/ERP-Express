import { param } from 'express-validator';

export const validateQueryId = [param('id').trim().isInt({ gt: 0 }).withMessage('ID должен быть натуральным числом больше 0')];
