import {Logo} from "@/components/layout/header/Logo";
import {Search} from "@/components/layout/header/Search";
import {HeaderMenu} from "@/components/layout/header/HeaderMenu";

export function Header() {
    return (
        <header className="flex h-full items-center gap-x-4
                            border-b border-border bg-card p-4">
            <Logo/>
            <Search/>
            <HeaderMenu/>
        </header>
    )
}