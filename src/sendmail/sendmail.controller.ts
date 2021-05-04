import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/roles/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SendMailDto } from './dto/sendmail.dto';
import { SuccessMailDto } from './dto/success-mail.dto';
import { SendmailService } from './sendmail.service';

@ApiTags('sendmail')
@Controller('sendmail')
export class SendmailController {
    constructor(private readonly sendmailService: SendmailService) {}

    @ApiCreatedResponse({
        description: 'Send message to emails',
        type: SuccessMailDto,
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard(Role.MailSender))
    @Post()
    async sendmail(@Body() sendMailDto: SendMailDto): Promise<SuccessMailDto> {
        return this.sendmailService.sendMail(sendMailDto);
    }
}
