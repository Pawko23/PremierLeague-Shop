// server/src/admin/admin.controller.ts
import { Controller, Post, Put, Delete, Get, Param, UseGuards, Body } from '@nestjs/common';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { AdminGuard } from '../auth/admin.guard'; // Poprawiono nazwę
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(FirebaseAuthGuard, AdminGuard) 
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Produkty (CRUD)
  @Post('products')
  createProduct(@Body() body: any) {
    return this.adminService.createProduct(body);
  }
  
  @Put('products/:id')
  updateProduct(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateProduct(id, body);
  }

  @Delete('products/:id')
  deleteProduct(@Param('id') id: string) {
    return this.adminService.deleteProduct(id);
  }

  // Zamówienia (Zarządzanie)
  @Get('orders')
  findAllOrders() {
    return this.adminService.findAllOrders();
  }

  @Put('orders/:id/status')
  updateOrderStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.adminService.updateOrderStatus(id, status);
  }

  // Analityka
  @Get('analytics')
  getAnalytics() {
    return this.adminService.getAnalytics();
  }
}