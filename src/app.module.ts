import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig from 'config/orm.config';
import { UserModule } from 'src/user/user.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, TypeOrmModule.forRoot(ormConfig), AuthModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
