import {BadRequestException, Injectable, NotAcceptableException, NotFoundException} from '@nestjs/common';
import {PrismaService} from "@/src/core/prisma/prisma.service";
import {MailService} from "@/src/modules/libs/mail/mail.service";
import type {Request} from "express";
import {ResetPasswordInput} from "@/src/modules/auth/password-recover/inputs/reset-password.input";
import {generateToken} from "@/src/shared/utils/generate-token.util";
import {TokenType} from "@prisma/generated";
import {getSessionMetadata} from "@/src/shared/utils/session-metadata.util";
import {NewPasswordInput} from "@/src/modules/auth/password-recover/inputs/new-password.input";
import {hash} from "argon2";
import {TelegramService} from "@/src/modules/libs/telegram/telegram.service";

@Injectable()
export class PasswordRecoverService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly mailService: MailService,
        private readonly telegramService: TelegramService,
    ) {}

    public async resetPassword(
        req: Request,
        input: ResetPasswordInput,
        userAgent: string
    ){
        const { email } = input;

        const user = await this.prismaService.user.findFirst({
            where: {
                email,
            },
            include: {
                notificationSettings: true
            }
        });

        if (!user) {
            throw new NotAcceptableException('User does not exist');
        }

        const resetToken = await generateToken(
            this.prismaService,
            user,
            TokenType.PASSWORD_RESET
        )

        const metadata = getSessionMetadata(req, userAgent);

        await this.mailService.sendPasswordResetToken(
            user.email,
            resetToken.token,
            metadata
        );

        if (resetToken.user?.notificationSettings?.telegramNotifications && resetToken.user.telegramId) {
            await this.telegramService.sendPasswordResetToken(
                resetToken.user.telegramId,
                resetToken.token,
                metadata
            )
        }

        return true
    }

    public async newPassword(input: NewPasswordInput){
        const {password, token} = input;

        const existingToken = await this.prismaService.token.findUnique({
            where: {
                token,
                type: TokenType.PASSWORD_RESET
            }
        })
        if(!existingToken) {
            throw new NotFoundException("No token found");
        }

        const hasExpired = new Date(existingToken.expiresIn) < new Date()

        if (hasExpired) {
            throw new BadRequestException("Token expired");
        }

        await this.prismaService.user.update({
            where: {
                //@ts-ignore
                id: existingToken.userId,
            },
            data: {
                password: await hash(password),
            }
        })
        await this.prismaService.token.delete({
            where: {
                id: existingToken.id,
                type: TokenType.PASSWORD_RESET
            }
        })

        return true
    }
}
