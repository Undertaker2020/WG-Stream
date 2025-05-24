import type {Metadata} from "next";

import "@/styles/globals.css";
import "@/styles/themes.css"
import {ApolloClientProvider} from "@/providers/ApolloClientProvider";
import {GeistSans} from 'geist/font/sans'
import {NextIntlClientProvider} from "next-intl";
import {getLocale, getMessages} from "next-intl/server";
import {ThemeProvider} from "@/providers/ThemeProvider";
import {ToastProvider} from "@/providers/ToastProvider";
import {ColorSwitcher} from "@/components/ui/elements/ColorSwitcher";
import type {ReactNode} from "react";
import {SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME} from "@/libs/constants/seo.constants";
import {APP_URL} from "@/libs/constants/url.constants";


export const metadata: Metadata = {
    title: {
        absolute: SITE_NAME,
        template: `%s - ${SITE_NAME}`
    },
    description: SITE_DESCRIPTION,
    metadataBase: new URL(APP_URL),
    applicationName: SITE_NAME,
    authors: [
        {
            name: 'Ilya2535',
            url: new URL('https://github.com/Undertaker2020')
        }
    ],
    keywords: SITE_KEYWORDS,
    generator: 'Next.js',
    creator: 'Ilya',
    publisher: 'Ilya2535',
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon.ico',
        apple: '/touch-icons/192x192.png',
        other: {
            rel: 'touch-icons',
            url: '/touch-icons/192x192.png',
            sizes: '192x192',
            type: 'image/png'
        }
    },
    openGraph: {
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
        type: 'website',
        emails: ['ilya.gashimov@webdev-gentleman.com'],
        locale: 'ua_UA',
        images: [
            {
                url: '/touch-icons/512x512.png',
                width: 512,
                height: 512,
                alt: SITE_NAME
            }
        ],
        url: new URL(APP_URL)
    },
    twitter: {
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
        images: [
            {
                url: '/touch-icons/512x512.png',
                width: 512,
                height: 512,
                alt: SITE_NAME
            }
        ]
    }
}

export default async function RootLayout({
   children,
}: Readonly<{
    children: ReactNode;
}>) {
    const locale = await getLocale();
    const messages = await getMessages()
    return (
        <html lang={locale} suppressHydrationWarning>
        <body className={GeistSans.variable}>
        <link rel="icon" href="/favicon.ico" sizes="any" />
            <ApolloClientProvider>
                <ColorSwitcher />
                <NextIntlClientProvider messages={messages}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        disableTransitionOnChange
                    >
                        <ToastProvider/>
                        {children}
                    </ThemeProvider>
                </NextIntlClientProvider>
            </ApolloClientProvider>
            </body>
        </html>
    );
}
