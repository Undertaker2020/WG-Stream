import { PrismaClient, Prisma } from '../../../prisma/generated'
import {BadRequestException, Logger} from "@nestjs/common";
import { CATEGORIES } from './data/categories.data'
import { STREAMS } from './data/streams.data'
import { USERNAMES } from './data/users.data'
import {hash} from "argon2";

const prisma = new PrismaClient({
    transactionOptions: {
        maxWait: 5000,
        timeout: 20000,
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable
    }
})

async function main() {
    try {
        Logger.log('Start filling the database...');

        await prisma.$transaction([
            prisma.user.deleteMany(),
            prisma.socialLink.deleteMany(),
            prisma.stream.deleteMany(),
            prisma.category.deleteMany(),
        ])

        await prisma.category.createMany({
            data: CATEGORIES
        })

        Logger.log('Category successfully created!');

        const categories = await prisma.category.findMany();

        const categoriesBySlug = Object.fromEntries(
            categories.map(category =>
                [category.slug, category]
            )
        );

        await prisma.$transaction(async tx => {
            for (const username of USERNAMES) {
                const randomCategory =
                    categoriesBySlug[
                        Object.keys(categoriesBySlug)[
                            Math.floor(
                                Math.random() * Object.keys(categoriesBySlug).length
                            )]
                        ]


                const userExists = await tx.user.findUnique({
                    where: {
                        username
                    }
                })

                if (!userExists) {
                    const createdUser = await tx.user.create({
                        data: {
                            email: `${username}@gmail.com`,
                            password: await hash('12345678'),
                            username,
                            displayName: username,
                            avatar: `/streams/${username}.webp`,
                            isEmailVerified: true,
                            socialLinks: {
                                createMany: {
                                    data: [
                                        {
                                            title: 'Telegram',
                                            url: `https://t.me/${username}`,
                                            position: 1
                                        },
                                        {
                                            title: 'Instagram',
                                            url: `https://www.instagram.com/${username}`,
                                            position: 2
                                        }
                                    ]
                                }
                            },
                            notificationSettings: {
                                create:{
                                    siteNotifications: false,
                                    telegramNotifications: false,
                                }
                            }
                        }
                    })

                    const randomTitles = STREAMS[randomCategory.slug];

                    const randomTitle = randomTitles[Math.floor(Math.random() * randomTitles.length)];

                    await tx.stream.create({
                        data: {
                            title: randomTitle,
                            thumbnailUrl: `/streams/${createdUser.username}.webp`,
                            user: {
                                connect: {
                                    id: createdUser.id
                                }
                            },
                            category: {
                                connect: {
                                    id: randomCategory.id
                                }
                            }
                        }
                    })

                    Logger.log(`User ${createdUser.username} and his Stream successfully created!`);
                }
            }
        })

        Logger.log('Filling database complete successfully!');
    } catch (error) {
        Logger.error(error);
        throw new BadRequestException('Error filling the database');
    } finally {
        Logger.log('Closing database connection...');
        await prisma.$disconnect()
        Logger.log('Database connection closed successfully')
    }
}

main()