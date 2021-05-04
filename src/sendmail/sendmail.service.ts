import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, Injectable } from '@nestjs/common';
import { SendMailDto } from './dto/sendmail.dto';
import { SuccessMailDto } from './dto/success-mail.dto';

@Injectable()
export class SendmailService {
    constructor(private readonly mailerService: MailerService) {}

    async sendMail(sendMailDto: SendMailDto): Promise<SuccessMailDto> {
        return this.mailerService
            .sendMail({
                to: sendMailDto.to,
                from: process.env.EMAIL,
                subject: sendMailDto.subject,
                html: sendMailDto.message,
            })
            .then((success: SuccessMailDto) => {
                return success;
            })
            .catch((error: Error) => {
                throw new HttpException(error.message, 400);
            });
    }
}
