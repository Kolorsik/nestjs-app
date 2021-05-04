import { Test, TestingModule } from '@nestjs/testing';
import { SendMailDto } from './dto/sendmail.dto';
import { SendmailModule } from './sendmail.module';
import { SendmailService } from './sendmail.service';

describe('SendmailService', () => {
    let service: SendmailService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [SendmailModule],
        }).compile();

        service = module.get<SendmailService>(SendmailService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('Should be send message to emails', async () => {
        const sendMailDto: SendMailDto = {
            to: ['test@mail.ru', 'test1@gmail.com'],
            subject: 'Test',
            message: 'Test',
        };
        const sendedEmail = await service.sendMail(sendMailDto);
        expect(sendedEmail).not.toBeNull();
    });

    it('Should be return catched error', async () => {
        const sendMailDto: SendMailDto = {
            to: ['wwww'],
            subject: 'Test',
            message: 'Test',
        };
        try {
            await service.sendMail(sendMailDto);
            throw new Error('Error');
        } catch (err) {
            expect(err.message).not.toBeNull();
            expect(err.status).toBe(400);
        }
    });
});
