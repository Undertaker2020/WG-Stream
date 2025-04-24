'use client'

import {useTranslations} from "next-intl";
import {useParams, useRouter} from "next/navigation";

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useNewPasswordMutation} from "@/graphql/generated/output";
import {toast} from "sonner";
import {newPasswordSchema, type TypeNewPasswordSchema} from "@/schemas/auth/new-password.schema";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel} from "@/components/ui/common/Form";
import {Input} from "@/components/ui/common/Input";
import {Button} from "@/components/ui/common/Button";
import {AuthWrapper} from "@/components/features/auth/AuthWrapper";

export function NewPasswordForm() {
    const t = useTranslations('auth.newPassword')

    const router = useRouter();

    const params = useParams<{ token: string }>()

    const form = useForm<TypeNewPasswordSchema>({
        resolver: zodResolver(newPasswordSchema),
        defaultValues: {
            password: '',
            passwordRepeat: ''
        }
    })

    const [newPassword, {loading: isLoadingNewPassword}] = useNewPasswordMutation({
        onCompleted() {
            toast.success(t('successMessage'));
            router.push("/account/login");
        },
        onError() {
            toast.error(`${t('errorMessage')} ;(`);
        }
    })

    const {isValid} = form.formState

    function onSubmit(data: TypeNewPasswordSchema) {
        newPassword({variables: {data: {...data, token: params.token}}})
    }

    return (
        <AuthWrapper
            heading={t('heading')}
            backButtonLabel={t('backButtonLabel')}
            backButtonHref='/account/create'
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='grid gap-y-3'
                >

                    <FormField
                        control={form.control}
                        name='password'
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>{t('passwordLabel')}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='********'
                                        type="password"
                                        disabled={isLoadingNewPassword}
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    {t('passwordDescription')}
                                </FormDescription>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='passwordRepeat'
                        render={({field}) => (
                            <FormItem>
                                <div className="flex items-center justify-between">
                                    <FormLabel>
                                        {t('passwordRepeatLabel')}
                                    </FormLabel>

                                </div>
                                <FormControl>
                                    <Input
                                        placeholder='********'
                                        type="password"
                                        disabled={isLoadingNewPassword}
                                        {...field}/>
                                </FormControl>
                                <FormDescription>
                                    {t('passwordRepeatDescription')}
                                </FormDescription>
                            </FormItem>
                        )}
                    />

                    <Button
                        className='mt-8 w-full'
                        disabled={!isValid || isLoadingNewPassword}
                    >
                        {t('submitButton')}
                    </Button>
                </form>
            </Form>
        </AuthWrapper>
    )
}