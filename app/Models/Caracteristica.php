<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Caracteristica extends Model
{
    /** @use HasFactory<\Database\Factories\CaracteristicaFactory> */
    use HasFactory;

    protected $fillable = ['caracteristica'];

    public function productos()
    {
        return $this->belongsToMany(Producto::class)->withPivot('definicion');
    }
}
