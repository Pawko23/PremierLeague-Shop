import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as admin from "firebase-admin";

@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: "FIREBASE_ADMIN",
            useFactory: (configService: ConfigService) => {
                const credentialsPath = configService.get<string>('FIREBASE_ADMIN_CREDENTIALS_PATH');
                if (!credentialsPath) {
                    throw new Error('FIREBASE_ADMIN_CREDENTIALS_PATH is not defined in .env');
                };
                
                const serviceAccount = require(credentialsPath);

                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                });

                return admin;
            },
            inject: [ConfigService],
        },
    ],
    exports: ['FIREBASE_ADMIN'],
})
export class FirebaseModule {}