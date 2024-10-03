<?php
require_once '../vendor/autoload.php';

use App\Controller\PessoaController;
use App\Service\PessoaService;
use App\Controller\ContatoController;
use App\Service\ContatoService;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

$entityManager = require_once '../bootstrap.php';

$pessoaService = new PessoaService($entityManager);
$pessoaController = new PessoaController($pessoaService);
$contatoService = new ContatoService($entityManager);
$contatoController = new ContatoController($contatoService, $pessoaService);

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($path === '/list/pessoa') {
    if (!empty($_GET)) {
        $nome = $_GET['nome'];
        $response = $pessoaController->list($nome);
        echo $response->getContent();
    } else {
        $response = $pessoaController->list();
        echo $response->getContent();
    }
} elseif ($path === '/create/pessoa') {
    $response = $pessoaController->create($_POST['nome'], $_POST['cpf']);
    echo $response->getContent();
} elseif (preg_match('/^\/update\/pessoa\/(\d+)$/', $path, $matches)) {
    $id = (int)$matches[1];
    $response = $pessoaController->update($_POST['nome'], $_POST['cpf'], $id);
    echo $response->getContent();
} elseif (preg_match('/^\/delete\/pessoa\/(\d+)$/', $path, $matches)) {
    $id = (int)$matches[1];
    $response = $pessoaController->delete($id);
    echo $response->getContent();
} elseif (preg_match('/^\/get\/pessoa\/(\d+)$/', $path, $matches)) {
    $id = (int)$matches[1];
    $response = $pessoaController->getById($id);
    echo $response->getContent();
} elseif (preg_match('/^\/list\/contato\/(\d+)$/', $path, $matches)) {
    $id = (int)$matches[1];
    $response = $contatoController->list($id);
    echo $response->getContent();
} elseif ($path === '/create/contato') {
    $response = $contatoController->create($_POST['pessoa_id'], $_POST['tipo'], $_POST['descricao']);
    echo $response->getContent();
} elseif (preg_match('/^\/update\/contato\/(\d+)$/', $path, $matches)) {
    $id = (int)$matches[1];
    $response = $contatoController->update($_POST['tipo'], $_POST['descricao'], $id);
    echo $response->getContent();
} elseif (preg_match('/^\/delete\/contato\/(\d+)$/', $path, $matches)) {
    $id = (int)$matches[1];
    $response = $contatoController->delete($id);
    echo $response->getContent();
} elseif (preg_match('/^\/get\/contato\/(\d+)$/', $path, $matches)) {
    $id = (int)$matches[1];
    $response = $contatoController->getById($id);
    echo $response->getContent();
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Página não encontrada.']);
}
