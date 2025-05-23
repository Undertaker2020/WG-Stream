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


export const metadata: Metadata = {
    title: "WG-Stream"
};

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
