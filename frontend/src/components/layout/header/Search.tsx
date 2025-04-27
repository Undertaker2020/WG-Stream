'use client'

import {type FormEvent, useState} from "react";
import {useTranslations} from "next-intl";
import {useRouter} from "next/navigation";
import {Input} from "@/components/ui/common/Input";
import {Button} from "@/components/ui/common/Button";
import {SearchIcon} from "lucide-react";

export function Search() {
    const t = useTranslations('layout.header.search')

    const [searchTerm, setSearchTerm] = useState('')
    const router = useRouter()

    function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (searchTerm.trim()) {
            router.push(`/streams?searchTerm=${searchTerm}`)
        } else {
            router.push('/streams')
        }
    }

    return (
        <div className="ml-auto hidden lg:block">
            <form className="relative flex items-center" onSubmit={onSubmit}>
                <Input
                    placeholder={t('placeholder')}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-full pl-4 pr-10 mt-0 lg:w-[400px]"
                />
                <Button className="absolute right-0.5 top-1/2 -translate-y-1/2 h-9" type='submit'>
                    <SearchIcon className="absolute size-[18px]" />
                </Button>
            </form>
        </div>
    )
}