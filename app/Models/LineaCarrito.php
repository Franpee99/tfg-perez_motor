<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LineaCarrito extends Model
{
    protected $table = 'lineas_carrito';

    protected $fillable = ['user_id', 'producto_id', 'talla_id', 'cantidad', 'guardado'];

    public function user()
    {
        return $this->belongsTo(User::class);
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
