import {cn} from "@/utils/tw-merge";
import {cva, type VariantProps} from "class-variance-authority";
import {Verified} from "lucide-react";

const channelVerifiedSizes = cva('', {
    variants: {
        size: {
            sm: 'size-3',
            default: 'size-4'
        }
    },
    defaultVariants: {
        size: 'default'
    }
})

interface ChannelVerifiedProps extends VariantProps<typeof channelVerifiedSizes> {
}

export function ChannelVerified({size}: ChannelVerifiedProps) {
    return (
        <span
            className={cn('flex items-center justify-center',
                channelVerifiedSizes({size})
            )}>
            <Verified className={cn('stroke-[2px] text-white fill-primary',
                `!${size === 'sm' ? 'size-4' : 'size-[11px]'}`
            )}/>
        </span>
    )
}