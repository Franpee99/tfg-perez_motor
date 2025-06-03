<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mantenimiento extends Model
{
    /** @use HasFactory<\Database\Factories\MantenimientoFactory> */
    use HasFactory;

    protected $fillable = [
        'vehiculo_id',
        'cita_taller_id',
        'kilometros',
        'observaciones',
        'prox_revision',
        'mano_obra',
    ];

    public function vehiculo()
    {
        return $this->belongsTo(Vehiculo::class)->withTrashed();
    }

    public function cita()
    {
        return $this->belongsTo(CitaTaller::class, 'cita_taller_id');
    }

    public function mantenimientoDetalles()
    {
        return $this->hasMany(MantenimientoDetalle::class);
    }
}
