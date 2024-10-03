<?php

namespace App\Controller;

use App\Service\PessoaService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

class PessoaController
{
    private $pessoaService;

    public function __construct(PessoaService $pessoaService)
    {
        $this->pessoaService = $pessoaService;
    }

    public function create($nome, $cpf): Response
    {
        $nome = trim($nome);
        $cpf = trim($cpf);

        $cpf = preg_replace('/\D/', '', $cpf);

        if ($this->pessoaService->cpfExists($cpf)) {
            return new JsonResponse(['status' => 'Erro', 'message' => 'CPF já cadastrado!'], 400);
        }

        $this->pessoaService->create($nome, $cpf);

        return new JsonResponse(['status' => 'Pessoa criada!']);
    }

    public function getById(int $id): Response
    {
        $pessoa = $this->pessoaService->findById($id);

        if (!$pessoa) {
            return new Response(json_encode(['message' => 'Pessoa não encontrada']), Response::HTTP_NOT_FOUND, ['Content-Type' => 'application/json']);
        }

        $data = [
            'id' => $pessoa->getId(),
            'nome' => $pessoa->getNome(),
            'cpf' => $pessoa->getCpf(),
        ];

        return new Response(json_encode($data), Response::HTTP_OK, ['Content-Type' => 'application/json']);
    }

    public function update($nome, $cpf, int $id): Response
    {
        $pessoa = $this->pessoaService->update($id, $nome ?? null, $cpf ?? null);
        
        if (!$pessoa) {
            return new JsonResponse(['Pessoa não encontrada'], 404);
        }

        $data = [
            'id' => $pessoa->getId(),
            'nome' => $pessoa->getNome(),
            'cpf' => $pessoa->getCpf(),
        ];

        return new Response(json_encode($data), Response::HTTP_OK, ['Content-Type' => 'application/json']);
    }

    public function delete(int $id): Response
    {
        $deleted = $this->pessoaService->delete($id);
        
        if (!$deleted) {
            return new JsonResponse(['Pessoa não encontrada'], 404);
        }

        return new Response(null, Response::HTTP_NO_CONTENT);
    }

    public function list(?string $nome = null): Response
    {
        if ($nome) {
            $pessoas = $this->pessoaService->listByName($nome);

            return new JsonResponse($pessoas, Response::HTTP_OK);
        } else {
            $pessoas = $this->pessoaService->list();
                
            return new JsonResponse($pessoas, Response::HTTP_OK);
        }
    }
}
