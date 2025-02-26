import { Response } from 'express';
import ApiError from '../error/ApiError';
import File from '../models/file';
import { IFile, IParams } from '../utils/interfaces';
import fs from 'fs';
import path from 'path';

class FilesService {
  async uploadFile({ originalname, filename, mimetype, size }: IFile) {
    const extension = path.extname(originalname);

    const fileRecord = await File.create({
      name: filename,
      mimeType: mimetype,
      size,
      extension,
    });

    return fileRecord;
  }

  async listFiles({ listSize, page }: IParams) {
    const offset = (page - 1) * listSize;

    const { rows: files, count } = await File.findAndCountAll({
      limit: listSize,
      offset,
      order: [['uploadDate', 'DESC']],
    });

    return {
      page,
      totalPages: Math.ceil(count / listSize),
      totalFiles: count,
      files,
    };
  }
  async viewFile(id: number) {
    const file = await File.findByPk(id);
    if (!file) {
      throw ApiError.notFound('File not found');
    }
    return file;
  }

  async deleteFile(id: number) {
    const file = await this.viewFile(id);

    const { name } = file;
    const uploadDir = path.join(__dirname, '../../uploads');
    const filePath = path.join(uploadDir, name);

    if (!fs.existsSync(filePath)) {
      throw ApiError.notFound('File not found on server');
    }

    fs.unlink(filePath, (err) => {
      if (err) console.error('Ошибка удаления файла:', err);
    });
    await file.destroy();
  }

  async updateFile(id: number, newFile: Express.Multer.File) {
    const file = await this.viewFile(id);

    const { name } = file;

    const uploadDir = path.join(__dirname, '../../uploads');
    const oldFilePath = path.join(uploadDir, name);

    if (fs.existsSync(oldFilePath)) {
      fs.unlinkSync(oldFilePath);
    }

    const fileExtension = path.extname(newFile.originalname);

    Object.assign(file, {
      name: newFile.filename,
      extension: fileExtension,
      mimeType: newFile.mimetype,
      size: newFile.size,
      uploadDate: new Date(),
    });

    await file.save();

    return file;
  }

  async downloadFile(id: number, res: Response) {
    const file = await this.viewFile(id);

    const { name } = file;

    const uploadDir = path.join(__dirname, '../../uploads');

    const filePath = path.join(uploadDir, name);

    if (!fs.existsSync(filePath)) {
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
