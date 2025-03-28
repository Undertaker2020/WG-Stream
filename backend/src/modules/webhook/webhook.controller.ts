import {Controller, HttpCode, HttpStatus, Post, Body, Headers, UnauthorizedException} from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  public constructor(private readonly webhookService: WebhookService) {}

  @Post('livekit')
  @HttpCode(HttpStatus.OK)
  public async receiveWebhookLivekit(
      @Body() body: string,
      @Headers('Authorization') authorization: string
  ){
    if (!authorization) {
       throw new UnauthorizedException('Title is missing');
    }

    return this.webhookService.receiveWebhookLivekit(body, authorization);
  }
}
