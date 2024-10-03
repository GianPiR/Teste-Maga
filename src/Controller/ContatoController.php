<?php

namespace App\Controller;

use App\Entity\Contato;
use App\Service\ContatoService;
use App\Service\PessoaService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

class ContatoController
{
    private $contatoService;
    private $pessoaService;

    public function __construct(ContatoService $contatoService, PessoaService $pessoaService)
    {
        $this->contatoService = $contatoService;
        $this->pessoaService = $pessoaService;
    }

    public function create($pessoa_id, $tipo, $descricao): Response
    {
        $pessoa = $this->pessoaService->findById($pessoa_id);

        if (!$pessoa) {
            throw new NotFoundHttpException("Pessoa não encontrada.");
        }

        $tipo = trim($tipo);
        $descricao = trim($descricao);

        $this->contatoService->create($pessoa, $tipo, $descricao);

        return new JsonResponse(['status' => 'Contato criado!']);
    }

    public function getById(int $id): Response
    {
        $contato = $this->contatoService->findById($id);

        if (!$contato) {
            return new Response(json_encode(['message' => 'Contato não encontrada']), Response::HTTP_NOT_FOUND, ['Content-Type' => 'application/json']);
        }

        $data = [
            'id' => $contato->getId(),
            'pessoa_id' => $contato->getPessoa()->getId(),
            'tipo' => $contato->getTipo(),
            'descricao' => $contato->getDescricao(),
        ];

        return new Response(json_encode($data), Response::HTTP_OK, ['Content-Type' => 'application/json']);
    }

    public function update($tipo, $descricao, int $id): Response
    {
        $contato = $this->contatoService->update($id, $tipo ?? null, $descricao ?? null);
        
        if (!$contato) {
            return new JsonResponse(['Contato não encontrada'], 404);
        }

        $data = [
            'id' => $contato->getId(),
            'tipo' => $contato->getTipo(),
            'descricao' => $contato->getDescricao(),
        ];

        return new Response(json_encode($data), Response::HTTP_OK, ['Content-Type' => 'application/json']);
    }

    public function delete(int $id): Response
    {
        $deleted = $this->contatoService->delete($id);
        
        if (!$deleted) {
            return new JsonResponse(['Contato não encontrada'], 404);
        }

        return new Response(null, Response::HTTP_NO_CONTENT);
    }

    public function list($id): Response
    {
        $pessoa = $this->pessoaService->findById($id);

        if (!$pessoa) {
            throw new NotFoundHttpException("Pessoa não encontrada.");
        }

        $contatos = $this->contatoService->list($pessoa);
        return new JsonResponse($contatos, Response::HTTP_OK);
    }
}
