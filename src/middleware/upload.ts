import multer, { StorageEngine } from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// Определяем директорию для хранения файлов
const uploadDir = path.join(__dirname, '../../uploads');

// Проверяем, существует ли папка, и создаем её, если нет
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Определяем директорию для хранения файлов
const storage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void): void => {
    cb(null, 'uploads/'); // убедитесь, что папка uploads существует или создайте её
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void): void => {
    // Создаем уникальное имя файла: timestamp + оригинальное имя
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

export default upload;
