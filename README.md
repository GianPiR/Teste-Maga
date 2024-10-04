## Lista de Pessoas e Contas
Utilizando:
- Doctrine
- Docker
- PHP
- HTML
- CSS
- JS

:one: Crie o docker:

```
docker-compose up
```

:two: Instalar as dependencias:

```
composer install
```
:three: Rodar o Doctrine para criar as tabelas:

```
vendor/bin/doctrine orm:schema-tool:create
```

:four: Ligar o servidor:

```
php -S localhost:8081 -t local-do-repositorio/public
```

:five: Inicie o live server do index.html em:

```
repositorio/public
```
