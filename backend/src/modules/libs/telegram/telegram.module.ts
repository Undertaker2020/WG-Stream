import {Global, Module} from '@nestjs/common';
import {TelegramService} from './telegram.service';
import {TelegrafModule} from "nestjs-telegraf";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {getTelegrafConfig} from "@/src/core/config/telegraf.config";

@Global()
@Module({
    imports: [
      TelegrafModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: getTelegrafConfig,
          inject: [ConfigService],
      })
    ],
    providers: [TelegramService],
    exports: [TelegramService]
})
export class TelegramModule {
}
