import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import {PrismaService} from "@/src/core/prisma/prisma.service";
import {LoginInput} from "@/src/modules/auth/session/inputs/login.input";
import {verify} from "argon2";
import type {Request} from "express";
import {ConfigService} from "@nestjs/config";
import {getSessionMetadata} from "@/src/shared/utils/session-metadata.util";
import {RedisService} from "@/src/core/redis/redis.service";
import {SessionData} from "express-session";
import {destroySession, saveSession} from "@/src/shared/utils/session.util";
import {VerificationService} from "@/src/modules/auth/verification/verification.service";
import {TOTP} from "otpauth";
import {UserModel} from "@/src/modules/auth/account/models/user.model";

@Injectable()
export class SessionService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService,
        private readonly redisService: RedisService,
        private readonly verificationService: VerificationService,
    ) {
    }

    public async findByUser(req: Request) {
        const userId = req.session.userId;

        if (!userId) {
            throw new NotFoundException("No user with this session");
        }

        const keys = await this.redisService.keys('*')

        const userSessions: SessionData[] = []

        for (const key of keys) {
            const sessionData = await this.redisService.get(key)

            if (sessionData) {
                const session = JSON.parse(sessionData);

                if (session.userId === userId) {
                    userSessions.push({
                        ...session,
                        id: key.split(':')[1]
                    })
                }
            }
        }
        // @ts-ignore
        userSessions.sort((a, b) => b.createdAt - a.createdAt)

        return userSessions.filter(session => session.id === req.session.id || session.id !== req.session.id );
    }

    public async findCurrent(req: Request) {
        const sessionId = req.session.id;

        const sessionData = await this.redisService.get(`${this.configService.getOrThrow<string>('SESSION_FOLDER')}${sessionId}`);


        const session = JSON.parse(sessionData!);
        return {
            ...session,
            id: sessionId,
        };
    }

    public async login(req: Request, input: LoginInput, userAgent: string) {
        const {login, password, pin} = input;

        const user = await this.prismaService.user.findFirst({
            where: {
                OR: [
                    {username: {equals: login}},
                    {email: {equals: login}}
                ]
            }
        }) as UserModel;
        if (!user) {
            throw new NotFoundException('Invalid login credentials');
        }

        const isValidPassword = await verify(user.password, password);

        if (!isValidPassword) {
            throw new UnauthorizedException('Passwords do not match');
        }

        if(!user.isEmailVerified){
            await this.verificationService.sendVerificationToken(user);

            throw new BadRequestException("Account not verified. Please check your email for confirmation");
        }

        if (user.isTotpEnabled) {
            if (!pin) {
                return {
                    message: 'A code is required to complete the authorization'
                }
            }
            const totp = new TOTP({
                issuer: 'WG-Stream',
                label: `${user.email}`,
                algorithm: 'SHA1',
                digits: 6,
                secret: user.totpSecret,
            })

            const delta = totp.validate({token: pin})
            if (delta === null) {
                throw new BadRequestException('Totp is invalid')
            }
        }

        const metadata = getSessionMetadata(req, userAgent);
        return saveSession(req, user, metadata);
    }

    public async logout(req: Request) {
       return destroySession(req, this.configService)
    }

    public async clearSession(req: Request) {
        req.res?.clearCookie(
            this.configService.getOrThrow<string>('SESSION_NAME')
        )
        return true
    }

    public async removeSession(req: Request, id: string) {
        if(req.session.id === id) {
            throw new ConflictException('The current session cannot be deleted.')
        }

        await this.redisService.del(`${this.configService.getOrThrow<string>('SESSION_FOLDER')}${id}`);

        return true
    }
}
