<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('citas_taller', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained();
            $table->foreignId('vehiculo_id')->nullable()->constrained();
            $table->date('fecha');
            $table->time('hora');
            $table->enum('estado', ['disponible', 'reservada', 'finalizada', 'cancelada'])->default('disponible');
            $table->enum('motivo', ['mantenimiento', 'reparacion', 'otro'])->nullable();
            $table->text('mensaje')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('citas_taller');
    }
};
