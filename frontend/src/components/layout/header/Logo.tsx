'use client'

import Link from "next/link";
import {LogoImage} from "@/components/images/LogoImage";
import {useTranslations} from "next-intl";

export function Logo() {
    const t = useTranslations('layout.header.logo')
    return (
        <Link href="/" className="flex items-center gap-x-4 transition-opacity hover:opacity-75">
            <LogoImage/>
            <div className="hidden lg:block tracking-wider">
                <h2 className="text-lg font-semibold tracking-wider text-accent-foreground">
                    WG-Stream
                </h2>
                <p className="text-sm text-muted-foreground">{t('platform')}</p>
            </div>
        </Link>
    )
}