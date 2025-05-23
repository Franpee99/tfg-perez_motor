<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TiposMantenimiento extends Model
{
    /** @use HasFactory<\Database\Factories\TiposMantenimientoFactory> */
    use HasFactory;

    public function mantenimientos()
    {
        return $this->hasMany(Mantenimiento::class);
    }

}
