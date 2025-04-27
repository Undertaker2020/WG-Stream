import type {PropsWithChildren} from 'react'
import {Header} from "@/components/layout/header";

export default function SiteLayout({children}: PropsWithChildren<unknown>) {
    return (
        <div className="flex flex-col h-full">
            <div className="flex-1">
                <div className="fixed inset-y-0 z-50 w-full h-[75px]">
                    <Header/>
                </div>
                <main className="mt-[75px]">
                    {children}
                </main>
            </div>
        </div>
    )
}