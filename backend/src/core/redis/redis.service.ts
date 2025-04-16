import { Injectable } from '@nestjs/common';
import Redis from "ioredis";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class RedisService extends Redis {
  public constructor (private readonly configService: ConfigService) {
    super(configService.getOrThrow<string>('REDIS_URI'));
  }
}
