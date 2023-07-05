import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseMiddleware implements NestMiddleware {
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
    }, 'foundation');
  }

  use(req: Request, res: Response, next: NextFunction) {
    const idToken = req.headers.authorization ?? '';

    if (idToken !== null && idToken.startsWith('Bearer ')) {
      this.admin
        .auth()
        .verifyIdToken(idToken.replace('Bearer ', ''))
        .then(async (decodedToken) => {
          req['user'] = decodedToken;
        })
        .then(() => next())
        .catch((error) => {
          this.logger.error(error);
          this.accessDenied(res, req.url);
        });
    } else {
      this.accessDenied(res, req.url);
      next();
    }
  }

  private accessDenied(res: Response, url: string) {
    res.status(401).json({
      message: 'Access denied',
      url,
    });
  }
}
