// server/src/auth/auth.controller.ts
import { Controller, Get, Req, UseGuards, Post, HttpStatus, HttpCode } from '@nestjs/common';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * GET /api/auth/profile
   * Pobiera profil i rolę zalogowanego użytkownika. Używany przez Frontend (AuthContext)
   * do ustalenia, czy użytkownik jest adminem.
   */
  @Get('profile')
  @UseGuards(FirebaseAuthGuard)
  async getProfile(@Req() req: any) {
    // req.user jest ustawione przez FirebaseAuthGuard i zawiera decodedToken (w tym uid)
    const userId = req.user.uid;
    return this.authService.getUserProfile(userId);
  }

  /**
   * POST /api/auth/register-initial
   * Endpoint do tworzenia wpisu w kolekcji users. 
   * Powinien być wywołany po pierwszej rejestracji lub logowaniu.
   * Uwaga: Używamy tego tymczasowo, dopóki nie dodamy logiki tworzenia użytkownika w Firestore
   * na etapie rejestracji na Froncie.
   */
  @Post('register-initial')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FirebaseAuthGuard)
  async registerInitial(@Req() req: any) {
      // req.user zawiera decodedToken
      return this.authService.registerUser(req.user);
  }
}