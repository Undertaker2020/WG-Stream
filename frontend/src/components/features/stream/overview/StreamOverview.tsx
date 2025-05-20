'use client'

import { LiveKitRoom } from '@livekit/components-react'

import type { FindChannelByUsernameQuery } from '@/graphql/generated/output'

import { useStreamToken } from '@/hooks/useStreamToken'

import { AboutChannel, AboutChannelSkeleton } from './info/AboutChannel'
import { ChannelSponsors } from './info/ChannelSponsors'
import { StreamInfo, StreamInfoSkeleton } from './info/StreamInfo'
import { StreamVideo, StreamVideoSkeleton } from './player/StreamVideo'
import {LIVEKIT_WS_URL} from "@/libs/constants/url.constants";

interface StreamOverviewProps {
	channel: FindChannelByUsernameQuery['findChannelByUsername']
}

export function StreamOverview({ channel }: StreamOverviewProps) {
	const { token, name, identity } = useStreamToken(channel.id)

	if (!token || !name || !identity) {
		return <StreamOverviewSkeleton />
	}

	return (
		<LiveKitRoom
			token={token}
			serverUrl={LIVEKIT_WS_URL}
			className='mx-auto grid max-w-screen-xl grid-cols-1 gap-6 lg:grid-cols-7'
		>
			<div className='order-1 col-span-1 flex flex-col lg:col-span-5'>
				<StreamVideo channel={channel} />
				<StreamInfo channel={channel} />
				<AboutChannel channel={channel} />
				<ChannelSponsors channel={channel} />
			</div>
		</LiveKitRoom>
	)
}

export function StreamOverviewSkeleton() {
	return (
		<div className='mx-auto grid max-w-screen-xl grid-cols-1 gap-6 lg:grid-cols-7'>
			<div className='order-1 col-span-1 flex flex-col lg:col-span-5'>
				<StreamVideoSkeleton />
				<StreamInfoSkeleton />
				<AboutChannelSkeleton />
			</div>
		</div>
	)
}
