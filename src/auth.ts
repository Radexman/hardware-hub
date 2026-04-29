import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

import authConfig from '@/auth.config';
import { prisma } from '@/lib/prisma';

const credentialsSchema = z.object({
	email: z.email().trim(),
	password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
	...authConfig,
	adapter: PrismaAdapter(prisma),
	session: { strategy: 'jwt' },
	providers: [
		Credentials({
			async authorize(credentials) {
				const parsed = credentialsSchema.safeParse(credentials);
				if (!parsed.success) return null;

				const user = await prisma.user.findUnique({
					where: { email: parsed.data.email },
				});
				if (!user) return null;

				const passwordMatches = await bcrypt.compare(parsed.data.password, user.password);
				if (!passwordMatches) return null;

				return {
					id: user.id,
					email: user.email,
					name: user.name ?? null,
					role: user.role,
				};
			},
		}),
	],
	callbacks: {
		...authConfig.callbacks,
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id as string;
				token.role = user.role;
			}
			return token;
		},
		async session({ session, token }) {
			if (typeof token.id === 'string') {
				session.user.id = token.id;
			}
			if (token.role === 'ADMIN' || token.role === 'USER') {
				session.user.role = token.role;
			}
			return session;
		},
	},
});
