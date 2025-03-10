<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Producto extends Model
{
    /** @use HasFactory<\Database\Factories\ProductoFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = ['nombre', 'descripcion', 'precio', 'stock', 'categoria_id', 'imagen_url'];

    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }

    public function detallesPedido()
    {
        return $this->hasMany(DetallePedido::class);
    }

    public function carritosDetalle()
    {
        return $this->hasMany(CarritoDetalle::class);
    }
}
