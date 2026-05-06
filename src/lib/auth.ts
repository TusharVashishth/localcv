import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID ?? "",
            clientSecret: process.env.GITHUB_SECRET ?? "",
            authorization: {
                params: {
                    scope: "read:user user:email repo",
                },
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account, profile }) {
            if (account?.access_token) {
                token.accessToken = account.access_token;
            }

            if (typeof account?.providerAccountId === "string") {
                token.githubLogin = account.providerAccountId;
            } else if (
                profile &&
                typeof profile === "object" &&
                "login" in profile &&
                typeof profile.login === "string"
            ) {
                token.githubLogin = profile.login;
            }

            return token;
        },
        async session({ session, token }) {
            session.accessToken = typeof token.accessToken === "string"
                ? token.accessToken
                : undefined;

            session.user.githubLogin = typeof token.githubLogin === "string"
                ? token.githubLogin
                : null;

            return session;
        },
    },
};
