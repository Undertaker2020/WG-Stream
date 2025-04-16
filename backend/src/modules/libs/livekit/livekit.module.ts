import {type DynamicModule, Module} from '@nestjs/common';
import {
    LiveKitOptionsSymbol,
    type TypeLiveKitAsyncOptions,
    type TypeLiveKitOptions
} from "@/src/modules/libs/livekit/types/livekit.types";
import {LivekitService} from "@/src/modules/libs/livekit/livekit.service";

@Module({})
export class LiveKitModule {
    public static register(options: TypeLiveKitOptions):DynamicModule {
        return {
            module: LiveKitModule,
            providers: [
                {
                    provide: LiveKitOptionsSymbol,
                    useValue: options,
                },
                LivekitService
            ],
            exports: [LivekitService],
            global: true
        }
    }

    public static registerAsync(options: TypeLiveKitAsyncOptions):DynamicModule {
        return {
            module: LiveKitModule,
            imports: options.imports || [],
            providers: [
                {
                    provide: LiveKitOptionsSymbol,
                    useFactory: options.useFactory,
                    inject: options.inject || [],
                },
                LivekitService
            ],
            exports: [LivekitService],
            global: true
        }
    }
}