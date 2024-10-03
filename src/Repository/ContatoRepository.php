<?php

namespace App\Repository;

use App\Entity\Contato;
use Doctrine\ORM\EntityRepository;

class ContatoRepository extends EntityRepository
{

    public function create(Contato $contato): void
    {
        $this->_em->persist($contato);
        $this->_em->flush();
    }

    public function update(Contato $contato): void
    {
        $this->_em->flush();
    }

    public function delete(Contato $contato): void
    {
        $this->_em->remove($contato);
        $this->_em->flush();
    }

    public function findById(string $id): ?Contato
    {
        return $this->_em->getRepository(Contato::class)->find($id);
    }

    public function list($pessoa): array
    {
        $contatos = $this->_em->getRepository(Contato::class)->findBy(['pessoa' => $pessoa]);

        return array_map(function ($contato) {
            return [
                'id' => $contato->getId(),
                'tipo' => $contato->getTipo(),
                'descricao' => $contato->getDescricao(),
                'pessoa_id' => $contato->getPessoa()->getId()
            ];
        }, $contatos);
    }
}
