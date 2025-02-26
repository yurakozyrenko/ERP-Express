export interface IUser {
  id?: number;
  email: string;
  password: string;
}

export interface IParams {
  listSize: number;
  page: number;
}

export interface IFile {
  originalname: string;
  filename: string;
  mimetype: string;
  size: number;
}
