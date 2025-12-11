import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from './firebase/firebase.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    FirebaseModule,
    ProductsModule, 
    OrdersModule, 
    AuthModule,
    AdminModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
