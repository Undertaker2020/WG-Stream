import {Injectable} from '@nestjs/common';
import {Action, Command, Ctx, Start, Update} from "nestjs-telegraf";
import {Context, Telegraf} from "telegraf";
import {PrismaService} from "@/src/core/prisma/prisma.service";
import {ConfigService} from "@nestjs/config";
import {TokenType, type User} from "@prisma/generated";
import {MESSAGES} from "@/src/modules/libs/telegram/telegram.messages";
import {BUTTONS} from "@/src/modules/libs/telegram/telegram.buttons";
import {SessionMetadata} from "@/src/shared/types/session-metadata.types";

@Update()
@Injectable()
export class TelegramService extends Telegraf {
    private readonly _token: string;

    public constructor(
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService
    ) {
        super(configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN'));
        this._token = configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN');
    }

    @Command('me')
    @Action('me')
    public async onMe(@Ctx() ctx: Context) {
        const chatId = ctx.chat?.id.toString()

        const user = await this.findUserByChatId(chatId!) as User;

        const followersCount = await this.prismaService.follow.count({
            where: {
                followingId: user.id
            }
        });

        await ctx.replyWithHTML(
            MESSAGES.profile(user, followersCount),
            BUTTONS.profile
        )
    }

    @Start()
    public async onStart(@Ctx() ctx: any) {
        const chatId = ctx.chat.id.toString()
        const token = ctx.message.text.split(' ')[1]

        if (token) {
            const username = ctx.message.from.username;

            await ctx.replyWithHTML(`Hello there. General ${username}!`);
            await ctx.sendAnimation('https://tenor.com/6uZZ.gif')

            const authToken = await this.prismaService.token.findUnique({
                where: {
                    token,
                    type: TokenType.TELEGRAM_AUTH
                }
            })

            if (!authToken) {
                return ctx.reply(MESSAGES.invalidToken);
            }

            const hasExpired = new Date(authToken.expiresIn) < new Date()

            if (hasExpired) {
                return ctx.reply(MESSAGES.invalidToken)
            }

            await this.connectTelegram(authToken.userId!, chatId);

            await this.prismaService.token.delete({
                where: {
                    id: authToken.id
                }
            })

            await ctx.replyWithHTML(
                MESSAGES.authSuccess,
                BUTTONS.authSuccess
            )
        } else {
            const user = await this.findUserByChatId(chatId);

            if (user) {
                return await this.onMe(ctx);

            } else {
                await ctx.replyWithHTML(MESSAGES.welcome, BUTTONS.profile)
            }
        }
    }

    @Command('follows')
    @Action('follows')
    public async onFollows(@Ctx() ctx: Context) {
        const chadId = ctx.chat!.id.toString()

        const user = await this.findUserByChatId(chadId) as User;
        const follows = await this.prismaService.follow.findMany({
            where: {
                followerId: user.id
            },
            include: {
                following: true
            }
        })

        if (user && follows.length) {
            const followsList = follows.map(follow => MESSAGES.follows(
                follow.following
            )).join('\n');
            const message = `<b>🌟 Channels you are subscribed to:</b>\n\n${followsList}`

            await ctx.replyWithHTML(message)
        } else {
            await ctx.replyWithHTML('\'<b>❌ You have no subscriptions.</b>\'')
        }

    }

    public async sendPasswordResetToken(
        chadId: string,
        token: string,
        metadata: SessionMetadata
    ) {
        await this.telegram.sendMessage(
            chadId,
            MESSAGES.resetPassword(token, metadata),
            {parse_mode: "HTML"});
    }

    public async sendDeactivateToken(
        chadId: string,
        token: string,
        metadata: SessionMetadata
    ) {
        await this.telegram.sendMessage(
            chadId,
            MESSAGES.deactivate(token, metadata),
            {parse_mode: "HTML"});
    }

    public async sendAccountDeletion(chadId: string) {
        await this.telegram.sendMessage(
            chadId,
            MESSAGES.accountDeleted,
            {parse_mode: 'HTML'})
    }

    public async sendStreamStart(chadId: string, channel: User) {
        await this.telegram.sendMessage(
            chadId,
            MESSAGES.streamStart(channel),
            {parse_mode: 'HTML'}
        );
    }

    public async sendNewFollowing(chadId: string, follower: User) {
        const user = await this.findUserByChatId(chadId);

        await this.telegram.sendMessage(
            chadId,
            MESSAGES.newFollowing(follower, user!.followings.length),
            {parse_mode: 'HTML'}
        );
    }

    private async connectTelegram(userId: string, chatId: string) {
        await this.prismaService.user.update({
            where: {
                id: userId
            },
            data: {
                telegramId: chatId,
            }
        })
    }

    private async findUserByChatId(chatId: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                telegramId: chatId
            },
            include: {
                followers: true,
                followings: true
            }
        })

        return user;
    }
}
