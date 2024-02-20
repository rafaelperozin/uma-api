import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as dotenv from 'dotenv';
import { AuthController } from 'src/auth/controllers/auth.controller';
import { AuthService } from 'src/auth/services/auth.service';
import { JwtStrategy } from 'src/auth/startegy/jwt.strategy';
import { UserModule } from 'src/user/user.module';

dotenv.config();

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: process.env.JWT_EXPIRATION || '1d' }
    })
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
