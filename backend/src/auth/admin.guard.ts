// server/src/auth/admin.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class AdminGuard implements CanActivate {
  private firestore: admin.firestore.Firestore;

  constructor(@Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App) {
    this.firestore = this.firebaseAdmin.firestore();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Oczekujemy, że został dodany przez FirebaseAuthGuard

    if (!user) {
        throw new ForbiddenException('Brak uwierzytelnienia.'); 
    }

    // Weryfikacja roli w kolekcji users
    const userDoc = await this.firestore.collection('users').doc(user.uid).get();

    if (!userDoc.exists) {
        throw new ForbiddenException('Użytkownik nie istnieje w bazie.');
    }

    const userData = userDoc.data();

    if(!userData) {
        throw new ForbiddenException('Dane użytkownika są puste.');
    }

    if (userData.role !== 'admin') {
      throw new ForbiddenException('Wymagana rola Administratora.');
    }
    
    return true;
  }
}