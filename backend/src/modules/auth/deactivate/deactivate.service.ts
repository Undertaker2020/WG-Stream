import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "@/src/core/prisma/prisma.service";
import {ConfigService} from "@nestjs/config";
import {MailService} from "@/src/modules/libs/mail/mail.service";
import {Request} from "express";
import {TokenType, User} from "@prisma/generated";
import {destroySession} from "@/src/shared/utils/session.util";
import {generateToken} from "@/src/shared/utils/generate-token.util";
import {getSessionMetadata} from "@/src/shared/utils/session-metadata.util";
import {DeactivateAccountInput} from "@/src/modules/auth/deactivate/inputs/deactivate-account.input";
import {verify} from "argon2";
import {TelegramService} from "@/src/modules/libs/telegram/telegram.service";

@Injectable()
export class DeactivateService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService,
        private readonly mailService: MailService,
        private readonly telegramService: TelegramService,
    ) {
    }

    public async deactivate(
        req: Request,
        input: DeactivateAccountInput,
        user: User,
        userAgent: string
    ) {
        const {email, password, pin} = input;

        if (user.email !== email) {
            throw new BadRequestException('Invalid email address');
        }

        const isValidPassword = await verify(user.password, password);

        if (!isValidPassword) {
            throw new BadRequestException('Invalid password');
        }

        if (!pin) {
            await this.sendDeactivateToken(req, user, userAgent);

            return { message: 'Verification code required'};
        }

        await this.validateDeactivateToken(req, pin);

        return { user }
    }

    private async validateDeactivateToken(req: Request, token: string) {
        const existingToken = await this.prismaService.token.findUnique({
            where: {
                token,
                type: TokenType.DEACTIVATE_ACCOUNT
            }
        })

        if (!existingToken) {
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
                isDeactivated: true,
                deactivatedAt: new Date()
            }
        })
        await this.prismaService.token.delete({
            where: {
                id: existingToken.id,
                type: TokenType.DEACTIVATE_ACCOUNT
            }
        })

        return destroySession(req, this.configService);
    }

    public async sendDeactivateToken(req: Request, user: User, userAgent: string) {
        const deactivateToken = await generateToken(
            this.prismaService,
            user,
            TokenType.DEACTIVATE_ACCOUNT,
            false
        );

        const metadata = getSessionMetadata(req, userAgent)

        await this.mailService.sendDeactivateToken(
            user.email,
            deactivateToken.token,
            metadata
        )

        if (deactivateToken.user?.notificationSettings?.telegramNotifications && deactivateToken.user.telegramId) {
            await this.telegramService.sendDeactivateToken(
                deactivateToken.user.telegramId,
                deactivateToken.token,
                metadata
            )

            await this.telegramService.sendAccountDeletion(
                deactivateToken.user.telegramId
            )
        }

        return true;
    }
}
