import { Response } from 'express';
import ApiError from '../error/ApiError';
import File from '../models/file';
import { IFile, IParams } from '../utils/interfaces';
import fs from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = path.join(__dirname, '../../uploads');

class FilesService {
  async uploadFile({ originalname, filename, mimetype, size, userId }: IFile) {
    return await File.create({
      name: filename,
      extension: path.extname(originalname),
      mimeType: mimetype,
      size,
      userId,
    });
  }

  async listFiles({ listSize, page, userId }: IParams) {
    const offset = (page - 1) * listSize;

    const { rows: files, count } = await File.findAndCountAll({
      limit: listSize,
      offset,
      where: { userId },
      order: [['uploadDate', 'DESC']],
    });

    return {
      page,
      totalPages: Math.ceil(count / listSize),
      totalFiles: count,
      files,
    };
  }

  async viewFile(id: number, userId: string) {
    const file = await File.findOne({
      where: { id, userId },
    });
    if (!file) throw ApiError.notFound('File not found');
    return file;
  }

  async deleteFile(id: number, userId: string) {
    const file = await this.viewFile(id, userId);
    const filePath = path.join(UPLOAD_DIR, file.name);

    try {
      await fs.unlink(filePath);
    } catch (err) {
      throw ApiError.notFound('File not found on server');
    }

    await file.destroy();
  }

  async updateFile(id: number, userId: string, newFile: Express.Multer.File) {
    const file = await this.viewFile(id, userId);
    const { name } = file;

    const oldFilePath = path.join(UPLOAD_DIR, name);

    try {
      await fs.unlink(oldFilePath);
    } catch (err) {
      throw ApiError.notFound('File not found on server');
    }

    Object.assign(file, {
      name: newFile.filename,
      extension: path.extname(newFile.originalname),
      mimeType: newFile.mimetype,
      size: newFile.size,
      uploadDate: new Date(),
    });

    await file.save();
    return file;
  }

  async downloadFile(id: number, userId: string, res: Response) {
    const file = await this.viewFile(id, userId);
    const { name } = file;

    const filePath = path.join(UPLOAD_DIR, name);

    try {
      await fs.access(filePath);
    } catch (err) {
      throw ApiError.notFound('File not found on server');
    }

    res.download(filePath, name, (err) => {
      if (err) {
        console.error('File download error:', err);
        if (!res.headersSent) {
          res.status(500).json({ message: 'Error downloading file' });
        }
      }
    });
  }
}

export default new FilesService();
