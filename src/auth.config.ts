import type { NextAuthConfig } from 'next-auth';
import { NextResponse } from 'next/server';

const PROTECTED_PREFIXES = ['/hardware', '/my-rentals', '/admin'];
const ADMIN_PREFIX = '/admin';

export default {
	pages: {
		signIn: '/login',
	},
	providers: [],
	callbacks: {
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
		authorized({ auth, request: { nextUrl } }) {
			const isLoggedIn = !!auth?.user;
			const { pathname } = nextUrl;

			const isProtected = PROTECTED_PREFIXES.some(
				(prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
			);

			if (isProtected) {
				if (!isLoggedIn) return false;

				const isAdminRoute =
					pathname === ADMIN_PREFIX || pathname.startsWith(`${ADMIN_PREFIX}/`);
				if (isAdminRoute && auth?.user?.role !== 'ADMIN') {
					return NextResponse.redirect(new URL('/hardware', nextUrl));
				}

				return true;
			}

			if (isLoggedIn && (pathname === '/' || pathname === '/login')) {
				return NextResponse.redirect(new URL('/hardware', nextUrl));
			}

			return true;
		},
	},
} satisfies NextAuthConfig;
