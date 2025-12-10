// server/src/products/products.module.ts
import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}