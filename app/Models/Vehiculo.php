<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vehiculo extends Model
{
    /** @use HasFactory<\Database\Factories\VehiculoFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'marca',
        'modelo',
        'cilindrada',
        'matricula',
        'anio',
        'color',
        'vin'
    ];

        public function user()
    {
        return $this->belongsTo(User::class)->withTrashed();
    }

    public function citas()
    {
        return $this->hasMany(CitaTaller::class);
    }

    public function mantenimientos()
    {
        return $this->hasMany(Mantenimiento::class);
    }

}
