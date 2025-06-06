<?php

namespace App\Http\Middleware;

use App\Models\CitaTaller;
use App\Models\Devolucion;
use App\Models\Pedido;
use App\Models\Producto;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user()
                    ? array_merge($request->user()->toArray(), [
                        'can' => [
                            'create_productos' => $request->user()->can('create', Producto::class),
                            'viewAny_productos' => $request->user()->can('viewAny', Producto::class),
                            'viewAny_devoluciones' => $request->user()->can('viewAny', Devolucion::class),
                            'viewAny_pedidos' => $request->user()->can('viewAny', Pedido::class),
                            'viewAny_citasTaller' => $request->user()->can('viewAny', CitaTaller::class),
                        ],
                    ])
                    : null,
            ],

            'flash' => [
                'success' => fn () => $request->session()->get('success'),
            ]
        ]);
    }
}
