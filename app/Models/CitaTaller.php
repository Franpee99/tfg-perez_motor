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
        'estado',
        'user_id',
        'vehiculo_id',
        'motivo',
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

}
