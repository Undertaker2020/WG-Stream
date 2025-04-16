'use client'

import type {PropsWithChildren} from "react";
import {ApolloProvider} from "@apollo/client";
import {client} from "@/libs/apollo-client";

export function ApolloClientProvider({ children }: PropsWithChildren<unknown>) {
    return <ApolloProvider client={client}>
        {children}
    </ApolloProvider>
}