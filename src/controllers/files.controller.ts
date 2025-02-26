import { Request, Response, NextFunction } from 'express';
import filesService from '../services/files.service';
// import File from '../models/File';
// import fs from 'fs';
// import path from 'path';

class FilesController {
  // // Загрузка файла
  async uploadFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
      }

      const { originalname, filename, mimetype, size } = req.file;

      const fileRecord = await filesService.uploadFile({ originalname, filename, mimetype, size });

      res.status(201).json({ message: 'File uploaded', file: fileRecord });
    } catch (error) {
      next(error);
    }
  }

  // // Получение списка файлов с пагинацией
  async listFiles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const listSize = parseInt(req.query.list_size as string) || 10;
      const page = parseInt(req.query.page as string) || 1;

      const result = await filesService.listFiles({ listSize, page });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // // Просмотр файла (детали)
  async viewFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const file = await filesService.viewFile(+id);

      res.status(200).json(file);
    } catch (error) {
      next(error);
    }
  }

  // // Удаление файла
  async deleteFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      await filesService.deleteFile(+id);

      res.status(200).json({ message: 'File deleted' });
    } catch (error) {
      next(error);
    }
  }

  // // Обновление файла
  async updateFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      if (!req.file) {
        res.status(400).json({ message: 'No file uploaded for update' });
        return;
      }

      const updatedFile = await filesService.updateFile(+id, req.file);

      res.status(200).json({ message: 'File updated', file: updatedFile });
    } catch (error) {
      next(error);
    }
  }

  async downloadFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await filesService.downloadFile(+id, res);
    } catch (error) {
      next(error);
    }
  }
}

export default new FilesController();
