'use client'

import {useTranslations} from "use-intl";

export default function Home() {
    const translations = useTranslations('home');
    return (
        <div className="my-0 mx-auto w-fit text-4xl font-bold text-center p-6 bg-gray-400 rounded-lg">
            {translations('title')}
        </div>
  );
}
