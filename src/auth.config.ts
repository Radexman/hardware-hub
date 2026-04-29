import type { NextAuthConfig } from 'next-auth';
import { NextResponse } from 'next/server';

const PROTECTED_PREFIXES = ['/hardware', '/my-rentals', '/admin'];

export default {
	pages: {
		signIn: '/login',
	},
	providers: [],
	callbacks: {
		authorized({ auth, request: { nextUrl } }) {
			const isLoggedIn = !!auth?.user;
			const { pathname } = nextUrl;

			const isProtected = PROTECTED_PREFIXES.some(
				(prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
			);

			if (isProtected) {
				return isLoggedIn;
			}

			if (isLoggedIn && (pathname === '/' || pathname === '/login')) {
				return NextResponse.redirect(new URL('/hardware', nextUrl));
			}

			return true;
		},
	},
} satisfies NextAuthConfig;
