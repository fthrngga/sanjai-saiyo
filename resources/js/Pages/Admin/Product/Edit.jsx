import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Link, useForm } from '@inertiajs/react';
import { ChevronLeft, Save } from 'lucide-react';
import InputError from '@/Components/InputError';
import { router } from '@inertiajs/react'; // Ensure router is imported specifically if needed, though useForm handles submission

export default function Edit({ product, categories }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT', // Spoofing PUT for file upload support in Inertia/Laravel
        nama_produk: product.nama_produk,
        category_id: product.category_id,
        harga: product.harga,
        stok: product.stok,
        deskripsi: product.deskripsi || '',
        gambar: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.products.update', product.id));
    };

    return (
        <AdminLayout title="Edit Produk">
            <div className="max-w-2xl mx-auto">
                <Link href={route('admin.products.index')} className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Kembali
                </Link>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-xl font-bold mb-6">Edit Produk: {product.nama_produk}</h2>
                    
                    <form onSubmit={submit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="nama_produk">Nama Produk</Label>
                            <Input 
                                id="nama_produk" 
                                value={data.nama_produk} 
                                onChange={e => setData('nama_produk', e.target.value)}
                            />
                            <InputError message={errors.nama_produk} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category_id">Kategori</Label>
                                <select 
                                    id="category_id"
                                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={data.category_id}
                                    onChange={e => setData('category_id', e.target.value)}
                                >
                                    <option value="">Pilih Kategori</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.nama_kategori}</option>
                                    ))}
                                </select>
                                <InputError message={errors.category_id} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="stok">Stok</Label>
                                <Input 
                                    id="stok" 
                                    type="number"
                                    value={data.stok} 
                                    onChange={e => setData('stok', e.target.value)}
                                />
                                <InputError message={errors.stok} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="harga">Harga</Label>
                            <Input 
                                id="harga" 
                                type="number"
                                value={data.harga} 
                                onChange={e => setData('harga', e.target.value)}
                            />
                            <InputError message={errors.harga} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="deskripsi">Deskripsi</Label>
                            <textarea 
                                id="deskripsi"
                                className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                                value={data.deskripsi}
                                onChange={e => setData('deskripsi', e.target.value)}
                            />
                            <InputError message={errors.deskripsi} />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="gambar">Foto Produk (Biarkan kosong jika tidak berubah)</Label>
                            {product.gambar && (
                                <div className="mb-2">
                                    <img src={`/storage/${product.gambar}`} alt="Current" className="h-20 w-20 object-cover rounded-md border" />
                                </div>
                            )}
                            <Input 
                                id="gambar" 
                                type="file"
                                onChange={e => setData('gambar', e.target.files[0])}
                                className="pt-2" 
                            />
                            <InputError message={errors.gambar} />
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                                <Save className="w-4 h-4 mr-2" /> Simpan Perubahan
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
