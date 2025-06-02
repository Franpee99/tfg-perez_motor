<?php

namespace App\Policies;

use App\Models\Mantenimiento;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class MantenimientoPolicy
{

    public function verFacturaTaller(User $user, Mantenimiento $mantenimiento): bool
    {
        return $mantenimiento->vehiculo->user_id === $user->id || $user->is_admin;
    }

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Mantenimiento $mantenimiento): bool
    {
        return $user->id == $mantenimiento->vehiculo->user->id || $user->is_admin;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->is_admin;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Mantenimiento $mantenimiento): bool
    {
        return $user->is_admin;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Mantenimiento $mantenimiento): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Mantenimiento $mantenimiento): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Mantenimiento $mantenimiento): bool
    {
        return false;
    }
}
