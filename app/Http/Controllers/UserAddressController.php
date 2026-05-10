<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserAddressController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'label' => 'nullable|string|max:255',
            'recipient_name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'full_address' => 'required|string',
            'province_id' => 'nullable|integer',
            'city_id' => 'nullable|integer',
            'district_id' => 'nullable|integer',
            'subdistrict_id' => 'nullable|integer',
            'postal_code' => 'nullable|string|max:10',
            'is_primary' => 'boolean'
        ]);

        $user = auth()->user();

        // If it's the first address, make it primary automatically, or if requested
        $isFirst = $user->addresses()->count() === 0;
        $isPrimary = $request->input('is_primary', false) || $isFirst;

        if ($isPrimary) {
            $user->addresses()->update(['is_primary' => false]);
        }

        $address = clone collect($validated);
        $address->put('is_primary', $isPrimary);

        $user->addresses()->create($address->toArray());

        return back()->with('success', 'Alamat berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $address = auth()->user()->addresses()->findOrFail($id);

        $validated = $request->validate([
            'label' => 'nullable|string|max:255',
            'recipient_name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'full_address' => 'required|string',
            'province_id' => 'nullable|integer',
            'city_id' => 'nullable|integer',
            'district_id' => 'nullable|integer',
            'subdistrict_id' => 'nullable|integer',
            'postal_code' => 'nullable|string|max:10',
            'is_primary' => 'boolean'
        ]);

        $isPrimary = $request->input('is_primary', false);

        if ($isPrimary && !$address->is_primary) {
            auth()->user()->addresses()->update(['is_primary' => false]);
        }

        $addressData = clone collect($validated);
        $addressData->put('is_primary', $isPrimary || $address->is_primary); 
        // Can't un-primary itself here, must pick another one as primary usually. 

        $address->update($addressData->toArray());

        return back()->with('success', 'Alamat berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $address = auth()->user()->addresses()->findOrFail($id);
        
        $wasPrimary = $address->is_primary;
        $address->delete();

        // If primary was deleted, set next available to primary
        if ($wasPrimary) {
            $nextAddress = auth()->user()->addresses()->first();
            if ($nextAddress) {
                $nextAddress->update(['is_primary' => true]);
            }
        }

        return back()->with('success', 'Alamat berhasil dihapus.');
    }

    public function setPrimary($id)
    {
        $address = auth()->user()->addresses()->findOrFail($id);

        auth()->user()->addresses()->update(['is_primary' => false]);
        $address->update(['is_primary' => true]);

        return back()->with('success', 'Alamat UTAMA berhasil diubah.');
    }
}
