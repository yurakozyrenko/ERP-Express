import { Router } from 'express';
import upload from '../middleware/upload';
import FilesController from '../controllers/files.controller';
import authMiddleware from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import { validateQueryId } from '../validations/param';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Files
 *   description: API для работы с файлами
 */

/**
 * @swagger
 * /api/file/upload:
 *   post:
 *     summary: Загрузка файла
 *     tags: [Files]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Файл успешно загружен
 *       400:
 *         description: Ошибка загрузки файла
 */
router.post('/upload', authMiddleware, upload.single('file'), FilesController.uploadFile);

/**
 * @swagger
 * /api/file/list:
 *   get:
 *     summary: Получение списка файлов с пагинацией
 *     tags: [Files]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Номер страницы
 *       - in: query
 *         name: list_size
 *         schema:
 *           type: integer
 *         description: Количество файлов на странице
 *     responses:
 *       200:
 *         description: Успешный ответ с массивом файлов
 */
router.get('/list', authMiddleware, FilesController.listFiles);

/**
 * @swagger
 * /api/file/{id}:
 *   get:
 *     summary: Получение информации о файле
 *     tags: [Files]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID файла
 *     responses:
 *       200:
 *         description: Информация о файле
 *       404:
 *         description: Файл не найден
 */
router.get('/:id', authMiddleware, validateQueryId, validateRequest, FilesController.viewFile);

/**
 * @swagger
 * /api/file/delete/{id}:
 *   delete:
 *     summary: Удаление файла
 *     tags: [Files]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID файла
 *     responses:
 *       200:
 *         description: Файл успешно удален
 *       404:
 *         description: Файл не найден
 */
router.delete('/delete/:id', authMiddleware, validateQueryId, validateRequest, FilesController.deleteFile);

/**
 * @swagger
 * /api/file/update/{id}:
 *   put:
 *     summary: Обновление файла
 *     tags: [Files]
 *     security:
 *       - BearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID файла, который нужно обновить
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Файл успешно обновлен
 *       400:
 *         description: Ошибка при обновлении файла
 *       404:
 *         description: Файл не найден
 */
router.put('/update/:id', authMiddleware, validateQueryId, validateRequest, upload.single('file'), FilesController.updateFile);

/**
 * @swagger
 * /api/file/download/{id}:
 *   get:
 *     summary: Скачивание файла
 *     tags: [Files]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID файла
 *     responses:
 *       200:
 *         description: Файл успешно скачан
 *       404:
 *         description: Файл не найден
 */
router.get('/download/:id', authMiddleware, validateQueryId, validateRequest, FilesController.downloadFile);

export default router;
