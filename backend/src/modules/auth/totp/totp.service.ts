import {BadRequestException, Injectable} from '@nestjs/common';
import {PrismaService} from '@/src/core/prisma/prisma.service';
import type {User} from '@prisma/generated';
import {encode} from 'hi-base32';
import {randomBytes} from 'crypto'
import {TOTP} from 'otpauth';
import * as QRCode from 'qrcode'
import {EnableTotpInput} from "@/src/modules/auth/totp/inputs/enable-totp.input";

@Injectable()
export class TotpService {
    public constructor(private readonly prismaService: PrismaService) {}

    public async generate(user: User){
        const secret = encode(randomBytes(15))
            .replace(/=/g, '')
            .substring(0, 24)

        const totp = new TOTP({
            issuer: 'WG-Stream',
            label: `${user.email}`,
            algorithm: 'SHA1',
            digits: 6,
            secret
        })

        const oauthUrl = totp.toString()
        const qrcodeUrl = await QRCode.toDataURL(oauthUrl);

        return { qrcodeUrl, secret}
    }

    public async enable(user: User, input: EnableTotpInput){
        const { secret, pin } = input;

        const totp = new TOTP({
            issuer: 'WG-Stream',
            label: `${user.email}`,
            algorithm: 'SHA1',
            digits: 6,
            secret
        })

        const delta = totp.validate({token: pin})

        if(delta === null){
            throw new BadRequestException('Totp is invalid')
        }

        await this.prismaService.user.update({
            where: {
                id: user.id
            },
            data: {
                isTotpEnabled: true,
                totpSecret: secret
            }
        })

        return true;
    }

    public async disable(user: User){
        await this.prismaService.user.update({
            where: {
                id: user.id
            },
            data: {
                isTotpEnabled: false,
                totpSecret: null
            }
        })

        return true;
    }
}
