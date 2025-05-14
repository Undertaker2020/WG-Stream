import {Heading} from "@/components/ui/elements/Heading";
import {useTranslations} from "next-intl";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/common/Tabs";
import {ChangeAvatarForm} from "@/components/features/user/profile/ChangeAvatarForm";
import {ChangeInfoForm} from "@/components/features/user/profile/ChangeInfoForm";
import {SocialLinksForm} from "@/components/features/user/profile/social-links-form/SocialLinksForm";
import {ChangeEmailForm} from "@/components/features/user/account/ChangeEmailForm";
import {ChangePasswordForm} from "@/components/features/user/account/ChangePasswordForm";
import {DeactivateCard} from "@/components/features/user/account/DeactivateCard";
import {WrapperTotp} from "@/components/features/user/account/totp/WrapperTotp";
import {ChangeThemeForm} from "@/components/features/user/appearance/ChangeThemeForm";
import {ChangeLanguageForm} from "@/components/features/user/appearance/ChangeLanguageForm";
import {ChangeColorForm} from "@/components/features/user/appearance/ChangeColorForm";

export function UserSettings() {
    const t = useTranslations('dashboard.settings')

    return (
        <div className='lg:px-10'>
            <Heading
                title={t('header.heading')}
                description={t('header.description')}
                size='lg'
            />
            <Tabs defaultValue='profile' className='mt-3 w-full'>
                <TabsList className='grid w-full w grid-cols-5'>
                    <TabsTrigger value='profile'>
                        {t('header.profile')}
                    </TabsTrigger>
                    <TabsTrigger value='account'>
                        {t('header.account')}
                    </TabsTrigger>
                    <TabsTrigger value='appearance'>
                        {t('header.appearance')}
                    </TabsTrigger>
                    <TabsTrigger value='notifications'>
                        {t('header.notifications')}
                    </TabsTrigger>
                    <TabsTrigger value='sessions'>
                        {t('header.sessions')}
                    </TabsTrigger>
                </TabsList>
                <TabsContent value='profile'>
                    <div className="mt-5 space-y-6">
                        <Heading
                            title={t('profile.header.heading')}
                            description={t('profile.header.description')}
                        />
                        <ChangeAvatarForm/>
                        <ChangeInfoForm/>
                        <SocialLinksForm/>
                    </div>
                </TabsContent>
                <TabsContent value='account'>
                    <div className='mt-5 space-y-6'>
                        <Heading
                            title={t('account.header.heading')}
                            description={t('account.header.description')}
                        />
                        <ChangeEmailForm />
                        <ChangePasswordForm />
                        <Heading
                            title={t('account.header.securityHeading')}
                            description={t(
                                'account.header.securityDescription'
                            )}
                        />
                        <WrapperTotp />
                        <Heading
                            title={t('account.header.deactivationHeading')}
                            description={t(
                                'account.header.deactivationDescription'
                            )}
                        />
                        <DeactivateCard />
                    </div>
                </TabsContent>
                <TabsContent value='appearance'>
                    <div className='mt-5 space-y-6'>
                        <Heading
                            title={t('appearance.header.heading')}
                            description={t('appearance.header.description')}
                        />
                        <ChangeThemeForm />
                        <ChangeLanguageForm />
                        <ChangeColorForm />
                    </div>
                </TabsContent>
                <TabsContent value='notifications'></TabsContent>
                <TabsContent value='sessions'></TabsContent>
            </Tabs>
        </div>
    )
}
