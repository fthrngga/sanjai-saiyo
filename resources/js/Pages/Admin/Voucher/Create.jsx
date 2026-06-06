import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import InputError from '@/Components/InputError';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
        name: '',
        type: 'shipping',
        discount_type: 'fixed',
        discount_value: '',
        max_discount: '',
        min_spend: '0',
        quota: '-1',
        start_date: '',
        end_date: '',
        is_active: '1',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.vouchers.store'));
    };

    return (
        <AdminLayout title="Tambah Voucher">
            <div className="w-full max-w-4xl mx-auto">
                <Button variant="outline" className="gap-2 bg-white border-2 border-gray-400 font-semibold hover:border-gray-600 hover:bg-gray-50 shadow-sm transition-all mb-6 w-fit" asChild>
                    <Link href={route('admin.vouchers.index')}>
                        <ArrowLeft className="w-5 h-5 flex-shrink-0" /> <span className="pt-0.5">Kembali ke Daftar</span>
                    </Link>
                </Button>

                <form onSubmit={submit} className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                        <h2 className="text-xl font-bold mb-6 text-gray-900">Informasi Voucher</h2>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="code">Kode Voucher</Label>
                                    <Input
                                        id="code"
                                        value={data.code}
                                        onChange={e => setData('code', e.target.value.toUpperCase())}
                                        placeholder="Contoh: ONGKIRSAIYO"
                                        className="uppercase tracking-wider font-semibold text-amber-700"
                                        maxLength={50}
                                        required
                                    />
                                    <p className="text-xs text-gray-400">Kode ini akan digunakan pelanggan saat checkout. Gunakan huruf kapital.</p>
                                    <InputError message={errors.code} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Voucher</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="Contoh: Diskon Ongkir Grand Launching"
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="type">Tipe Potongan</Label>
                                    <select
                                        id="type"
                                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                                        value={data.type}
                                        onChange={e => setData('type', e.target.value)}
                                    >
                                        <option value="shipping">Potongan Ongkos Kirim</option>
                                        <option value="product">Potongan Harga Produk</option>
                                    </select>
                                    <InputError message={errors.type} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="discount_type">Jenis Diskon</Label>
                                    <select
                                        id="discount_type"
                                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                                        value={data.discount_type}
                                        onChange={e => setData('discount_type', e.target.value)}
                                    >
                                        <option value="fixed">Nominal Tetap (Rupiah)</option>
                                        <option value="percentage">Persentase (%)</option>
                                    </select>
                                    <InputError message={errors.discount_type} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="discount_value">
                                        Nilai Potongan {data.discount_type === 'percentage' ? '(%)' : '(Rupiah)'}
                                    </Label>
                                    <Input
                                        id="discount_value"
                                        type="number"
                                        value={data.discount_value}
                                        onChange={e => setData('discount_value', e.target.value)}
                                        placeholder={data.discount_type === 'percentage' ? '10' : '15000'}
                                        required
                                    />
                                    <InputError message={errors.discount_value} />
                                </div>

                                {data.discount_type === 'percentage' ? (
                                    <div className="space-y-2">
                                        <Label htmlFor="max_discount">Potongan Maksimum (Rupiah)</Label>
                                        <Input
                                            id="max_discount"
                                            type="number"
                                            value={data.max_discount}
                                            onChange={e => setData('max_discount', e.target.value)}
                                            placeholder="20000"
                                        />
                                        <p className="text-xs text-gray-400">Kosongkan jika tidak ada batas diskon maksimum.</p>
                                        <InputError message={errors.max_discount} />
                                    </div>
                                ) : (
                                    <div className="hidden md:block"></div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="min_spend">Minimal Belanja (Rupiah)</Label>
                                    <Input
                                        id="min_spend"
                                        type="number"
                                        value={data.min_spend}
                                        onChange={e => setData('min_spend', e.target.value)}
                                        placeholder="50000"
                                        required
                                    />
                                    <InputError message={errors.min_spend} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="quota">Kuota Pemakaian</Label>
                                    <Input
                                        id="quota"
                                        type="number"
                                        value={data.quota}
                                        onChange={e => setData('quota', e.target.value)}
                                        placeholder="100"
                                        required
                                    />
                                    <p className="text-xs text-gray-400">Gunakan -1 jika kuota tidak dibatasi.</p>
                                    <InputError message={errors.quota} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="start_date">Tanggal Mulai</Label>
                                    <Input
                                        id="start_date"
                                        type="datetime-local"
                                        value={data.start_date}
                                        onChange={e => setData('start_date', e.target.value)}
                                    />
                                    <InputError message={errors.start_date} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="end_date">Tanggal Berakhir</Label>
                                    <Input
                                        id="end_date"
                                        type="datetime-local"
                                        value={data.end_date}
                                        onChange={e => setData('end_date', e.target.value)}
                                    />
                                    <InputError message={errors.end_date} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="is_active">Status Aktif</Label>
                                <select
                                    id="is_active"
                                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                                    value={data.is_active}
                                    onChange={e => setData('is_active', e.target.value)}
                                >
                                    <option value="1">Aktif</option>
                                    <option value="0">Nonaktif</option>
                                </select>
                                <InputError message={errors.is_active} />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={processing} className="w-full sm:w-auto min-w-[150px] gap-2">
                            <Save className="w-4 h-4" /> Simpan Voucher
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
