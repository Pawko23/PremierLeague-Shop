// server/src/orders/orders.service.ts
import { Inject, Injectable, BadRequestException, InternalServerErrorException, ForbiddenException } from '@nestjs/common';
import * as admin from 'firebase-admin';

// DTO/Interfejs dla uproszczenia
interface OrderItem {
    productId: string;
    variantType: 'home' | 'away';
    size: 'S' | 'M' | 'L' | 'XL';
    quantity: number;
    price: number;
}

interface CreateOrderDto {
    shippingAddress: any;
    items: OrderItem[];
}

interface ProductData {
  name?: string;
  stock?: Record<string, Record<string, number>>;
  // dodaj inne pola jeśli chcesz (price, variants, itd.)
}

@Injectable()
export class OrdersService {
  private firestore: admin.firestore.Firestore;

  constructor(@Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App) {
    this.firestore = this.firebaseAdmin.firestore();
  }

  // POST /api/orders
  async createOrder(orderData: CreateOrderDto, userId: string) {
    if (!orderData.items || orderData.items.length === 0) {
        throw new BadRequestException('Zamówienie musi zawierać produkty.');
    }

    const orderRef = this.firestore.collection('orders').doc();
    
    // Używamy transakcji do aktualizacji stanów magazynowych
    try {
        await this.firestore.runTransaction(async (transaction) => {
            let totalAmount = 0;
            const updatedItems: Array<OrderItem & { productName: string }> = [];

            for (const item of orderData.items) {
                const productRef = this.firestore.collection('products').doc(item.productId);
                const productDoc = await transaction.get(productRef);

                if (!productDoc.exists) {
                    throw new BadRequestException(`Produkt o ID ${item.productId} nie istnieje.`);
                }

                const product = productDoc.data();
                if(!product) {
                    throw new BadRequestException(`Produkt o ID ${item.productId} posiada puste dane.`)
                }
                const currentStock = product.stock[item.variantType][item.size];

                if (currentStock < item.quantity) {
                    throw new BadRequestException(`Niewystarczająca ilość na magazynie dla: ${product.name} (${item.variantType}, ${item.size}).`);
                }

                // Zmniejszenie stanu magazynowego
                product.stock[item.variantType][item.size] -= item.quantity;
                transaction.update(productRef, { stock: product.stock, updatedAt: admin.firestore.FieldValue.serverTimestamp() });

                totalAmount += item.quantity * item.price;
                updatedItems.push({ 
                    ...item,
                    productName: product.name,
                });
            }

            // Utworzenie nowego zamówienia
            const newOrder = {
                userId,
                status: 'pending', // Wymagany status
                totalAmount,
                items: updatedItems,
                shippingAddress: orderData.shippingAddress,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            };
            transaction.set(orderRef, newOrder);
        });

        return { id: orderRef.id, message: 'Zamówienie zostało złożone pomyślnie.' };
    } catch (error) {
        console.error("Błąd transakcji zamówienia:", error);
        throw new InternalServerErrorException(error.message || 'Wystąpił błąd podczas składania zamówienia.');
    }
  }

  // GET /api/orders
  async findAll(userId: string) {
    const snapshot = await this.firestore.collection('orders')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // GET /api/orders/:id
  async findOne(orderId: string, userId: string) {
    const doc = await this.firestore.collection('orders').doc(orderId).get();

    if (!doc.exists) {
        throw new BadRequestException('Zamówienie nie istnieje.');
    }

    const orderData = doc.data();
    if (!orderData) {
        throw new BadRequestException('Dane zamówienia są puste.');
    }

    if (orderData.userId !== userId) {
        throw new ForbiddenException('Nie masz dostępu do tego zamówienia.');
    }

    return { id: doc.id, ...doc.data() };
  }
}