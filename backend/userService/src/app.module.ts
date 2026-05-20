import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AccessTokenMiddleware } from './common/access-token.middleware';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController, UsersController],
  providers: [AuthService, UsersService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AccessTokenMiddleware).forRoutes(UsersController);
  }
}
