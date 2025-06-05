<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EstadoCita extends Model
{
    /** @use HasFactory<\Database\Factories\EstadoCitaFactory> */
    use HasFactory;

    public function citas()
    {
        return $this->hasMany(CitaTaller::class);
    }

}
