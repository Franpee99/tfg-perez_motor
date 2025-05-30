<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MotivoCita extends Model
{
    /** @use HasFactory<\Database\Factories\MotivoCitaFactory> */
    use HasFactory;

    public function citas()
    {
        return $this->hasMany(CitaTaller::class);
    }
}
