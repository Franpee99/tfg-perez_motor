<?php

namespace App\Services;

use PHPJasper\PHPJasper;

class JasperService
{
    protected $jasper;

    public function __construct()
    {
        $this->jasper = new \PHPJasper\PHPJasper(base_path('packages/phpjasper/phpjasper/bin/jasperstarter/bin'));
    }

    public function generarFactura(array $params = [])
    {
        // Establecer Java 8 como entorno temporal para este proceso (ya que solo funciona con versiones de java anteriores)
        putenv('JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64');
        putenv('PATH=' . getenv('JAVA_HOME') . '/bin:' . getenv('PATH'));

        $input = storage_path('informes/FacturaVenta.jasper');
        $output = storage_path('informes/output/factura_' . time());

        $options = [
            'format' => ['pdf'],
            'params' => $params,
            'locale' => 'es_ES',
            'db_connection' => [
                'driver' => 'postgres',
                'username' => env('DB_USERNAME'),
                'password' => env('DB_PASSWORD'),
                'host' => env('DB_HOST'),
                'database' => env('DB_DATABASE'),
                'port' => env('DB_PORT', 5432),
            ]
        ];

        $this->jasper->process(
            $input,
            $output,
            $options
        )->execute();

        return $output . '.pdf';
    }

}
