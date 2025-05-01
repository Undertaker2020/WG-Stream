'use client'

import {Separator} from "@/components/ui/common/Separator";
import {useTranslations} from "next-intl";
import {useSidebar} from "@/hooks/useSidebar";
import {useFindRecommendedChannelsQuery} from "@/graphql/generated/output";
import {ChannelItem, ChannelItemSkeleton} from "@/components/layout/sidebar/ChannelItem";

export function RecommendedChannels(){
    const t = useTranslations('layout.sidebar.recommended')

    const { isCollapsed } = useSidebar()

    const { data, loading: isLoadingRecommended } =
        useFindRecommendedChannelsQuery()
    const channels = data?.findRecommendedChannels ?? []

    return (
        <div>
            <Separator className='mb-3' />
            {!isCollapsed && (
                <h2 className='mb-2 px-2 text-lg font-semibold text-foreground'>
                    {t('heading')}
                </h2>
            )}
            {isLoadingRecommended
                ? Array.from({ length: 7 }).map((_, index) => (
                    <ChannelItemSkeleton key={index} />
                ))
                : channels.map((channel, index) => (
                    <ChannelItem key={index} channel={channel} />
                ))}
        </div>
    )
}