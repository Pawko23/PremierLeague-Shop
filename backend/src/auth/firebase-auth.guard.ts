import { CanActivate, ExecutionContext, Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  private auth: admin.auth.Auth;

  constructor(@Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App) {
    this.auth = this.firebaseAdmin.auth();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // Oczekujemy "Bearer <token>"
    const token = request.headers.authorization?.split(' ')[1]; 

    if (!token) {
      throw new UnauthorizedException('Brak tokena autoryzacji.');
    }

    try {
      // Weryfikacja tokena za pomocą Firebase Admin SDK
      const decodedToken = await this.auth.verifyIdToken(token);
      
      // Dodajemy obiekt użytkownika (z uid) do requestu
      request.user = decodedToken;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Nieprawidłowy lub wygasły token.');
    }
  }
}