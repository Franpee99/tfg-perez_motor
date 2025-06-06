<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pedido extends Model
{
    /** @use HasFactory<\Database\Factories\PedidoFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = ['user_id', 'estado', 'total', 'numero_factura', 'paypal_capture_id',];

    public function user()
    {
        return $this->belongsTo(User::class)->withTrashed();
    }

    public function detalles()
    {
        return $this->hasMany(DetallePedido::class);
    }


    public function actualizarEstado()
    {
        if($this->estado === 'entregado') return;

        if($this->estado === 'enviado' && $this->created_at->diffInMinutes(now()) >= 5){
            $this->estado = 'entregado';
            $this->save();
        }
    }

    public function devoluciones()
    {
        return $this->hasMany(Devolucion::class);
    }
}
