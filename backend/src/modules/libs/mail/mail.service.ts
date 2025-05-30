import {Injectable} from '@nestjs/common';
import {MailerService} from "@nestjs-modules/mailer";
import {ConfigService} from "@nestjs/config";
import {VerificationTemplate} from "@/src/modules/libs/mail/templates/verification.template";
import {render} from "@react-email/components";
import {PasswordRecoveryTemplate} from "@/src/modules/libs/mail/templates/password-recovery.template";
import type {SessionMetadata} from "@/src/shared/types/session-metadata.types";
import {DeactivateTemplate} from "@/src/modules/libs/mail/templates/deactivate.template";
import {AccountDeletionTemplate} from "@/src/modules/libs/mail/templates/account-deletion.template";
import {EnableTwoFactorTemplate} from "@/src/modules/libs/mail/templates/enable-two-facrtor.template";
import {VerifyChannelTemplate} from "@/src/modules/libs/mail/templates/verify-channel.template";

@Injectable()
export class MailService {
    public constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService
    ) {}

    public async sendVerificationToken(email: string, token: string){
        const domain =  this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
        const html = await render(VerificationTemplate({domain, token}))

        return this.sendMail(email, 'Verification Token', html)
    }

    public async sendPasswordResetToken(email: string, token: string, metadata: SessionMetadata){
        const domain =  this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
        const html = await render(PasswordRecoveryTemplate({domain, token, metadata}))

        return this.sendMail(email, 'Reset password', html)
    }

    public async sendDeactivateToken(email: string, token: string, metadata: SessionMetadata){
        const html = await render(DeactivateTemplate({token, metadata}))

        return this.sendMail(email, 'Deactivate account', html)
    }

    public async sendAccountDeletion(email: string) {
        const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
        const html = await render(AccountDeletionTemplate({domain}))

        return this.sendMail(email, 'Account Deleted', html)
    }

    public async sendEnableTwoFactor(email: string) {
        const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
        const html = await render(EnableTwoFactorTemplate({domain}))

        return this.sendMail(email, 'Secure your account', html)
    }

    public async sendVerifyChannel(email: string) {
        const html = await render(VerifyChannelTemplate())

        return this.sendMail(email, 'Your channel has been verified', html)
    }

    private sendMail(email: string, subject: string, html: string) {
        return this.mailerService.sendMail({
            from: this.configService.getOrThrow<string>('MAIL_FROM'),
            to: email,
            subject,
            html
        })
    }
}