import { getTranslations } from 'next-intl/server'

import { StreamsList } from '@/components/features/stream/list/StreamsList'

import {
    FindRandomStreamsDocument,
    type FindRandomStreamsQuery
} from '@/graphql/generated/output'

import { SERVER_URL } from '@/libs/constants/url.constants'

async function findRandomStreams() {
    try {
        const query = FindRandomStreamsDocument.loc?.source.body

        const response = await fetch(SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query }),
            next: {
                revalidate: 30
            }
        })

        const data = await response.json()

        return {
            streams: data.data
                .findRandomStreams as FindRandomStreamsQuery['findRandomStreams']
        }
    } catch (error) {
        console.log(error)
        throw new Error('Ошибка при получении стримов')
    }
}


export default async function HomePage() {
    const t = await getTranslations('home')

    const { streams } = await findRandomStreams()


    return (
        <div className='space-y-10'>
            <StreamsList heading={t('streamsHeading')} streams={streams} />
        </div>
    )
}
