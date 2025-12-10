// server/src/admin/admin.service.ts
import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import * as admin from 'firebase-admin';

// Wymagany DTO/Interfejs (teraz oczekuje string[] URL-i w variants[].images)
interface ProductDto {
    name: string;
    description: string;
    price: number;
    club: string;
    season?: string;
    variants: Array<{ type: 'home' | 'away'; images: string[]; sku: string }>;
    sizes: string[];
    stock: any; // Wymaga konkretniejszego typu, ale dla uproszczenia
}

@Injectable()
export class AdminService {
  private firestore: admin.firestore.Firestore;

  constructor(@Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App) {
    this.firestore = this.firebaseAdmin.firestore();
  }

  // POST /api/admin/products
  async createProduct(productData: ProductDto) {
    // Prosta walidacja URL-i zamiast uploadu plików
    if (productData.variants.some(v => v.images.length === 0 || v.images.some(url => !url.startsWith('http')))) {
        throw new BadRequestException('Warianty muszą zawierać publiczne adresy URL obrazów.');
    }

    const newProduct = {
        ...productData,
        // Dodać logikę generowania slug
        slug: productData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await this.firestore.collection('products').add(newProduct);

    return { id: docRef.id, message: 'Produkt dodany pomyślnie.' };
  }

  // PUT /api/admin/products/:id
  async updateProduct(id: string, updateData: Partial<ProductDto>) {
    const productRef = this.firestore.collection('products').doc(id);
    const doc = await productRef.get();

    if (!doc.exists) {
        throw new NotFoundException(`Produkt o ID ${id} nie znaleziony.`);
    }

    const dataToUpdate = {
        ...updateData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await productRef.update(dataToUpdate);
    return { id, message: 'Produkt zaktualizowany.' };
  }

  // DELETE /api/admin/products/:id
  async deleteProduct(id: string) {
    // Brak logiki usuwania z Storage
    await this.firestore.collection('products').doc(id).delete();
    return { message: 'Produkt usunięty pomyślnie.' };
  }

  // GET /api/admin/orders
  async findAllOrders() {
    const snapshot = await this.firestore.collection('orders')
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // PUT /api/admin/orders/:id/status
  async updateOrderStatus(id: string, status: string) {
    const orderRef = this.firestore.collection('orders').doc(id);
    await orderRef.update({ status });
    return { message: `Status zamówienia ${id} zmieniony na ${status}` };
  }

  // GET /api/admin/analytics
  async getAnalytics() {
    // Wymaga zaimplementowania logiki analitycznej
    const ordersSnapshot = await this.firestore.collection('orders').get();
    
    let totalOrders = ordersSnapshot.size;
    let totalRevenue = 0;
    let totalSoldProducts = 0;
    const topProducts = {};

    ordersSnapshot.forEach(doc => {
        const order = doc.data();
        totalRevenue += order.totalAmount || 0;
        
        order.items.forEach(item => {
            totalSoldProducts += item.quantity;
            const key = `${item.productName}-${item.size}`;
            topProducts[key] = (topProducts[key] || 0) + item.quantity;
        });
    });

    const topProductsArray = Object.entries(topProducts)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 5)
        .map(([name, quantity]) => ({ name, quantity }));


    return {
        totalOrders,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalSoldProducts,
        top5Products: topProductsArray,
    };
  }
}