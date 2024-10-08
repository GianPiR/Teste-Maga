<?php
// bootstrap.php
use Doctrine\ORM\Tools\Setup;
use Doctrine\ORM\EntityManager;

require_once "vendor/autoload.php";

$isDevMode = true;
$proxyDir = null;
$cache = null;
$useSimpleAnnotationReader = false;
$config = Setup::createAnnotationMetadataConfiguration(array(__DIR__."/src"), $isDevMode, $proxyDir, $cache, $useSimpleAnnotationReader);

$conn = array(
    'driver' => 'pdo_pgsql',
    'host' => 'localhost',
    'port' => '5432',
    'user' => 'teste_magazord',
    'password' => 'teste_magazord',
    'dbname' => 'teste_magazord',
    'charset' => 'utf8',
);

$entityManager = EntityManager::create($conn, $config);

return $entityManager;