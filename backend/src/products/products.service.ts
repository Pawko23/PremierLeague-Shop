import { Inject, Injectable } from "@nestjs/common";
import * as admin from "firebase-admin";

@Injectable()
export class ProductsService {
    private firestore: admin.firestore.Firestore;

    constructor(@Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App) {
        this.firestore = this.firebaseAdmin.firestore();
    };

    async findAll(club?: string, type?: string, size?: string) {
        let query: admin.firestore.Query = this.firestore.collection('products');

        if(club) {
            query = query.where('club', '==', club);
        };

        const snapshot = await query.get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    };

    async findOne(id: string) {
        const doc = await this.firestore.collection('products').doc(id).get();
        if(!doc.exists) {
            return null;
        };
        return { id: doc.id, ...doc.data() };
    };

    async findOneBySlug(slug: string) {
        const snapshot = await this.firestore.collection('products').where('slug', '==', slug).limit(1).get();
        if(snapshot.empty) {
            return null;
        };
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() };
    };
}