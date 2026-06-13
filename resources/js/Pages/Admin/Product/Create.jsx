import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Plus, Trash2, X, ImagePlus } from 'lucide-react';
import InputError from '@/Components/InputError';
import { useState } from 'react';

export default function Create({ categories }) {
    const { data, setData, post, processing, errors } = useForm({
        nama_produk: '',
        category_id: '',
        harga: '',
        deskripsi: '',
        gambar: [],
        variants: [
            { name: 'Original', additional_price: 0, stock: 0 }
        ],
    });

    const [previews, setPreviews] = useState([]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const newFiles = [...data.gambar, ...files];
        setData('gambar', newFiles);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews([...previews, ...newPreviews]);

        e.target.value = null; // Clear input so same file can be selected again if needed
    };

    const removeImage = (index) => {
        const newGambar = [...data.gambar];
        newGambar.splice(index, 1);
        setData('gambar', newGambar);

        const newPreviews = [...previews];
        URL.revokeObjectURL(newPreviews[index]);
        newPreviews.splice(index, 1);
        setPreviews(newPreviews);
    };

    const addVariant = () => {
        setData('variants', [...data.variants, { name: '', additional_price: 0, stock: 0 }]);
    };

    const removeVariant = (index) => {
        const newVariants = [...data.variants];
        newVariants.splice(index, 1);
        setData('variants', newVariants);
    };

    const updateVariant = (index, field, value) => {
        const newVariants = [...data.variants];
        newVariants[index][field] = value;
        setData('variants', newVariants);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.products.store'));
    };

    return (
        <AdminLayout title="Tambah Produk">
            <div className="w-full max-w-7xl mx-auto">
                <Button variant="outline" className="gap-2 bg-white border-2 border-gray-400 font-semibold hover:border-gray-600 hover:bg-gray-50 shadow-sm transition-all mb-6 w-fit" asChild>
                    <Link href={route('admin.products.index')}>
                        <ArrowLeft className="w-5 h-5 flex-shrink-0" /> <span className="pt-0.5">Kembali ke Daftar</span>
                    </Link>
                </Button>

                <form onSubmit={submit} className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                        <h2 className="text-xl font-bold mb-6">Informasi Produk</h2>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="nama_produk">Nama Produk</Label>
                                <Input
                                    id="nama_produk"
                                    value={data.nama_produk}
                                    onChange={e => setData('nama_produk', e.target.value)}
                                    placeholder="Contoh: Keripik Sanjai Balado"
                                />
                                <InputError message={errors.nama_produk} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    <Label>Stok Total (Otomatis)</Label>
                                    <div className="flex h-10 w-full items-center rounded-md border border-slate-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 font-bold">
                                        {data.variants.reduce((sum, v) => sum + (parseInt(v.stock) || 0), 0)} Pcs
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Stok diakumulasi dari total keseluruhan varian produk.</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="harga">Harga Dasar</Label>
                                <Input
                                    id="harga"
                                    type="number"
                                    value={data.harga}
                                    onChange={e => setData('harga', e.target.value)}
                                    placeholder="20000"
                                />
                                <InputError message={errors.harga} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="deskripsi">Deskripsi</Label>
                                <textarea
                                    id="deskripsi"
                                    className="flex min-h-[120px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={data.deskripsi}
                                    onChange={e => setData('deskripsi', e.target.value)}
                                />
                                <InputError message={errors.deskripsi} />
                            </div>
                        </div>
                    </div>

                    {/* Varian */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-xl font-bold">Varian & Stok Produk (Wajib)</h2>
                                <p className="text-sm text-gray-500 mt-1">Stok produk dikontrol dari varian-varian yang Anda definisikan di sini.</p>
                            </div>
                            <Button type="button" variant="outline" onClick={addVariant} size="sm">
                                <Plus className="w-4 h-4 mr-2" /> Tambah Varian
                            </Button>
                        </div>

                        {data.variants.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-4 border-2 border-dashed border-gray-100 rounded-lg">Minimal harus ada 1 varian (Original).</p>
                        ) : (
                            <div className="space-y-4">
                                {data.variants.map((variant, index) => (
                                    <div key={index} className="flex flex-col md:flex-row items-start md:items-end gap-4 p-4 border border-gray-100 rounded-lg bg-gray-50/50">
                                        <div className="flex-1 w-full space-y-2">
                                            <Label>Nama Varian</Label>
                                            <Input
                                                value={variant.name}
                                                onChange={e => updateVariant(index, 'name', e.target.value)}
                                                placeholder="Contoh: Original"
                                            />
                                            {errors[`variants.${index}.name`] && <InputError message={errors[`variants.${index}.name`]} />}
                                        </div>
                                        <div className="flex-1 w-full space-y-2">
                                            <Label>Foto (Opsional)</Label>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={e => updateVariant(index, 'image', e.target.files[0])}
                                                className="text-xs file:h-full file:bg-gray-100 file:border-0"
                                            />
                                            {errors[`variants.${index}.image`] && <InputError message={errors[`variants.${index}.image`]} />}
                                        </div>
                                        <div className="w-full md:w-32 space-y-2">
                                            <Label>Harga +</Label>
                                            <Input
                                                type="number"
                                                value={variant.additional_price}
                                                onChange={e => updateVariant(index, 'additional_price', e.target.value)}
                                                placeholder="0"
                                            />
                                        </div>
                                        <div className="w-full md:w-24 space-y-2">
                                            <Label>Stok Varian</Label>
                                            <Input
                                                type="number"
                                                value={variant.stock}
                                                onChange={e => updateVariant(index, 'stock', e.target.value)}
                                                placeholder="0"
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 disabled:opacity-50"
                                            onClick={() => removeVariant(index)}
                                            disabled={data.variants.length <= 1}
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                        {errors.variants && <InputError message={errors.variants} className="mt-2" />}
                    </div>

                    {/* Foto Produk */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                        <h2 className="text-xl font-bold mb-6">Foto Produk</h2>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {previews.map((preview, index) => (
                                    <div key={index} className="relative group aspect-square rounded-lg border bg-gray-50 overflow-hidden">
                                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                        {index === 0 && (
                                            <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">Utama</div>
                                        )}
                                    </div>
                                ))}

                                <label className="cursor-pointer flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed hover:bg-gray-50 hover:border-black transition-colors">
                                    <ImagePlus className="w-8 h-8 text-gray-400 mb-2" />
                                    <span className="text-sm font-medium text-gray-500">Upload Foto</span>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            </div>
                            <InputError message={errors.gambar} />
                            {Object.keys(errors).map(key => key.startsWith('gambar.') ? <InputError key={key} message={errors[key]} /> : null)}
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={processing} className="w-full sm:w-auto min-w-[150px]">
                            <Save className="w-4 h-4 mr-2" /> Simpan Produk
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
