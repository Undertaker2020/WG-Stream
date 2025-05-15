import {useTranslations} from 'next-intl'
import {PropsWithChildren, useEffect, useRef} from 'react'

import {Dialog, DialogContent, DialogTitle, DialogTrigger,} from '@/components/ui/common/Dialog'

import type {FindSessionsByUserQuery} from '@/graphql/generated/output'

import {formatDate} from '@/utils/format-date'

import {GoogleMap} from '@react-google-maps/api'

interface SessionModalProps {
    session: FindSessionsByUserQuery['findSessionByUser'][0]
}

export function SessionModal({children, session}: PropsWithChildren<SessionModalProps>) {
    const t = useTranslations('dashboard.settings.sessions.sessionModal')

    const center = {
        lat: session.metadata.location.latitude,
        lng: session.metadata.location.longitude,
    }

    const containerStyle = {
        width: '100%',
        height: '300px',
    }

    const mapRef = useRef<google.maps.Map | null>(null)

    useEffect(() => {
        if (!mapRef.current) return

        (async () => {
            const {AdvancedMarkerElement} = await google.maps.importLibrary(
                'marker'
            ) as google.maps.MarkerLibrary

            new AdvancedMarkerElement({
                map: mapRef.current!,
                position: center,
                title: `${session.metadata.location.city}, ${session.metadata.location.country}`,
            })
        })()
    }, [session, center])

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent aria-describedby={undefined}>
                <DialogTitle className="text-xl">{t('heading')}</DialogTitle>
                <div className="space-y-3">
                    <div className="flex items-center">
                        <span className="font-medium">{t('device')}</span>
                        <span className="ml-2 text-muted-foreground">
              {session.metadata.device.browser}, {session.metadata.device.os}
            </span>
                    </div>

                    <div className="flex items-center">
                        <span className="font-medium">{t('location')}</span>
                        <span className="ml-2 text-muted-foreground">
              {session.metadata.location.country}, {session.metadata.location.city}
            </span>
                    </div>

                    <div className="flex items-center">
                        <span className="font-medium">{t('ipAddress')}</span>
                        <span className="ml-2 text-muted-foreground">
              {session.metadata.ip}
            </span>
                    </div>

                    <div className="flex items-center">
                        <span className="font-medium">{t('createdAt')}</span>
                        <span className="ml-2 text-muted-foreground">
              {formatDate(session.createdAt, true)}
            </span>
                    </div>
                    <div style={containerStyle}>
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={center}
                            zoom={11}
                            onLoad={(map) => {
                                mapRef.current = map
                            }}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
