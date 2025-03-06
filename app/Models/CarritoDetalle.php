<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CarritoDetalle extends Model
{
    /** @use HasFactory<\Database\Factories\CarritoDetalleFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = ['carrito_id', 'producto_id', 'talla_id', 'cantidad'];

    public function carrito()
    {
        return $this->belongsTo(Carrito::class);
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }

    public function talla()
    {
        return $this->belongsTo(Talla::class);
    }
}
