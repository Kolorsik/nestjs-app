import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { ThrottlerModule } from '@nestjs/throttler';
import { SendmailModule } from './sendmail/sendmail.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: 'production.env',
        }),
        MongooseModule.forRoot(
            `${process.env.MONGO_CONNECTION_STRING}/${process.env.DB_NAME}`,
            {
                useFindAndModify: false,
            },
        ),
        ThrottlerModule.forRoot({
            ttl: 60,
            limit: 10,
        }),
        UsersModule,
        AuthModule,
        SendmailModule,
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
