import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from 'src/user/controllers/user.controller';
import { Client } from 'src/user/entities/client.entity';
import { Photo } from 'src/user/entities/photo.entity';
import { UserService } from 'src/user/services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Photo])],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}
