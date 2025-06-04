import {useTranslations} from 'next-intl'
import {toast} from 'sonner'

import {Button} from '@/components/ui/common/Button'
import {CardContainer} from '@/components/ui/elements/CardContainer'
import {ConfirmModal} from '@/components/ui/elements/ConfirmModal'

import {
    type FindSessionsByUserQuery,
    useFindSessionsByUserQuery,
    useRemoveSessionMutation
} from '@/graphql/generated/output'

import {getBrowserIcon} from '@/utils/get-browser-icon'

import {SessionModal} from '@/components/features/user/sessions/SessionModal'
import {GOOGLE_MAP_API} from "@/libs/constants/url.constants";
import {useJsApiLoader} from '@react-google-maps/api'

interface SessionItemProps {
    session: FindSessionsByUserQuery['findSessionByUser'][0]
    isCurrentSession?: boolean
}

export function SessionItem({session, isCurrentSession}: SessionItemProps) {
    const t = useTranslations('dashboard.settings.sessions.sessionItem')

    const {refetch} = useFindSessionsByUserQuery()

    const [remove, {loading: isLoadingRemove}] = useRemoveSessionMutation({
        onCompleted() {
            refetch()
            toast.success(t('successMessage'))
        },
        onError() {
            toast.error(t('errorMessage'))
        }
    })
    const {isLoaded, loadError} = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAP_API,
    })
    if (loadError) {
        return <div>Помилка завантаження карт</div>
    }
    if (!isLoaded) {
        return <div>Завантаження карт...</div>
    }

    const Icon = getBrowserIcon(session.metadata.device.browser)

    return (
        <CardContainer
            heading={`${session.metadata.device.browser}, ${session.metadata.device.os}`}
            description={`${session.metadata.location.country}, ${session.metadata.location.city}`}
            Icon={Icon}
            rightContent={
                <div className='flex items-center gap-x-4'>
                    {!isCurrentSession && (
                        <ConfirmModal
                            heading={t('confirmModal.heading')}
                            message={t('confirmModal.message')}
                            onConfirm={() =>
                                remove({variables: {id: session.id}})
                            }
                        >
                            <Button
                                variant='secondary'
                                disabled={isLoadingRemove}
                            >
                                {t('deleteButton')}
                            </Button>
                        </ConfirmModal>
                    )}
                    <SessionModal session={session}>
                        <Button>{t('detailsButton')}</Button>
                    </SessionModal>
                </div>
            }
        />
    )
}
