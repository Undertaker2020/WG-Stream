'use client'

import {useTranslations} from "next-intl";
import {useRouter} from "next/navigation";
import {useAuth} from "@/hooks/useAuth";
import {useCurrent} from "@/hooks/useCurrent";
import {LayoutDashboard, Loader, LogOut, User} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/common/DropdownMenu";
import {ChannelAvatar} from "@/components/ui/elements/ChannelAvatar";
import Link from "next/link";
import {useLogoutUserMutation} from "@/graphql/generated/output";
import {toast} from "sonner";
import {Notifications} from "@/components/layout/header/notifications/Notifications";

export function ProfileMenu() {
    const t = useTranslations('layout.header.headerMenu.profileMenu')
    const router = useRouter();

    const { exit } = useAuth();
    const {user, isLoadingProfile} = useCurrent()

    const [logout] = useLogoutUserMutation({
        onCompleted(){
            exit()
            toast.success(t('successMessage'))
            router.push('/account/login')
        },
        onError(){
            toast.error(t('errorMessage'))
        }
    })

    return isLoadingProfile || !user ? (
        <Loader className='size-6 animate-spin text-muted-foreground'/>
    ) : (
        <>
            <Notifications/>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <ChannelAvatar channel={user}/>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-[230px]'>
                    <div className="flex items-center gap-x-3 p-2">
                        <ChannelAvatar channel={user}/>
                        <h2 className="font-medium text-foreground capitalize">
                            {user.username}
                        </h2>
                    </div>
                    <DropdownMenuSeparator/>
                    <Link href={`/${user.username}`}>
                        <DropdownMenuItem>
                            <User className="mr-2"/>
                            {t('channel')}
                        </DropdownMenuItem>
                    </Link>
                    <Link href='/dashboard/settings'>
                        <DropdownMenuItem>
                            <LayoutDashboard className="mr-2"/>
                            {t('dashboard')}
                        </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem onClick={() => logout()}>
                        <LogOut className="mr-2"/>
                        {t('logout')}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}