<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TiposMantenimiento extends Model
{
    /** @use HasFactory<\Database\Factories\TiposMantenimientoFactory> */
    use HasFactory;

    protected $table = 'tipos_mantenimiento';

    protected $fillable = [
        'nombre',
        'descripcion',
    ];

    public function mantenimientoDetalles()
    {
        return $this->hasMany(MantenimientoDetalle::class, 'tipo_mantenimiento_id');
    }

}
