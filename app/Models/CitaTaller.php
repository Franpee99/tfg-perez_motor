<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CitaTaller extends Model
{
    /** @use HasFactory<\Database\Factories\CitaTallerFactory> */
    use HasFactory;

    protected $table = 'citas_taller';

    protected $fillable = [
        'fecha',
        'hora',
        'estado',
        'user_id',
        'marca',
        'modelo',
        'matricula',
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
