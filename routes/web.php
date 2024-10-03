<?php
use App\Controller\PessoaController;

$router->add('POST', '/create/pessoa', [PessoaController::class, 'create']);
$router->add('GET', '/list/pessoa', [PessoaController::class, 'list']);
$router->add('GET', '/get/pessoa/{id}', [PessoaController::class, 'getById']);
$router->add('POST', '/update/pessoa/{id}', [PessoaController::class, 'update']);
$router->add('DELETE', '/delete/pessoa/{id}', [PessoaController::class, 'delete']);
$router->add('POST', '/create/contato', [ContatoController::class, 'create']);
$router->add('GET', '/list/contato/{id}', [ContatoController::class, 'list']);
$router->add('GET', '/get/contato/{id}', [ContatoController::class, 'getById']);
$router->add('POST', '/update/contato/{id}', [ContatoController::class, 'update']);
$router->add('DELETE', '/delete/contato/{id}', [ContatoController::class, 'delete']);
