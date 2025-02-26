import { Request, Response, NextFunction } from 'express';
import filesService from '../services/files.service';

class FilesController {
  private getUserId(req: Request, res: Response): string | null {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return null;
    }
    return req.user.id;
  }

  async uploadFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.getUserId(req, res);
      if (!userId) return;

      if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
      }

      const fileRecord = await filesService.uploadFile({ ...req.file, userId });

      res.status(201).json({ message: 'File uploaded', file: fileRecord });
    } catch (error) {
      next(error);
    }
  }

  async listFiles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.getUserId(req, res);
      if (!userId) return;

      const listSize = parseInt(req.query.list_size as string) || 10;
      const page = parseInt(req.query.page as string) || 1;

      const result = await filesService.listFiles({ listSize, page, userId });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async viewFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.getUserId(req, res);
      if (!userId) return;

      const { id } = req.params;
      const file = await filesService.viewFile(+id, userId);

      res.status(200).json(file);
    } catch (error) {
      next(error);
    }
  }

  async deleteFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.getUserId(req, res);
      if (!userId) return;

      const { id } = req.params;

      await filesService.deleteFile(+id, userId);

      res.status(200).json({ message: 'File deleted' });
    } catch (error) {
      next(error);
    }
  }

  async updateFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.getUserId(req, res);
      if (!userId) return;

      const { id } = req.params;

      if (!req.file) {
        res.status(400).json({ message: 'No file uploaded for update' });
        return;
      }

      const updatedFile = await filesService.updateFile(+id, userId, req.file);

      res.status(200).json({ message: 'File updated', file: updatedFile });
    } catch (error) {
      next(error);
    }
  }

  async downloadFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.getUserId(req, res);
      if (!userId) return;

      const { id } = req.params;
      await filesService.downloadFile(+id, userId, res);
    } catch (error) {
      next(error);
    }
  }
}

export default new FilesController();
