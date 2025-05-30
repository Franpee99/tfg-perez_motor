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
        Schema::create('mantenimientos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehiculo_id')->constrained();
            $table->foreignId('cita_taller_id')->nullable()->constrained('citas_taller');
            $table->integer('kilometros')->nullable();
            $table->text('observaciones')->nullable();
            $table->string('prox_revision');
            $table->decimal('mano_obra', 8, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mantenimientos');
    }
};
