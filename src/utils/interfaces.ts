export interface IUser {
  id: string;
  password: string;
}

export interface IParams {
  listSize: number;
  page: number;
  userId: string;
}

export interface IFile {
  id?: number;
  originalname: string;
  filename: string;
  mimetype: string;
  size: number;
  userId: string;
}

