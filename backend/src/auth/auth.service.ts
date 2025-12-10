// server/src/auth/auth.service.ts
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as admin from 'firebase-admin';

// DTO dla odpowiedzi profilu
export interface UserProfile {
  email: string;
  displayName: string;
  role: 'user' | 'admin';
}

@Injectable()
export class AuthService {
  private firestore: admin.firestore.Firestore;

  constructor(@Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App) {
    this.firestore = this.firebaseAdmin.firestore();
  }

  /**
   * Pobiera profil użytkownika z Firestore, w tym jego rolę.
   * Ta metoda jest chroniona przez FirebaseAuthGuard, 
   * więc `userId` jest gwarantowany z tokena.
   */
  async getUserProfile(userId: string): Promise<UserProfile> {
    const userDoc = await this.firestore.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      // Jeśli użytkownik istnieje w Firebase Auth, ale nie w naszej kolekcji 'users', 
      // traktujemy go jako zwykłego usera z domyślną rolą lub rzucamy wyjątek.
      // Na potrzeby weryfikacji roli admina:
      throw new NotFoundException('Profil użytkownika nie znaleziony w Firestore. Prawdopodobnie pierwszy login bez zapisanej roli.');
    }

    const userData = userDoc.data();

    if (!userData) {
        throw new NotFoundException('Profil użytkownika jest pusty lub niepoprawny.');
    }
    
    return {
      email: userData.email,
      displayName: userData.displayName || 'Anonim',
      role: userData.role as 'user' | 'admin',
    };
  }

  /**
   * Tworzy wpis użytkownika w Firestore podczas pierwszej rejestracji, 
   * nadając mu domyślną rolę 'user'.
   */
  async registerUser(firebaseUser: admin.auth.DecodedIdToken) {
    const userRef = this.firestore.collection('users').doc(firebaseUser.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
        await userRef.set({
            email: firebaseUser.email,
            displayName: firebaseUser.name || firebaseUser.email,
            role: 'user', // Domyślna rola
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return { message: 'Profil utworzony.' };
    }
    return { message: 'Profil już istniał.' };
  }
}