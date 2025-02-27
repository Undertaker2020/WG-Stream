import {Body, Head, Heading, Html, Link, Preview, Section, Tailwind, Text} from '@react-email/components';
import * as React from 'react';

interface AccountDeletionTemplateProps {
    domain: string
}

export function AccountDeletionTemplate({domain}: AccountDeletionTemplateProps) {
    const registerLink = `${domain}/account/create`

    return (
        <Html>
            <Head/>
            <Preview>Account Deleted</Preview>
            <Tailwind>
                <Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
                    <Section className="text-center">
                        <Heading className="text-3xl text-black font-bold">
                            Your account has been completely deleted
                        </Heading>
                        <Text className="text-base text-black mt-2">
                            Your account has been completely erased from the WG-Stream database. All your data and
                            information have been permanently removed.
                        </Text>
                    </Section>

                    <Section className="bg-white text-black text-center rounded-lg shadow-md p-6 mb-4">
                        <Text>
                            You will no longer receive notifications via Telegram or email.
                        </Text>
                        <Text>
                            If you wish to return to the platform, you can sign up using the following link:
                        </Text>
                        <Link
                            href={registerLink}
                            className="inline-flex justify-center items-center rounded-md mt-2 text-sm font-medium text-white bg-[#18B9AE] px-5 py-2 rounded-full"
                        >
                            Sign up for WG-Stream
                        </Link>
                    </Section>

                    <Section className="text-center text-black">
                        <Text>
                            Thank you for being with us! We will always be happy to see you on the platform.
                        </Text>
                    </Section>
                </Body>
            </Tailwind>
        </Html>
    )
}
