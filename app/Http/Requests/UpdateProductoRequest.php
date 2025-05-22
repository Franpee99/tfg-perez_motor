<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateProductoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::user()->is_admin;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nombre'           => 'required|string|max:255',
            'descripcion'      => 'nullable|string',
            'precio'           => 'required|numeric|min:0',
            'categoria_id'     => 'required|exists:categorias,id',
            'subcategoria_id'  => 'required|exists:subcategorias,id',
            'marca_id'         => 'nullable|exists:marcas,id',
            'nueva_marca'      => 'nullable|string|max:255',
            'imagenes'         => 'nullable|array|max:3',
            'imagenes.*'       => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'tallas'           => 'required|array|min:1',
            'tallas.*.nombre'  => 'required|string|max:50',
            'tallas.*.stock'   => 'required|integer|min:0',
            'caracteristicas'    => 'nullable|array',
            'caracteristicas.*.caracteristica'   => 'nullable|string|max:255',
            'caracteristicas.*.definicion' => 'nullable|string|max:255',
        ];
    }
}
