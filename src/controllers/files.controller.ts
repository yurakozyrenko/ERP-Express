import { NextFunction, Request, Response } from 'express';
import filesService from '../services/files.service';
import ApiError from '../error/ApiError';

class FilesController {
  async uploadFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        return next(ApiError.unauthorized('User not found'));
      }

      if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
      }

      const fileRecord = await filesService.uploadFile({ ...req.file, userId: req.user.id });

      res.status(201).json({ message: 'File uploaded', file: fileRecord });
    } catch (error) {
      next(error);
    }
  }

  async listFiles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        return next(ApiError.unauthorized('User not found'));
      }

      const listSize = parseInt(req.query.list_size as string) || 10;
      const page = parseInt(req.query.page as string) || 1;

      const result = await filesService.listFiles({ listSize, page, userId: req.user.id });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async viewFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        return next(ApiError.unauthorized('User not found'));
      }

      const userId = req.user.id;
      const { id } = req.params;

      const file = await filesService.viewFile(+id, userId);

      res.status(200).json(file);
    } catch (error) {
      next(error);
    }
  }

  async deleteFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        return next(ApiError.unauthorized('User not found'));
      }
      const userId = req.user.id;
      const { id } = req.params;

      await filesService.deleteFile(+id, userId);

      res.status(200).json({ message: 'File deleted' });
    } catch (error) {
      next(error);
    }
  }

  async updateFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        return next(ApiError.unauthorized('User not found'));
      }

      const { id } = req.params;

      if (!req.file) {
        res.status(400).json({ message: 'No file uploaded for update' });
        return;
      }
      const userId = req.user.id;
      const updatedFile = await filesService.updateFile(+id, userId, req.file);

      res.status(200).json({ message: 'File updated', file: updatedFile });
    } catch (error) {
      next(error);
    }
  }

  async downloadFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        return next(ApiError.unauthorized('User not found'));
      }
      const userId = req.user.id;
      const { id } = req.params;
      await filesService.downloadFile(+id, userId, res);
    } catch (error) {
      next(error);
    }
  }
}

export default new FilesController();
