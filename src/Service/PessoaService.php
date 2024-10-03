<?php

namespace App\Service;

use App\Entity\Pessoa;
use App\Repository\PessoaRepository;
use Doctrine\ORM\EntityManagerInterface;

class PessoaService
{
    private $entityManager;
    private $pessoaRepository;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
        $this->pessoaRepository = $this->entityManager->getRepository(Pessoa::class);
    }

    public function create(string $nome, string $cpf): Pessoa
    {
        $pessoa = new Pessoa();
        $pessoa->setNome($nome);
        $pessoa->setCpf($cpf);

        $this->pessoaRepository->create($pessoa);

        return $pessoa;
    }

    public function findById(int $id): ?Pessoa
    {
        return $this->pessoaRepository->findById($id);
    }

    public function update(int $id, ?string $nome, ?string $cpf): ?Pessoa
    {
        $pessoa = $this->pessoaRepository->findById($id);
        
        if ($pessoa) {
            if ($nome) $pessoa->setNome($nome);
            if ($cpf) $pessoa->setCpf($cpf);
            $this->pessoaRepository->update($pessoa);
        }

        return $pessoa;
    }

    public function delete(int $id): bool
    {
        $pessoa = $this->pessoaRepository->findById($id);
        
        if ($pessoa) {
            $this->pessoaRepository->delete($pessoa);
            return true;
        }

        return false;
    }

    public function list(): array
    {
        return $this->pessoaRepository->listAll();
    }

    public function listByName(string $nome): array
    {
        return $this->pessoaRepository->listByName($nome);
    }

    public function cpfExists($cpf): bool
    {
        return $this->pessoaRepository->findByCpf($cpf) !== null;
    }
}
