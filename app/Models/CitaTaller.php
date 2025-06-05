<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CitaTaller extends Model
{
    /** @use HasFactory<\Database\Factories\CitaTallerFactory> */
    use HasFactory, SoftDeletes;

    protected $table = 'citas_taller';

    protected $fillable = [
        'fecha',
        'hora',
        'estado_cita_id',
        'user_id',
        'vehiculo_id',
        'motivo_cita_id',
        'mensaje',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function vehiculo()
    {
        return $this->belongsTo(Vehiculo::class);
    }

    public function mantenimiento()
    {
        return $this->hasOne(Mantenimiento::class);
    }

    public function estado_cita()
    {
        return $this->belongsTo(EstadoCita::class);
    }

    public function motivo_cita()
    {
        return $this->belongsTo(MotivoCita::class);
    }

    /*
    public function actualizarEstado()
    {
        if($this->estado === 'finalizada' || $this->estado === 'cancelada') return;

        if( $this->estado === 'reservada' && strtotime($this->fecha . ' ' . $this->hora) <= time()){
            $this->estado = 'finalizada';
            $this->save();
        }
    }
    */

}
