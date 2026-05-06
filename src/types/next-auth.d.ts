import type { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        accessToken?: string;
        user: DefaultSession["user"] & {
            githubLogin?: string | null;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
        githubLogin?: string | null;
    }
}
