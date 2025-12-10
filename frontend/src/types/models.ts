// client/src/types/models.ts
export type TshirtSize = 'S' | 'M' | 'L' | 'XL';
export type VariantType = 'home' | 'away';
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface ProductVariant {
    type: VariantType;
    images: string[]; // Publiczne URL-e zdjęć
    sku: string;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    club: string;
    season?: string;
    variants: ProductVariant[];
    sizes: TshirtSize[];
    stock: {
        home: Record<TshirtSize, number>;
        away: Record<TshirtSize, number>;
    };
    createdAt: number; // Timestamp
}

export interface OrderItem {
    productId: string;
    productName: string;
    variantType: VariantType;
    size: TshirtSize;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    userId: string;
    status: OrderStatus;
    totalAmount: number;
    items: OrderItem[];
    shippingAddress: any; // Uproszczone
    createdAt: number;
}

export interface AnalyticsData {
    totalOrders: number;
    totalRevenue: number;
    totalSoldProducts: number;
    top5Products: Array<{ name: string; quantity: number }>;
}