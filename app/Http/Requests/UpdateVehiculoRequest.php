<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateVehiculoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = Auth::user();
        return $user->id || $user->is_admin;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $vehiculoId = $this->route('vehiculo')?->id;

        return [
            'marca' => 'required|string|max:100',
            'modelo' => 'required|string|max:100',
            'cilindrada' => 'nullable|string|max:50',
            'matricula' => 'required|string|max:20|unique:vehiculos,matricula,' . $vehiculoId,
            'anio' => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
            'color' => 'nullable|string|max:30',
            'vin' => 'nullable|string|max:50',
        ];
    }
}
