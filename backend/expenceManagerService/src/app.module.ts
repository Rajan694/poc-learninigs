import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { Rs256AuthMiddleware } from './auth/rs256-auth.middleware';
import { CacheService } from './common/cache.service';
import { ExpensesController } from './expenses/expenses.controller';
import { ExpensesService } from './expenses/expenses.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ExpensesController],
  providers: [CacheService, ExpensesService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(Rs256AuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
