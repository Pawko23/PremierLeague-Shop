// server/src/orders/orders.module.ts
import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { FirebaseModule } from '../firebase/firebase.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [FirebaseModule, AuthModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}