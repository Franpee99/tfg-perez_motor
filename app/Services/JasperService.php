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

    public function generarFacturaVenta(array $params = [])
    {
        // Java 8 como entorno temporal para este proceso (ya que solo funciona con versiones de java anteriores)
        putenv('JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64');
        putenv('PATH=' . getenv('JAVA_HOME') . '/bin:' . getenv('PATH'));

        $input = storage_path('informes/FacturaVenta.jasper');
        $output = storage_path('informes/output/factura_' . time());

        $options = [
            'format' => ['pdf'],
            'params' => $params,
            'locale' => 'es_ES',
            'db_connection' => [
                'driver'   => 'postgres',
                'username' => config('database.connections.pgsql.username'),
                'password' => config('database.connections.pgsql.password'),
                'host'     => config('database.connections.pgsql.host'),
                'database' => config('database.connections.pgsql.database'),
                'port'     => config('database.connections.pgsql.port', 5432),
            ]
        ];

        $this->jasper->process(
            $input,
            $output,
            $options
        )->execute();

        return $output . '.pdf';
    }


    public function generarFacturaTaller(array $params = [])
    {
        putenv('JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64');
        putenv('PATH=' . getenv('JAVA_HOME') . '/bin:' . getenv('PATH'));

        $input = storage_path('informes/FacturaTaller.jasper');
        $output = storage_path('informes/output/factura_taller_' . time());

        $options = [
            'format' => ['pdf'],
            'params' => $params,
            'locale' => 'es_ES',
            'db_connection' => [
                'driver'   => 'postgres',
                'username' => config('database.connections.pgsql.username'),
                'password' => config('database.connections.pgsql.password'),
                'host'     => config('database.connections.pgsql.host'),
                'database' => config('database.connections.pgsql.database'),
                'port'     => config('database.connections.pgsql.port', 5432),
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
