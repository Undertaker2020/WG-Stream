import {Injectable} from '@nestjs/common';
import {LivekitService} from "@/src/modules/libs/livekit/livekit.service";
import {PrismaService} from "@/src/core/prisma/prisma.service";

@Injectable()
export class WebhookService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly livekitService: LivekitService,
    ) {
    }

    public async receiveWebhookLivekit(body: string, authorization: string) {
        const event = await this.livekitService.receiver.receive(
            body,
            authorization,
            true
        )

        if (event.event === 'ingress_started') {
            await this.prismaService.stream.update({
                where: {
                    ingressId: event.ingressInfo?.ingressId
                },
                data: {
                    isLive: true
                }
            })
        }

        if (event.event === 'ingress_ended') {
            await this.prismaService.stream.update({
                where: {
                    ingressId: event.ingressInfo?.ingressId
                },
                data: {
                    isLive: false
                }
            })
        }
    }
}
