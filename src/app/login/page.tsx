'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
	const router = useRouter();

	const [email, setEmail] = useState('admin@booksy.com');
	const [password, setPassword] = useState('admin123');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		const res = await signIn('credentials', {
			email,
			password,
			redirect: false,
		});

		setLoading(false);

		if (res?.error) {
			setError('Invalid credentials');
			return;
		}

		router.push('/hardware');
	};

	return (
		<div className='flex min-h-screen items-center justify-center'>
			<form
				onSubmit={handleSubmit}
				className='w-full max-w-sm space-y-4 rounded-lg border p-6'
			>
				<h1 className='text-xl font-semibold'>Login</h1>

				<input
					className='w-full border p-2'
					type='email'
					placeholder='Email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>

				<input
					className='w-full border p-2'
					type='password'
					placeholder='Password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>

				{error && <p className='text-red-500 text-sm'>{error}</p>}

				<button
					className='w-full bg-black text-white p-2'
					type='submit'
					disabled={loading}
				>
					{loading ? 'Signing in...' : 'Sign in'}
				</button>
			</form>
		</div>
	);
}
