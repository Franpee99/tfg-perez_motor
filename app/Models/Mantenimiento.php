<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mantenimiento extends Model
{
    /** @use HasFactory<\Database\Factories\MantenimientoFactory> */
    use HasFactory;

    public function vehiculo()
    {
        return $this->belongsTo(Vehiculo::class);
    }

    public function cita()
    {
        return $this->belongsTo(CitaTaller::class);
    }

    public function tipoMantenimiento()
    {
        return $this->belongsTo(TiposMantenimiento::class);
    }

}
