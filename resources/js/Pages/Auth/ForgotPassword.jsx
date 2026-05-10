import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout 
            title="Lupa Password?" 
            subtitle="Tidak masalah. Cukup beri tahu kami alamat email Anda dan kami akan mengirimkan tautan untuk mengatur ulang password Anda."
        >
            <Head title="Lupa Password" />

            {status && (
                <div className="mb-6 p-4 text-sm font-bold text-green-700 bg-green-50 rounded-xl border border-green-200">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5" htmlFor="email">Alamat Email</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-amber-500 transition-all bg-gray-50 focus:bg-white text-gray-900"
                        placeholder="contoh@email.com"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoFocus
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="pt-2">
                    <button 
                        type="submit"
                        disabled={processing}
                        className="w-full py-3.5 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                    >
                        Kirim Tautan Reset Password
                    </button>
                </div>

                <div className="text-center mt-6">
                    <Link href={route('login')} className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-amber-600 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Kembali ke Halaman Login
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
