import {useAuth} from "@/hooks/useAuth";
import {useClearSessionCookieMutation, useFindProfileQuery} from "@/graphql/generated/output";
import {useEffect} from "react";

export function useCurrent() {
    const {isAuthenticated, exit} = useAuth();

    const {data, loading, refetch, error} = useFindProfileQuery({
        skip: !isAuthenticated
    });

    const [clear] = useClearSessionCookieMutation();

    useEffect(() => {
        if (error) {
            if (isAuthenticated) {
                clear()
            }
            exit()
        }
    }, [isAuthenticated, exit, clear]);

    return {
        user: data?.findProfile,
        isLoadingProfile: loading,
        refetch
    }
}