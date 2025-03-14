import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';

import { AwsConfigService } from '../aws/aws-config.service';
import { CheckUserAccessGuard } from '../guards/user-access/check-user-access.guard';
import { MailerModule } from '../mailer/mailer.module';
import { RabbitMQModule } from '../rabbit-mq/rabbit-mq.module';
import { RedisService } from '../redis/redis.service';
import { User } from '../user/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionToken } from './entities/session-token.entity';

@Module({
  controllers: [AuthController],
  exports: [AuthService, JwtModule, PassportModule, RedisService],
  imports: [
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_TOKEN_SECRET'),
        signOptions: { expiresIn: '1h' }
      })
    }),
    MailerModule,
    PassportModule.register({}),
    RabbitMQModule,
    SequelizeModule.forFeature([SessionToken, User])
  ],
  providers: [AwsConfigService, AuthService, RedisService, CheckUserAccessGuard]
})
export class AuthModule {}
