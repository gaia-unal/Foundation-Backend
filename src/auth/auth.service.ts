import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthService {
  private admin: admin.app.App;
  private readonly logger = new Logger('FirebaseMiddleware');

  constructor(configService: ConfigService) {
    this.admin = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: configService.get('FIREBASE_PROJECT_ID'),
        clientEmail: configService.get('FIREBASE_CLIENT_EMAIL'),
        privateKey: configService
          .get('FIREBASE_PRIVATE_KEY')
          .replace(/\\n/g, '\n'),
      }),
    });
  }

  async setClaims(email: string, claims: object) {
    try {
      this.logger.log(claims);
      const user = await this.admin.auth().getUserByEmail(email);
      await this.admin.auth().setCustomUserClaims(user.uid, claims);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
