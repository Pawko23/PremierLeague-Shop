// server/src/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller.';
import { FirebaseModule } from '../firebase/firebase.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [FirebaseModule, AuthModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}