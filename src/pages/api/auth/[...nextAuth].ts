import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { fauna } from '../../../Services/fauna';
import { query as q } from 'faunadb';

export default NextAuth({
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            authorization: {
                params: { scope: "read:user" }
            },
        }),
    ],

    // criar chave com JWT com node-jose-tool
    // NextAuth.js
    
    callbacks: {
        async signIn({ user, account, profile }) {
            const { email } = user;
            try{
                await fauna.query(
                    q.Create(
                        q.Collection('users'),
                        { data: { email } }
                    )
                )
                return true;
            }catch{
                return false;
            }

        },
    }
})
