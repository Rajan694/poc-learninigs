import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { Rs256AuthMiddleware } from './auth/rs256-auth.middleware';
import { CacheService } from './common/cache.service';
import { TasksController } from './tasks/tasks.controller';
import { TasksService } from './tasks/tasks.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TasksController],
  providers: [CacheService, TasksService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(Rs256AuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
