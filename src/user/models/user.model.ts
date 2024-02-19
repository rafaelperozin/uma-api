import { Express } from 'express';
import { CreatePhotoDto } from 'src/user/dto/create-photo.dto';

export type UploadedFilesDto = {
  avatar?: Express.Multer.File[];
  photos?: Express.Multer.File[];
};

export type CreatePhotoResponse = CreatePhotoDto & {
  url: string;
};

export enum S3Folder {
  AVATARS = 'avatar',
  PHOTOS = 'photos'
}
