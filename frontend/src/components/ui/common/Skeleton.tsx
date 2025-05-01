import {cn} from "@/utils/tw-merge";
import type {HTMLAttributes} from "react";


function Skeleton({
                      className,
                      ...props
                  }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("animate-pulse rounded-lg bg-card dark:bg-muted", className)}
            {...props}
        />
    )
}

export { Skeleton }
