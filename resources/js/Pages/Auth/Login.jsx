import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout 
            title="Selamat Datang Kembali" 
            subtitle="Silakan masuk ke akun Anda untuk melanjutkan aktivitas belanja."
        >
            <Head title="Masuk" />

            {status && (
                <div className="mb-6 p-4 text-sm font-bold text-green-700 bg-green-50 rounded-xl border border-green-200">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5" htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-amber-500 transition-all bg-gray-50 focus:bg-white text-gray-900"
                        autoComplete="username"
                        placeholder="contoh@email.com"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoFocus
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-sm font-bold text-gray-700" htmlFor="password">Password</label>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors"
                            >
                                Lupa Password?
                            </Link>
                        )}
                    </div>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-amber-500 transition-all bg-gray-50 focus:bg-white text-gray-900"
                        autoComplete="current-password"
                        placeholder="Masukkan password Anda"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center">
                    <label className="flex items-center cursor-pointer group">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="text-amber-600 focus:ring-amber-500 rounded border-gray-300 w-5 h-5 transition-colors cursor-pointer"
                        />
                        <span className="ms-3 text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                            Ingat saya
                        </span>
                    </label>
                </div>

                <div className="pt-2">
                    <button 
                        type="submit"
                        disabled={processing}
                        className="w-full py-3.5 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                    >
                        Masuk ke Akun
                    </button>
                </div>

                <p className="text-center text-sm text-gray-600 font-medium mt-6">
                    Belum punya akun?{' '}
                    <Link href={route('register')} className="text-amber-600 font-bold hover:text-amber-700 transition-colors">
                        Daftar sekarang
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}
