import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { myS3 } from 'config/aws.config';
import * as dotenv from 'dotenv';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { Client } from 'src/user/entities/client.entity';
import { Photo } from 'src/user/entities/photo.entity';
import { User } from 'src/user/entities/user.entity';
import { S3Folder, UploadedFilesDto } from 'src/user/models/user.model';
import { Repository } from 'typeorm';

dotenv.config();

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Client) private readonly clientRepository: Repository<Client>,
    @InjectRepository(Photo) private readonly photoRepository: Repository<Photo>
  ) {}

  /**
   * Creates a new user.
   * @param createUserDto - The data for creating the user.
   * @param files - The uploaded files associated with the user.
   * @returns A promise that resolves to the response containing the created user.
   */
  async createUser(
    createUserDto: CreateUserDto,
    files: UploadedFilesDto
  ): Promise<UserResponseDto> {
    // 1. Upload Avatar
    const avatar =
      files.avatar &&
      (await this.uploadFileToS3(createUserDto.email, files.avatar[0], S3Folder.AVATARS));

    // 2. Upload Photos
    const photos =
      files.photos?.length > 0 &&
      (await this.uploadMultipleFilesToS3AndSaveToDB(
        createUserDto.email,
        files.photos,
        S3Folder.PHOTOS
      ));

    // 3. Create User Instance
    const user = this.clientRepository.create({
      ...createUserDto,
      ...(avatar && { avatar }),
      ...(files.photos?.length && { photos })
    });

    // 4. Save User in DB
    const savedUser = await this.clientRepository.save(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = savedUser;
    return { avatar: savedUser.avatar, ...userWithoutPassword };
  }

  /**
   * Finds a user by their email.
   * @param email - The email of the user to find.
   * @returns A Promise that resolves to the found user.
   */
  async findByEmail(email: string): Promise<Client> {
    return await this.clientRepository.findOne({ where: { email } });
  }

  /**
   * Retrieves a user by their ID.
   * @param id - The ID of the user to retrieve.
   * @returns A Promise that resolves to the user with the specified ID.
   */
  async findOne(id: number): Promise<Client> {
    return await this.clientRepository.findOne({ where: { id } });
  }

  /**
   * Validates a user's email and password.
   * @param email - The email of the user.
   * @param password - The password of the user.
   * @returns A Promise that resolves to a UserResponseDto if the user is valid, otherwise null.
   */
  async validateUser(email: string, password: string): Promise<UserResponseDto> {
    const user = await this.findByEmail(email);
    if (user && (await user.validatePassword(password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * Uploads multiple files to S3 and saves them to the database.
   *
   * @param userEmail - The email of the user.
   * @param files - An array of files to upload.
   * @param folder - The S3 folder to upload the files to.
   * @returns A promise that resolves to an array of Photo objects representing the uploaded files.
   */
  async uploadMultipleFilesToS3AndSaveToDB(
    userEmail: string,
    files: Express.Multer.File[],
    folder: S3Folder
  ): Promise<Photo[]> {
    return await Promise.all(
      files.map(async file => {
        const photoUrl = await this.uploadFileToS3(userEmail, file, folder);
        const newPhoto = this.photoRepository.create({ name: file.fieldname, url: photoUrl });
        return this.photoRepository.save(newPhoto);
      })
    );
  }

  /**
   * Uploads a file to Amazon S3.
   *
   * @param userEmail - The email of the user.
   * @param file - The file to be uploaded.
   * @param folder - The folder in which the file will be stored.
   * @returns A Promise that resolves to the URL of the uploaded file.
   * @throws An error if the file upload fails.
   */
  async uploadFileToS3(
    userEmail: string,
    file: Express.Multer.File,
    folder: S3Folder
  ): Promise<string> {
    const fileName = this.getFileName(userEmail, file, folder);
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read'
    };

    const uploadResult = await myS3.upload(params).promise();
    // Return the URL of the uploaded file
    return uploadResult.Location;
  }

  /**
   * Generates a file name based on the user's email, the uploaded file, and the specified folder.
   * @param userEmail - The email of the user.
   * @param file - The uploaded file.
   * @param folder - The folder where the file will be stored.
   * @returns The generated file name.
   */
  getFileName(userEmail: string, file: Express.Multer.File, folder: S3Folder): string {
    const sanitizedEmail = this.sanitize(userEmail);
    const sanitizedPhotoName = this.sanitize(file.originalname);
    return `users/${sanitizedEmail}/${folder}/${sanitizedPhotoName}`;
  }

  /**
   * Sanitizes the input string by converting it to lowercase,
   * replacing special characters, and removing non-alphanumeric characters.
   * @param input - The string to be sanitized.
   * @returns The sanitized string.
   */
  sanitize(input: string): string {
    return input
      .toLowerCase()
      .replace('@', '-')
      .replace('.', '-')
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/[^a-z0-9\-]/g, ''); // Remove any non-alphanumeric characters
  }

  /**
   * Validates the uploaded files.
   * @param files - The uploaded files.
   * @returns A string containing the error message if there is an error, otherwise null.
   */
  validateUpladedFiles(files: UploadedFilesDto): string | null {
    const avatarError = files.avatar?.length && this.validatePhoto(files.avatar[0]);
    if (avatarError) {
      throw new BadRequestException(avatarError);
    }

    const photosError =
      files.photos?.length && this.validaMultiplePhotos(files.photos).find(error => error !== null);
    if (photosError) {
      throw new BadRequestException(photosError);
    }

    return null; // No errors
  }

  /**
   * Validates multiple photos.
   * @param photos - An array of Express.Multer.File objects representing the photos to be validated.
   * @returns An array of strings representing any validation errors encountered during the validation process.
   */
  validaMultiplePhotos(photos: Express.Multer.File[]): (string | null)[] {
    if (photos.length > Number(process.env.FILES_MAX_COUNT)) {
      return ['Maximum number of photos exceeded.'];
    }

    const photosError = photos.map(this.validatePhoto).filter(error => error !== null);

    return photosError;
  }

  /**
   * Validates the uploaded photo.
   * @param file - The uploaded file.
   * @returns A string containing an error message, or null if there are no errors.
   */
  validatePhoto(file: Express.Multer.File): string | null {
    const maxSize = Number(process.env.FILES_MAX_SIZE);
    const allowedTypes = process.env.FILES_ALLOWED_TYPE.split(',');

    if (file.size > maxSize) {
      return `${file.fieldname}: file size exceeds the maximum limit.`;
    }
    if (!allowedTypes.includes(file.mimetype)) {
      return `${file.fieldname}: invalid file type.`;
    }

    return null; // No errors
  }
}
