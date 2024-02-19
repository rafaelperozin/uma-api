import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from 'src/user/controllers/user.controller';
import { Client } from 'src/user/entities/client.entity';
import { Photo } from 'src/user/entities/photo.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Client, Photo])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
