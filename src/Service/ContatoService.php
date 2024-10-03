<?php

namespace App\Service;

use App\Entity\Contato;
use App\Entity\Pessoa;
use App\Repository\ContatoRepository;
use Doctrine\ORM\EntityManagerInterface;

class ContatoService
{
    private $entityManager;
    private $contatoRepository;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
        $this->contatoRepository = $this->entityManager->getRepository(Contato::class);
    }

    public function create(Pessoa $pessoa, string $tipo, string $descricao): Contato
    {
        $contato = new Contato();
        $contato->setPessoa($pessoa);
        $contato->setTipo($tipo);
        $contato->setDescricao($descricao);

        $this->contatoRepository->create($contato);

        return $contato;
    }

    public function findById(int $id): ?Contato
    {
        return $this->contatoRepository->findById($id);
    }

    public function update(int $id, ?string $tipo, ?string $descricao): ?Contato
    {
        $contato = $this->contatoRepository->findById($id);
        
        if ($contato) {
            if ($tipo) $contato->setTipo($tipo);
            if ($descricao) $contato->setDescricao($descricao);
            $this->contatoRepository->update($contato);
        }

        return $contato;
    }

    public function delete(int $id): bool
    {
        $contato = $this->contatoRepository->findById($id);
        
        if ($contato) {
            $this->contatoRepository->delete($contato);
            return true;
        }

        return false;
    }

    public function list($pessoa): array
    {
        return $this->contatoRepository->list($pessoa);
    }
}
