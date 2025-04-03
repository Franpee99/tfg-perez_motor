<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Talla extends Model
{
    /** @use HasFactory<\Database\Factories\TallaFactory> */
    use HasFactory;

    protected $fillable = ['nombre'];

    public function productos()
    {
        return $this->belongsToMany(Producto::class)->withPivot('stock');
    }

    public function lineasCarrito()
    {
        return $this->hasMany(LineaCarrito::class);
    }

}
