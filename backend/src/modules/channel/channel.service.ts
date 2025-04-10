import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "@/src/core/prisma/prisma.service";

@Injectable()
export class ChannelService {
    public constructor(private readonly prismaService: PrismaService) {}

    public async findRecommendedChannels() {
        const channels = await this.prismaService.user.findMany({
            where: {
                isDeactivated: false,
            },
            orderBy: {
                followings: {
                    _count: 'desc'
                }
            },
            include: {
                stream: true
            },
            take: 7
        });

        return channels;
    }

    public async findByUsername(username: string) {
        const channel = await this.prismaService.user.findUnique({
            where: {
                username,
                isDeactivated: false
            },
            include: {
                socialLinks: {
                    orderBy: {
                        position: 'asc'
                    }
                },
                stream: {
                    include: {
                        category: true
                    }
                },
                followings: true
            }
        })

        if (!channel) {
            throw new NotFoundException(`Unable to find channel with username: ${username}`);
        }

        return channel;
    }

    public async findFollowersCountByChannel(channelId: string) {
        const followers = this.prismaService.follow.count({
            where: {
                following: {
                    id: channelId
                }
            }
        })

        return followers;
    }

    public async findSponsorsByChannel(channelId: string) {
        const channel = await this.prismaService.user.findUnique({
            where: {
                id: channelId
            }
        })

        if(!channel) {
            throw new NotFoundException(`Unable to find channel with username: ${channelId}`);
        }

        const sponsors = await this.prismaService.sponsorshipSubscription.findMany({
            where: {
                channelId
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                plan: true,
                user: true,
                channel: true
            }
        })

        return sponsors;
    }
}
