import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',

        no_telepon: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout 
            title="Bergabung Bersama Kami" 
            subtitle="Buat akun baru untuk mulai berbelanja cemilan favorit Anda."
        >
            <Head title="Daftar Akun" />

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5" htmlFor="name">Nama Lengkap</label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={data.name}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-amber-500 transition-all bg-gray-50 focus:bg-white text-gray-900"
                        autoComplete="name"
                        placeholder="Contoh: Sanjai Saiyo"
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoFocus
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5" htmlFor="no_telepon">No. Telepon / WhatsApp</label>
                    <input
                        id="no_telepon"
                        type="tel"
                        name="no_telepon"
                        value={data.no_telepon}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-amber-500 transition-all bg-gray-50 focus:bg-white text-gray-900"
                        autoComplete="tel"
                        placeholder="Contoh: 081234567890"
                        onChange={(e) => setData('no_telepon', e.target.value)}
                        required
                    />
                    <InputError message={errors.no_telepon} className="mt-2" />
                </div>

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
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-amber-500 transition-all bg-gray-50 focus:bg-white text-gray-900"
                            autoComplete="new-password"
                            placeholder="Minimal 8 karakter"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5" htmlFor="password_confirmation">Konfirmasi</label>
                        <input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-amber-500 transition-all bg-gray-50 focus:bg-white text-gray-900"
                            autoComplete="new-password"
                            placeholder="Ulangi password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                        <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>
                </div>

                <div className="pt-4">
                    <button 
                        type="submit"
                        disabled={processing}
                        className="w-full py-3.5 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:shadow-amber-500/20"
                    >
                        Buat Akun Sekarang
                    </button>
                </div>

                <p className="text-center text-sm text-gray-600 font-medium mt-6">
                    Sudah memiliki akun?{' '}
                    <Link href={route('login')} className="text-amber-600 font-bold hover:text-amber-700 transition-colors">
                        Masuk di sini
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}
