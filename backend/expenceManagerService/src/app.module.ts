import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { Rs256AuthMiddleware } from './auth/rs256-auth.middleware';
import { CacheService } from './common/cache.service';
import { PrismaService } from './common/prisma.service';
import { ExpensesController } from './expenses/expenses.controller';
import { ExpensesService } from './expenses/expenses.service';

@Module({
  imports: [],
  controllers: [ExpensesController],
  providers: [PrismaService, CacheService, ExpensesService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(Rs256AuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
