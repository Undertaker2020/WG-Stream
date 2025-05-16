import {ConflictException, Injectable, UnauthorizedException} from '@nestjs/common';
import {PrismaService} from "@/src/core/prisma/prisma.service";
import {CreateUserInput} from "@/src/modules/auth/account/inputs/create-user.input";
import {hash, verify} from "argon2";
import {VerificationService} from "@/src/modules/auth/verification/verification.service";
import type {User} from "@prisma/generated";
import {ChangeEmailInput} from "@/src/modules/auth/account/inputs/change-email.input";
import {ChangePasswordInput} from "@/src/modules/auth/account/inputs/change-password.input";

@Injectable()
export class AccountService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly verificationService: VerificationService
    ) {}

    public async me(id: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id
            },
            include: {
                socialLinks: true,
                stream: true,
                notificationSettings: true
            }
        })
        return user;
    }

    public async create(input: CreateUserInput){
        const {username, email, password} = input;
        const isUsernameExist = await this.prismaService.user.findUnique({
            where: {
                username
            }
        });
        if (isUsernameExist) {
            throw new ConflictException("Username already exist");
        }

        const isEmailExist = await this.prismaService.user.findUnique({
            where: {
                email
            }
        })
        if (isEmailExist) {
            throw new ConflictException("Email already exist");
        }

        const user =  await this.prismaService.user.create({
            data: {
                username,
                email,
                password: await hash(password),
                displayName: username,
                stream: {
                    create: {
                        title: `Stream with ${username}`,
                    }
                },
                notificationSettings: {
                    create: {}
                }
            }
        })

        await this.verificationService.sendVerificationToken(user)

        return true;
    }

    public async changeEmail(user: User, input: ChangeEmailInput){
        const { email } = input;

        await this.prismaService.user.update({
            where: {
                id: user.id
            },
            data: {
                email,
            }
        })

        return true;
    }

    public async changePassword(user: User, input: ChangePasswordInput){
        const { oldPassword, newPassword } = input;

        const isValidPassword = await verify(user.password, oldPassword);

        if (!isValidPassword) {
            throw new UnauthorizedException("Incorrect password");
        }

        if (oldPassword === newPassword) {
            throw new UnauthorizedException("The new password cannot match the old one");
        }

        await this.prismaService.user.update({
            where: {
                id: user.id
            },
            data: {
                password: await hash(newPassword),
            }
        })

        return true;
    }
}
