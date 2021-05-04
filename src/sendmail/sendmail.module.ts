import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { SendmailController } from './sendmail.controller';
import { SendmailService } from './sendmail.service';

@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: () => ({
                transport: {
                    host: 'smtp.mail.yahoo.com',
                    port: 465,
                    tls: {
                        ciphers: 'SSLv3',
                    },
                    secure: true,
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.EMAIL_PASSWORD,
                    },
                },
            }),
        }),
    ],
    controllers: [SendmailController],
    providers: [SendmailService],
    exports: [SendmailService],
})
export class SendmailModule {}
