'use client'

import {useTranslations} from "next-intl";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useResetPasswordMutation} from "@/graphql/generated/output";
import {toast} from "sonner";
import {resetPasswordSchema, type TypeResetPasswordSchema} from "@/schemas/auth/reset-password.schema";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/common/Alert";
import {CircleCheck} from "lucide-react";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel} from "@/components/ui/common/Form";
import {Input} from "@/components/ui/common/Input";
import {Button} from "@/components/ui/common/Button";
import {AuthWrapper} from "@/components/features/auth/AuthWrapper";

export function ResetPasswordForm() {
    const t = useTranslations('auth.resetPassword')

    const [isSuccess, setIsSuccess] = useState(false);

    const form = useForm<TypeResetPasswordSchema>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            email: ''
        }
    })

    const [resetPassword, {loading: isLoadingReset}] = useResetPasswordMutation({
        onCompleted() {
            setIsSuccess(true);
        },
        onError() {
            toast.error(`${t('errorMessage')} ;(`);
        }
    })

    const {isValid} = form.formState

    function onSubmit(data: TypeResetPasswordSchema) {
        resetPassword({variables: {data}})
    }

    return (
        <AuthWrapper
            heading={t('heading')}
            backButtonLabel={t('backButtonLabel')}
            backButtonHref='/account/login'
        >
            {isSuccess ? (
                <Alert>
                    <CircleCheck className='size-4'/>
                    <AlertTitle>{t('successAlertTitle')}</AlertTitle>
                    <AlertDescription>{t('successAlertDescription')}</AlertDescription>
                </Alert>
            ) : (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='grid gap-y-3'
                    >
                        <FormField
                            control={form.control}
                            name='email'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>{t('emailLabel')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='johndoe@example.com'
                                            disabled={isLoadingReset}
                                            {...field}/>
                                    </FormControl>
                                    <FormDescription>
                                        {t('emailDescription')}
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                        <Button className='mt-8 w-full' disabled={!isValid || isLoadingReset}>
                            {t('submitButton')}
                        </Button>
                    </form>
                </Form>
            )}
        </AuthWrapper>
    )
}