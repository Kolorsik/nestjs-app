import { ApiProperty } from '@nestjs/swagger';

export class SuccessMailDto {
    @ApiProperty()
    readonly accepted: string[];

    @ApiProperty()
    readonly rejected: string[];

    @ApiProperty()
    readonly envelopeTime: number;

    @ApiProperty()
    readonly messageTime: number;

    @ApiProperty()
    readonly messageSize: number;

    @ApiProperty()
    readonly response: string;

    @ApiProperty()
    readonly envelope: {
        from: string;
        to: string[];
    };

    @ApiProperty()
    readonly messageId: string;
}
