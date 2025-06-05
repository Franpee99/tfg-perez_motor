<?php

namespace App\Providers;

use App\Models\LineaCarrito;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Inertia::share([
            'user' => function () {
                return Auth::user();
            },
            // Contador de carrito
            'carritoCount' => function () {
                if (Auth::check()) {
                    return LineaCarrito::where('user_id', Auth::id())->sum('cantidad');
                }
                return 0;
            },
        ]);
    }
}
