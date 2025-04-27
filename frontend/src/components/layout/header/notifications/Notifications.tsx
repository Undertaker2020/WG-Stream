import {useFindNotificationUnreadCountQuery} from "@/graphql/generated/output";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/common/Popover";
import {Bell} from "lucide-react";
import {NotificationsList} from "@/components/layout/header/notifications/NotificationsList";

export function Notifications() {
    const {data, loading: isLoadingCount} = useFindNotificationUnreadCountQuery()

    const count = data?.findNotificationUnreadCount ?? 0;

    const displayCount = count > 10 ? '+9' : count;

    if (isLoadingCount) return null

    return (
        <Popover>
            <PopoverTrigger>
                {count !== 0 && (
                    <div
                        className='absolute right-[72px] top-5 rounded-full
                                    bg-primary px-[5px] text-xs font-semibold
                                    text-white'>
                        {displayCount}
                    </div>
                )}
                <Bell className='size-5 text-foreground'/>
            </PopoverTrigger>
            <PopoverContent align='end' className='max-h-[500px] w-[320px] overflow-y-auto'>
                <NotificationsList/>
            </PopoverContent>
        </Popover>
    )
}