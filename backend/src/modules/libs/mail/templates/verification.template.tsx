import * as React from 'react'
import {Html} from "@react-email/html";
import {Body, Head, Link, Preview, Section, Tailwind, Text} from "@react-email/components";

interface VerificationTemplateProps {
    domain: string;
    token: string;
}

export function VerificationTemplate({domain, token}: VerificationTemplateProps) {
    const verificationLink = `${domain}/account/verify?token=${token}`;

    return (
        <Html>
            <Head/>
            <Preview>Account verification</Preview>
            <Tailwind>
                <Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
                    <Section className='text-center mb-8'>
                        <h1 className='text-3xl text-black font-bold'>
                            Confirming your email
                        </h1>
                        <Text className='text-base text-black'>
                            Thank you for registering with WG-Stream!
                            To confirm your email address, please follow this link:
                        </Text>
                        <Link href={verificationLink}
                              className='inline-flex justify-center items-center rounded-full text-sm font-medium text-white bg-[#18B9AE] px-5 py-2'>
                            Confirm email
                        </Link>
                    </Section>
                    <Section className='text-center mt-8'>
                        <Text className='text-gray-600'>
                            If you have any questions or encounter issues on the site,
                            please contact customer support at the address{' '}
                            <Link href='mailto:gashimovilya2018@gmail.com'
                                  className='text-[#18B9AE] underline'>
                                gashimovilya2018@gmail.com
                            </Link>
                        </Text>
                    </Section>
                </Body>
            </Tailwind>
        </Html>
    )
}