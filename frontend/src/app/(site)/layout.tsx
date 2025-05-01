import type {PropsWithChildren} from 'react'
import {Header} from "@/components/layout/header";
import {LayoutContainer} from "@/components/layout/LayoutContainer";
import {Sidebar} from "@/components/layout/sidebar/Sidebar";

export default function SiteLayout({children}: PropsWithChildren<unknown>) {
    return (
        <div className="flex flex-col h-full">
            <div className="flex-1">
                <div className="fixed inset-y-0 z-50 w-full h-[75px]">
                    <Header/>
                </div>
                <Sidebar/>
                <LayoutContainer>
                    {children}
                </LayoutContainer>
            </div>
        </div>
    )
}