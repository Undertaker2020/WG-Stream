import {Share} from 'lucide-react'
import {useTranslations} from 'next-intl'
import {FaReddit, FaTelegram} from 'react-icons/fa'
import {FaXTwitter} from 'react-icons/fa6'
import {RedditShareButton, TelegramShareButton, TwitterShareButton,} from 'react-share'

import {Button} from '@/components/ui/common/Button'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/common/Popover'

import type {FindChannelByUsernameQuery} from '@/graphql/generated/output'
import {Separator} from "@/components/ui/common/Separator";

interface ShareActionsProps {
    channel: FindChannelByUsernameQuery['findChannelByUsername']
}

export function ShareActions({channel}: ShareActionsProps) {
    const t = useTranslations('stream.actions.share')

    const shareUrl = `${window.location.origin}/${channel.username}`

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant='ghost' size='lgIcon'>
                    <Share className='size-5'/>
                </Button>
            </PopoverTrigger>
            <PopoverContent side='top' className='w-[225px]'>
                <h2 className='font-medium'>{t('heading')}</h2>
                <Separator className='my-3'/>
                <div className='grid grid-cols-3 gap-3'>
                    <TelegramShareButton url={shareUrl}>
                        <div
                            className='flex rounded-full h-14 items-center justify-center bg-sky-500 transition-transform hover:-translate-y-1.5'>
                            <FaTelegram className='size-12 text-white'/>
                        </div>
                    </TelegramShareButton>
                    <TwitterShareButton url={shareUrl}>
                        <div
                            className='flex rounded-full h-14 items-center justify-center bg-black transition-transform hover:-translate-y-1.5'>
                            <FaXTwitter className='size-8 text-white'/>
                        </div>
                    </TwitterShareButton>
                    <RedditShareButton url={shareUrl}>
                        <div
                            className='flex rounded-full h-14 items-center justify-center bg-orange-600 transition-transform hover:-translate-y-1.5'>
                            <FaReddit className='size-12 text-white'/>
                        </div>
                    </RedditShareButton>
                </div>
            </PopoverContent>
        </Popover>
    )
}
