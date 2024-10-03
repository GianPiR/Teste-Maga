<?php

namespace App\Repository;

use App\Entity\Pessoa;
use Doctrine\ORM\EntityRepository;

class PessoaRepository extends EntityRepository
{

    public function create(Pessoa $pessoa): void
    {
        $this->_em->persist($pessoa);
        $this->_em->flush();
    }

    public function update(Pessoa $pessoa): void
    {
        $this->_em->flush();
    }

    public function delete(Pessoa $pessoa): void
    {
        $this->_em->remove($pessoa);
        $this->_em->flush();
    }

    public function findById(string $id): ?Pessoa
    {
        return $this->_em->getRepository(Pessoa::class)->find($id);
    }

    public function listAll(): array
    {
        $pessoas = $this->_em->getRepository(Pessoa::class)->findAll();

        return array_map(function ($pessoa) {
            return [
                'id' => $pessoa->getId(),
                'nome' => $pessoa->getNome(),
                'cpf' => $pessoa->getCpf(),
            ];
        }, $pessoas);
    }

    public function listByName(string $nome): array
    {
        return $this->_em->getRepository(Pessoa::class)->findBy(['nome' => $nome]);
    }

    public function findByCpf($cpf)
    {
        return $this->findOneBy(['cpf' => $cpf]);
    }
}
