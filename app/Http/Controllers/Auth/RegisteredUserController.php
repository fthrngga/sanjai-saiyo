<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'no_telepon' => 'required|string|regex:/^[0-9]{10,15}$/',
        ], [
            'no_telepon.regex' => 'Nomor telepon harus berupa angka dengan panjang antara 10 hingga 15 digit.',
            'no_telepon.required' => 'Nomor telepon wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email ini sudah terdaftar.',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'pelanggan',
        ]);

        $user->pelanggan()->create([
            'no_telepon' => $request->no_telepon,
        ]);

        // Berikan Welcome Voucher (Potongan Ongkir Rp 15.000)
        try {
            $welcomeVoucher = \App\Models\Voucher::firstOrCreate(
                ['code' => 'WELCOMESAIYO'],
                [
                    'name' => 'Voucher Selamat Datang',
                    'type' => 'shipping',
                    'discount_type' => 'fixed',
                    'discount_value' => 15000,
                    'min_spend' => 0,
                    'quota' => -1,
                    'is_active' => true,
                ]
            );

            $user->claimedVouchers()->attach($welcomeVoucher->id, [
                'claimed_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ]);
        } catch (\Exception $e) {
            // Log error or ignore so registration doesn't fail if there's database issue
            logger()->error('Failed to assign welcome voucher: ' . $e->getMessage());
        }

        event(new Registered($user));

        Auth::login($user);

        return redirect()->intended('/');
    }
}
