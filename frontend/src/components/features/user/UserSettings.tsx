import {Heading} from "@/components/ui/elements/Heading";
import {useTranslations} from "next-intl";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/common/Tabs";

export function UserSettings() {
    const t = useTranslations('dashboard.settings.header')

    return (
        <div className='lg:px-10'>
            <Heading
                title={t('heading')}
                description={t('description')}
                size='lg'
            />
            <Tabs defaultValue='profile' className='mt-3 w-full'>
                <TabsList className='grid w-full w grid-cols-5'>
                    <TabsTrigger value='profile'>
                        {t('profile')}
                    </TabsTrigger>
                    <TabsTrigger value='account'>
                        {t('account')}
                    </TabsTrigger>
                    <TabsTrigger value='appearance'>
                        {t('appearance')}
                    </TabsTrigger>
                    <TabsTrigger value='notifications'>
                        {t('notifications')}
                    </TabsTrigger>
                    <TabsTrigger value='sessions'>
                        {t('sessions')}
                    </TabsTrigger>
                </TabsList>
                <TabsContent value='profile'></TabsContent>
                <TabsContent value='account'></TabsContent>
                <TabsContent value='appearance'></TabsContent>
                <TabsContent value='notifications'></TabsContent>
                <TabsContent value='sessions'></TabsContent>
            </Tabs>
        </div>
    )
}
