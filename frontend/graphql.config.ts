import type {CodegenConfig} from "@graphql-codegen/cli";

const config: CodegenConfig = {
    schema: process.env.NEXT_PUBLIC_APP_URL,
    documents: ['./src/graphql/**/*.graphql'],
    generates: {
        './src/graphql/generated/output.ts': {
            plugins: [
                'typescript',
                'typescript-operations',
                'typescript-react-apollo'
            ],
        }
    },
    ignoreNoDocuments: true
};

export default config;