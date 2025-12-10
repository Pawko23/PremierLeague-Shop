// server/src/orders/orders.controller.ts
import { Controller, Post, Get, Param, UseGuards, Body, Req } from '@nestjs/common';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { OrdersService } from './orders.service';

@Controller('orders')
@UseGuards(FirebaseAuthGuard) // Wymaga zalogowania
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  createOrder(@Body() body: any, @Req() req: any) {
    const userId = req.user.uid; // ID użytkownika z tokena
    return this.ordersService.createOrder(body, userId);
  }

  @Get()
  findAll(@Req() req: any) {
    const userId = req.user.uid;
    return this.ordersService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.uid;
    return this.ordersService.findOne(id, userId);
  }
}