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
        Schema::create('mantenimiento_detalles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mantenimiento_id')->constrained();
            $table->foreignId('tipo_mantenimiento_id')->constrained('tipos_mantenimiento');
            $table->boolean('limpiar')->default(false);
            $table->boolean('revisar')->default(false);
            $table->boolean('sustituir')->default(false);
            $table->decimal('precio', 8, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mantenimiento_detalles');
    }
};
