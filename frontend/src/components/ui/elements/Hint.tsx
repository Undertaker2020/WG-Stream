import {type PropsWithChildren} from "react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/common/Tooltip";

interface HintProps {
    label: string;
    asChild?: boolean;
    side?: 'top' | 'bottom' | 'left' | 'right';
    aline?: 'start' | 'center' | 'end';
}

export function Hint({label, side, aline, asChild, children}: PropsWithChildren<HintProps>) {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild={asChild}>
                    {children}
                </TooltipTrigger>
                <TooltipContent className='dark:bg-white dark:text-[#1f2128] bg-[#1f2128] text-white' side={side} align={aline}>
                    <p className='font-semibold'>{label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}