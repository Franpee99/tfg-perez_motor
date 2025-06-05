<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MantenimientoDetalle extends Model
{
    use HasFactory;

    protected $fillable = [
        'mantenimiento_id',
        'tipo_mantenimiento_id',
        'limpiar',
        'revisar',
        'sustituir',
        'precio',
    ];

    public function mantenimiento()
    {
        return $this->belongsTo(Mantenimiento::class);
    }

    public function tipoMantenimiento()
    {
        return $this->belongsTo(TiposMantenimiento::class);
    }
}
