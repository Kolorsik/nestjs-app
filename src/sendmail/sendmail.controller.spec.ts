import { Test, TestingModule } from '@nestjs/testing';
import { SendmailController } from './sendmail.controller';
import { SendmailModule } from './sendmail.module';
import { SendMailDto } from './dto/sendmail.dto';

describe('SendmailController', () => {
    let controller: SendmailController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [SendmailModule],
        }).compile();

        controller = module.get<SendmailController>(SendmailController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('Should be send message to emails', async () => {
        const sendMailDto: SendMailDto = {
            to: ['test@mail.ru', 'test1@gmail.com'],
            subject: 'Test',
            message: 'Test',
        };
        const sendedEmail = await controller.sendmail(sendMailDto);
        expect(sendedEmail).not.toBeNull();
    });
});
