import * as dotenv from "dotenv";
import {ConfigService} from "@nestjs/config";
import * as process from "node:process";

dotenv.config();

export function isDev(configService: ConfigService) {
    return configService.getOrThrow<string>('NODE_ENV') === 'development';
}

export const IS_DEV_ENV = process.env.NODE_ENV === 'development';