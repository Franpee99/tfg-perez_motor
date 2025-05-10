<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pedido extends Model
{
    /** @use HasFactory<\Database\Factories\PedidoFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = ['user_id', 'estado', 'total', 'numero_factura'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function detalles()
    {
        return $this->hasMany(DetallePedido::class);
    }


    public function actualizarEstadoAutomaticamente()
    {
        if($this->estado === 'entregado') return;

        if($this->estado === 'enviado' && $this->created_at->diffInMinutes(now()) >= 2){
            $this->estado = 'entregado';
            $this->save();
        } elseif($this->estado === 'procesado' && $this->created_at->diffInMinutes(now()) >= 1) {
            $this->estado = 'enviado';
            $this->save();
        }
    }

}
