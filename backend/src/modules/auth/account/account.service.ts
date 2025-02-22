import {ConflictException, Injectable} from '@nestjs/common';
import {PrismaService} from "@/src/core/prisma/prisma.service";
import {CreateUserInput} from "@/src/modules/auth/account/inputs/create-user.input";
import {hash} from "argon2";
import {VerificationService} from "@/src/modules/auth/verification/verification.service";

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

            }
        })

        await this.verificationService.sendVerificationToken(user)
        return true;
    }
}
