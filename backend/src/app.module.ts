import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from './firebase/firebase.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    FirebaseModule,
    ProductsModule, 
    OrdersModule, 
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
