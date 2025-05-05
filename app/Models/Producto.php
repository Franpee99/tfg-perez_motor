<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Producto extends Model
{
    /** @use HasFactory<\Database\Factories\ProductoFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = ['nombre', 'descripcion', 'precio', 'subcategoria_id', 'marca_id', 'stock', 'definicion'];


    public function subcategoria()
    {
        return $this->belongsTo(Subcategoria::class);
    }

    public function marca()
    {
        return $this->belongsTo(Marca::class);
    }

    public function tallas()
    {
        return $this->belongsToMany(Talla::class)->withPivot('stock');
    }

    public function caracteristicas()
    {
        return $this->belongsToMany(Caracteristica::class)->withPivot('definicion');
    }

    public function detallesPedido()
    {
        return $this->hasMany(DetallePedido::class);
    }

    public function lineasCarrito()
    {
        return $this->hasMany(LineaCarrito::class);
    }

    public function imagenes()
    {
        return $this->hasMany(Imagen::class);
    }

    public function valoraciones()
    {
        return $this->hasMany(Valoracion::class);
    }

}
