# Teste para Desenvolvedor(a) Back-End Node.js/NestJS - Sistemas Distribuídos

## Conteúdo

- [Visão geral](#visão-geral)
- [Tecnologias Escolhidas](#tecnologias-escolhidas)
- [Estratégias Implementadas](#estratégias-implementadas)
- [Decisões](#decisões)
- [Como executar](#como-executar)
- [Estrutura](#estrutura)

## Visão Geral

Este projeto é uma solução para o desafio de desenvolvimento de um sistema de venda de ingressos para uma rede de cinemas, focando em alta concorrência e sistemas distribuídos. A aplicação foi desenvolvida utilizando **NestJs** com **TypeScript**, implementando uma arquitetura modular que garante separação de responsabilidades e facilita a manutenção e escalabilidade.

A solução aborda os principais desafios do problema:

- **Controle de concorrência** através de locks distribuídos com Redis/Redlock para evitar race conditions na reserva de assentos
- **Reservas temporárias** com expiração automática de 30 segundos
- **Comunicação assíncrona** entre módulos utilizando Kafka para garantir desacoplamento e confiabilidade
- **Alta disponibilidade** com NGINX como load balancer, Redis Sentinel para failover automático e replicação PostgreSQL (master/replica)
- **Cache inteligente** com Redis para controlar disponibilidade de assentos em tempo real
- **Transações seguras** utilizando o decorator `@Transactional()` para garantir consistência dos dados

O sistema garante que nenhum assento seja vendido duas vezes, mesmo com múltiplos usuários tentando reservar simultaneamente em múltiplas instâncias da aplicação.

## Tecnologias Escolhidas

### Banco de Dados Relacional - PostgreSQL

Escolhi o **PostgreSQL** como banco de dados relacional principal por ser robusto, confiável e amplamente utilizado em produção. Ele oferece excelente suporte a transações ACID, o que é essencial para garantir a consistência dos dados em operações críticas como reservas e vendas de assentos. Além disso, a configuração com replicação (master/replica) permite distribuir a carga de leitura e garantir alta disponibilidade.

### Sistema de Mensageria - Kafka

Optei pelo **Apache Kafka** como sistema de mensageria por sua alta performance, durabilidade de mensagens e capacidade de lidar com grandes volumes de eventos. O Kafka garante que mensagens não sejam perdidas mesmo em caso de falhas, e o pacote `@nestjs/microservices` oferece integração nativa com estratégias de retry inteligente. Isso é fundamental para eventos críticos como criação de reservas, confirmação de pagamentos e expiração de reservas.

### Cache Distribuído - Redis

O **Redis** foi escolhido como solução de cache distribuído por sua velocidade extrema e suporte a estruturas de dados avançadas. Utilizei o Redis para:

- **Controle de disponibilidade de assentos** em tempo real
- **Locks distribuídos** com Redlock para evitar race conditions
- **Reservas temporárias** com TTL automático de 30 segundos

A configuração com **Redis Sentinel** garante alta disponibilidade e failover automático caso o nó master apresente problemas.

### ORM - Drizzle ORM

Escolhi o **Drizzle ORM** por ser type-safe, performático e oferecer uma API moderna e intuitiva. Ele se integra bem com TypeScript e oferece suporte nativo a cache de queries, além de funcionar perfeitamente com a lib `@nestjs-cls/transactional` para gerenciamento de transações.

### Autenticação - Better Auth

Utilizei o **Better Auth** para não "reinventar a roda" na parte de autenticação. É uma solução completa que roda localmente, oferecendo suporte a múltiplos provedores de autenticação, sessões seguras e integração simples com NestJS através da lib `@thallesp/nestjs-better-auth`.

### Load Balancer - NGINX

O **NGINX** foi configurado como load balancer para distribuir requisições entre múltiplas instâncias da API, simulando um ambiente de produção com alta disponibilidade e permitindo testes mais precisos de concorrência.

### Internacionalização - nestjs-i18n

Utilizei a biblioteca **nestjs-i18n** para suporte a múltiplos idiomas nas mensagens de erro e respostas da API, facilitando a internacionalização do sistema.

### Validação - class-validator & class-transformer

Para validação de dados de entrada, utilizei **class-validator** e **class-transformer**, que se integram nativamente com NestJS e permitem validações declarativas através de decorators.

### Documentação - Swagger/OpenAPI

A documentação da API foi gerada automaticamente com **@nestjs/swagger**, disponível em `/api-docs`, facilitando a exploração e teste dos endpoints.

## Estratégias Implementadas

Esta solução foi cuidadosamente desenhada para atender ao desafio de venda de ingressos em um ambiente distribuído, alta concorrência e múltiplas instâncias da API. Abaixo, destaco as principais estratégias e mecanismos utilizados para garantir a integridade das reservas e a escalabilidade do sistema:

### 1. **Controle de Concorrência e Race Conditions**

- **Reservas com Lock Distribuído**: Ao receber uma requisição de reserva de assentos, o sistema utiliza Redis (cache distribuído) para aplicar locks nos assentos selecionados. Isso previne que múltiplos usuários reservem o mesmo assento ao mesmo tempo, mesmo em situações de concorrência extrema.
- **Verificação de Disponibilidade em Tempo Real**: Antes de efetivar a reserva, a aplicação verifica no Redis e no banco se o assento está disponível, evitando vendas duplicadas.

### 2. **Coordenação entre Instâncias e Consistência**

- **Ambiente Clusterizado**: O sistema pode ser executado com múltiplas instâncias da API (via Docker Compose Cluster com NGINX load balancer), com Redis Sentinel para alta disponibilidade do cache e Postgres configurado com master/replica, garantindo robustez e coordenação apropriada entre nós.
- **Mensageria Assíncrona (Kafka)**: Toda a comunicação entre partes desacopladas do sistema (ex: sessions <-> payments) ocorre via eventos Kafka, o que permite consistência eventual e resiliência no processamento de fluxos críticos (reserva, pagamento, expiração).

### 3. **Expiração e Liberação de Assentos**

- **Reservas Temporárias com TTL**: As reservas têm validade de 30 segundos (gerenciado via TTL/expire automático no Redis). Se o pagamento não for confirmado neste tempo, a reserva expira automaticamente e o assento volta a ficar disponível.
- **Eventos de Expiração**: A expiração publica eventos na mensageria para sincronizar todos os componentes e liberar adequadamente os recursos.

### 4. **Pagamento e Idempotência**

- **Confirmação de Pagamento com Idempotência**: O endpoint de pagamento é protegido por mecanismo de checagem de status, garantindo que múltiplas tentativas de confirmação para a mesma reserva não gerem inconsistências (ex: double confirmation ou erro por timeout/retry do cliente).
- **Conversão de Reserva em Venda Definitiva**: O pagamento aprovado converte a reserva (temporária) em venda definitiva no banco, sempre utilizando transações para segurança.

<!-- ### 5. **Deadlock Prevention**

- **Ordem Determinística dos Locks**: Sempre que múltiplos assentos são reservados na mesma operação, os locks são adquiridos em ordem ordenada (ex: por id do assento), evitando intertravamento entre processos concorrentes. -->

### 5. **Escalabilidade e Resiliência**

- **Uso Intenso de Cache**: Leitura e validação rápida de disponibilidade de assentos utilizando Redis, reduzindo carga no banco relacional e permitindo alta capacidade de resposta em concorrência.
- **Retry Inteligente**: Uso nativo das estratégias de retry/backoff do NestJS para a mensageria, aumentando a confiabilidade na entrega e processamento dos eventos.

### 6. **Transações e Integridade**

- **Decoração com @Transactional()**: Operações críticas (como reservar assento e atualizar status após pagamento) são executadas em transações atômicas, garantindo integridade do banco mesmo em caso de falhas parciais ou erro no envio de eventos.

### 7. **Boas práticas e Clean Code**

- **Separação Clara de Responsabilidades**: Uso de módulos por domínio, controllers enxutos, services e use-cases para regras de negócio, e repositórios para acesso a dados.
- **Tratamento Customizado de Exceções**: Exceções definidas para cenários esperados (assento já reservado, reserva expirada, etc.) melhoram feedback para o cliente e facilitam debug.
- **Documentação, ESLint, Prettier**: Projeto segue padrões de código, documentação por Swagger e ferramentas automáticas de formatação/lint.

---

Estas estratégias juntas asseguram que nenhum assento seja vendido duas vezes, o sistema seja robusto em ambientes distribuídos, suportando concorrência real, e a experiência do usuário seja confiável e rápida.

## Decisões

No decorrer da criação desse projeto muitas decisões foram tomadas, gostaria de compartilhar as principais:

### **Padrão de projeto:**

- A forma na qual eu decidi estruturar o projeto e não utilizar uma arquitetura hexagonal, DDD, ou qualquer outro design pattern. Foi pensando justamente em como vamos lidar com os projetos dentro da Starsoft (kube por exemplo) com uma arquitetura mais simples e direta.

### **Packages & Microsserviços:**

- A estrutura de módulos criada no projeto funcionaria muito bem caso fosse necessário separa-la em packages, pensando em uma escala maior uma migração para microsserviços precisaria de uma refatoração um pouco mais complexa em relação a como os módulos se comunicam, um for exemplo seria a deduplicação de dados em um scenario no qual o catalogo de filmes fosse isolado do domínio de sessões seria interessante mantermos uma cópia dos dados essenciais de filmes no contexto de sessões.

<!-- ### **Cluster:**

- O cenário do problema inicial indica múltiplas aplicações rodando ao mesmo tempo, com isso decidi por criar um arquivo [docker-compose.cluster.yml](#) com a configuração necessária para rodar um cenário com múltiplas instancias da API, do banco de dados Redis, e do Postgres. Assim podendo realizar testes mais precisos! -->

<!-- - Para fazer a API rodar com múltiplas instancias utilizei o **NGINX** como load balancer para distribuir as requisições entre as aplicações.

- Para o banco de dados Redis utilizei o **Redis Sentinel**, provendo alta disponibilidade e "Automatic failover", caso o banco **master** comece a ter mal funcionamento uma das **replicas** assume o controle.

- Para o banco de dados Postgres utilizei uma configuração com **1 master e 1 replica**, onde o master é responsável por todas as operações de escrita e a replica por operações de leitura, garantindo assim maior disponibilidade e distribuição de carga.

- Para o sistema de mensageria utilizei o Kafka, acabei não entrando muito a fundo sobre kafka distribuído, logo utilizei somente uma instancia normal. -->

<!-- ### **Cache:**

- Um dos principais pilares para um sistema escalável é a utilização de cache, para rotas mais primordiais como a **reserva de assentos** utilize o Redis para controlar disponibilidade e reservas temporárias, em outras rotas utilizei a própria api de cache do drizzle-orm. -->

### **Mensageria:**

- Para a mensageria entre components utilizei Kafka juntamente com o pacote próprio do NestJs, provendo assim uma serie de ferramentas úteis para a integridade das mensagens como estrategias de **retry** já existentes.

- Outro ponto importante que tenho visto muito ultimamente é o **Outbox pattern**, decidi não utilizar nesse projeto pois não vi a necessidade, pensando no cenário do problema (10 usuários tentando resgatar ao mesmo tempo) acredito que utilizar o Outbox pattern seria matar um coelho com uma bazuca, teríamos um breve delay no envio de mensagens esperando o relay executar, algo primordial nesse caso das reservas expirarem em 30 segundos. Utilizando a lib do NestJs o envio de mensagens possui **retry inteligente**, e com o decorator `@Transactional()` caso tenha uma falha no envio da mensagem a requisição inteira é revertida.

<!-- ### **Exceções:**

- Criei uma [classe customizada](#) como base para exceções customizadas possuindo suporte para o **i18n** com argumentos e **statusCode**. -->

### **Transações:**

- Algo muito importante em operações mais complexas que envolvem múltiplas buscas/escritas e a chamada de outros "serviços" são as transações, pesquisei sobre e encontrei uma forma de utilizar um decorator `@Transactional()` com drizzle-orm no NestJs, basta utilizar a lib [`@nestjs-cls/transactional`](https://papooch.github.io/nestjs-cls/plugins/available-plugins/transactional).

- No [use-case de reservar assento](/src/modules/sessions/seats/use-cases/reserve-session-seat.use-case.ts) isso acaba sendo muito util para conter falhas, um forte exemplo seria a falha na publicação de mensagens, impedindo assim que seja possível realizar o pagamento da reserva. Com decorator `@Transactional()` ele identifica qualquer erro recebido dentro da função e automaticamente já realiza um Rollback de todas as queries realizadas nesse contexto.

<!-- ### -->

## Como Executar

### Ambiente de desenvolvimento simples (single node)

Utilize o arquivo `docker-compose.yml` para subir rapidamente toda a stack em modo de desenvolvimento local:

```bash
npm install
```

```bash
docker compose up
```

Isso irá subir:

- API
- PostgreSQL
- Redis (modo simples)
- Kafka

A API ficará disponível em [http://localhost:3333](http://localhost:3333).

---

### Ambiente com alta disponibilidade e múltiplos nós

Para testar em modo clusterizado com replicação, sentinela e balanceamento de carga, use o arquivo `docker-compose.cluster.yml`:

```bash
docker compose -f docker-compose.cluster.yml up
```

Isso irá subir:

- 3 instâncias da API
- NGINX como load balancer (porta 3333)
- PostgreSQL (1 master, 1 replica)
- Redis Sentinel (1 master, 2 réplicas, 3 sentinels)
- Kafka

Acesse a API via [http://localhost:3333](http://localhost:3333).

---

Para derrubar e remover os volumes (dados persistentes):

```bash
docker compose down -v
# ou, para o cluster:
docker compose -f docker-compose.cluster.yml down -v
```

Consulte os arquivos `docker-compose.yml` e `docker-compose.cluster.yml` para detalhes de configuração e portas.

### Migrations & Seeders

Após iniciar o banco de dados é necessário rodar as migrations, para isso utilize o comando abaixo:

```bash
docker compose exec api /bin/sh
npm run migrations:run
```

Após rodar todas as migrations você poderá rodar os seeders utilizando:

```bash
docker compose exec api /bin/sh
npm run seeders:run
```

## Estrutura

A estrutura do projeto foi feita pensando em responsabilidades separadas, sendo assim cada módulo possui sua própria lógica, sendo alguns deles divididos em submódulos. Em módulos diretamente acoplados (movies, rooms -> sessions), a comunicação acontece por meio da importação de serviços, já em módulos nos quais o desacoplamento seria "essencial" pensando em uma escala futura (sessions <-> payments), a comunicação é realizada através de mensageria assíncrona (kafka).

```
└── 📁src
    └── 📁modules
        └── 📁auth
            └── Responsável por toda a parte de autenticação (modules/auth)
        └── 📁movies
            └── Responsável por toda a parte de gerenciamento de filmes (modules/movies)
        └── 📁payments
            └── Responsável por toda a parte de gerenciamento de pagamentos (modules/payments)
        └── 📁rooms
            └── Responsável por toda a parte de gerenciamento de salas (modules/rooms)
        └── 📁sessions
            └── 📁core
                └── Responsável por toda a parte de gerenciamento de sessões (modules/sessions/core)
            └── 📁seats
                └── Responsável por toda a parte de gerenciamento de assentos por sessões (modules/sessions/core)
    └── 📁shared
        └── Responsável por todo o código compartilhado entre os modulos (modules/movies)
```

### modules/auth

O módulo de autenticação foi feito para ser simples, sem ter que reinventar a roda, utilizando o better-auth juntamente com a lib [`@thallesp/nestjs-better-auth`](https://github.com/ThallesP/nestjs-better-auth) para uma integração mais simples com o NestJs.

```
└── 📁auth
    └── 📁schemas
        ├── auth.schema.ts
    └── auth.module.ts
```

### modules/movies

O módulo de filmes é responsável por gerenciar todos os filmes disponíveis, desde a criação de novos filmes no sistema até a busca por filmes específicos e uma listagem de todos os filmes com paginação.

```
└── 📁movies
    └── 📁controllers
        ├── movies.controller.ts
    └── 📁dtos
        ├── create-movie.dto.ts
        ├── find-movie-by-id.dto.ts
        ├── list-movies-with-pagination.dto.ts
    └── 📁exceptions
        ├── movie-not-found.exception.ts
        ├── unable-to-create-movie.exception.ts
    └── 📁interfaces
        ├── create-movie.use-case.interface.ts
        ├── find-movie-by-id.use-case.interface.ts
        ├── list-movies-with-pagination.use-case.interface.ts
    └── 📁repositories
        ├── movies.repository.ts
    └── 📁schemas
        ├── movies.schema.ts
    └── 📁services
        ├── movies.service.ts
    └── 📁swagger
        └── 📁schemas
            ├── movie.api-schema.ts
            ├── movies-pagination-result.api-schema.ts
    └── 📁use-cases
        ├── create-movie.use-case.ts
        ├── find-movie-by-id.use-case.ts
        ├── list-movies-with-pagination.use-case.ts
    └── movies.module.ts
```

Um módulo bem simples com apenas um **CRUD** básico sem rotas desnecessárias.

### modules/rooms

O módulo de **salas** foi feito para o gerenciamento de salas e assentos, para não termos que configurar uma sala do zero toda vez que formos criar uma sessão, podemos utilizar uma sala já definida.

```
└── 📁rooms
    └── 📁controllers
        ├── rooms.controller.ts
        ├── seats.controller.ts
    └── 📁dtos
        ├── create-room.dto.ts
        ├── create-seat.dto.ts
        ├── find-room-by-id.dto.ts
        ├── list-rooms-with-pagination.dto.ts
        ├── list-seats-with-pagination.dto.ts
        ├── list-seats.dto.ts
    └── 📁exceptions
        ├── room-not-found.exception.ts
        ├── seat-already-exists.exception.ts
        ├── seat-not-found.exception.ts
        ├── unable-to-create-room.exception.ts
        ├── unable-to-create-seat.exception.ts
    └── 📁interfaces
        ├── create-room.use-case.interface.ts
        ├── create-seat.use-case.interface.ts
        ├── find-room.use-case.interface.ts
        ├── list-rooms-with-pagination.use-case.interface.ts
        ├── list-seats-with-pagination.use-case.interface.ts
        ├── list-seats.use-case.interface.ts
    └── 📁repositories
        ├── rooms.repository.ts
        ├── seats.repository.ts
    └── 📁schemas
        ├── rooms.schema.ts
        ├── seats.schema.ts
    └── 📁services
        ├── rooms.service.ts
        ├── seats.service.ts
    └── 📁swagger
        └── 📁schemas
            ├── room.api-schema.ts
            ├── rooms-pagination-result.api-schema.ts
            ├── seat.api-schema.ts
            ├── seats-pagination-result.api-schema.ts
    └── 📁use-cases
        ├── create-room.use-case.ts
        ├── create-seat.use-case.ts
        ├── find-room-by-id.use-case.ts
        ├── list-rooms-with-pagination.use-case.ts
        ├── list-seats-with-pagination.use-case.ts
        ├── list-seats.use-case.ts
    └── rooms.module.ts
```

### modules/sessions

O módulo de **sessões** foi dividido em 2 submódulos com o proposito de uma melhor organização, sendo eles: [/core](#modulessessionscore) e [/seats](#modulessessionsseats)

### modules/sessions/core

O submódulo **sessões/core** é responsável por lidar com o gerenciamento de sessões, lidando com validação de filme e sala na criação de uma nova sessão, busca de sessões especificas, listagem de sessões com paginação e atualização de sessões.

```
└── 📁sessions
    └── 📁core
        └── 📁controllers
            ├── sessions.controller.ts
        └── 📁dtos
            ├── create-session.dto.ts
            ├── find-session.dto.ts
            ├── get-session-value-per-seat.dto.ts
            ├── list-sessions-with-pagination.dto.ts
            ├── update-session.dto.ts
        └── 📁exceptions
            ├── not-enough-seats.exception.ts
            ├── session-not-found.exception.ts
            ├── unable-to-create-session.exception.ts
            ├── unable-to-update-session.exception.ts
        └── 📁interfaces
            ├── create-session.use-case.interface.ts
            ├── find-session.use-case.interface.ts
            ├── get-session-value-per-seat.use-case.interface.ts
            ├── list-sessions-with-pagination.use-case.interface.ts
            ├── update-session.use-case.interface.ts
        └── 📁repositories
            ├── sessions.repository.ts
        └── 📁schemas
            ├── sessions.schema.ts
        └── 📁services
            ├── sessions.service.ts
        └── 📁swagger
            └── 📁schemas
                ├── session.api-schema.ts
        └── 📁use-cases
            ├── create-session.use-case.ts
            ├── find-session.use-case.ts
            ├── get-session-value-per-seat.use-case.ts
            ├── list-sessions-with-pagination.use-case.ts
            ├── update-session.use-case.ts
        ├── sessions-core.module.ts
```

### modules/sessions/seats

O submódulo **sessões/seats** é responsável por lidar com o gerenciamento de acentos por sessão, lidando com criação de assentos específicos por sessão, reserva de assentos e listagem de assentos disponíveis. O submódulo também possui integração com o sistema de mensageria para enviar eventos de reserva e consumir eventos de pagamentos.

```
└── 📁sessions
    └── 📁seats
        └── 📁cache
            └── 📁services
                ├── session-seats-cache.service.ts
        └── 📁controllers
            ├── session-seats.controller.ts
        └── 📁dtos
            ├── create-many-session-seats.dto.ts
            ├── create-session-seat.dto.ts
            ├── list-session-seats.dto.ts
            ├── reserve-session-seat.dto.ts
        └── 📁events
            └── 📁consumers
                ├── index.ts
                ├── payment-approved.consumer.ts
            └── 📁enums
                ├── session-seats-messages-topics.enum.ts
            └── 📁messages
                ├── reservation-created.message.ts
                ├── reservation-expired.message.ts
                ├── session-seat-released.message.ts
            └── 📁producers
                ├── session-seats.producer.ts
        └── 📁exceptions
            ├── session-seat-already-reserved.exception.ts
            ├── session-seat-not-available.exception.ts
            ├── session-seat-not-found.exception.ts
            ├── session-seat-reservation-not-found.exception.ts
            ├── unable-to-create-bulk-session-seats.exception.ts
            ├── unable-to-create-session-seat-reservation.exception.ts
            ├── unable-to-create-session-seat.exception.ts
            ├── unable-to-reserve-session-seat.exception.ts
            ├── unable-to-update-session-seat.exception.ts
        └── 📁interfaces
            ├── create-many-session-seats.use-case.interface.ts
            ├── handle-payment-approved.use-case.ts
            ├── list-session-seats.use-case.interface.ts
            ├── reserve-session-seat.use-case.interface.ts
        └── 📁repositories
            ├── session-seat-reservations.repository.ts
            ├── session-seats.repository.ts
        └── 📁schedulers
            ├── session-seat.scheduler.ts
        └── 📁schemas
            ├── session-seat-reservations.schema.ts
            ├── session-seats.schema.ts
        └── 📁services
            ├── session-seats.service.ts
        └── 📁swagger
            └── 📁schemas
                ├── session-seat-reservation.api-schema.ts
                ├── session-seat.api-schema.ts
        └── 📁use-cases
            ├── create-many-session-seats.use-case.ts
            ├── handle-payment-approved.use-case.ts
            ├── list-session-seats.use-case.ts
            ├── reserve-session-seat.use-case.ts
        ├── session-seats.module.ts
    └── sessions.module.ts
```

### modules/payments

O módulo de **pagamentos** é responsável por receber eventos de criação de reserva e associar um pagamento a mesma, responsável por listar pagamentos do usuário com paginação e filtro por _status_, busca por pagamento especifico, aprovar um pagamento especifico. O módulo também é responsável por emitir eventos relacionados aos pagamentos. (expirado, aprovado, etc)

```
└── 📁payments
    └── 📁controllers
        ├── payments.controller.ts
    └── 📁dtos
        ├── approve-payment.dto.ts
        ├── create-payment.dto.ts
        ├── find-payment.dto.ts
        ├── list-payments-with-pagination-and-filter.dto.ts
    └── 📁enums
        ├── payment-status.enum.ts
    └── 📁events
        └── 📁consumers
            ├── reservation-created.consumer.ts
        └── 📁enums
            ├── payments-messages-topics.enum.ts
        └── 📁messages
            ├── payment-approved.message.ts
            ├── payment-created.message.ts
            ├── payment-expired.message.ts
        └── 📁producers
            ├── payments.producer.ts
    └── 📁exceptions
        ├── payment-not-found.exception.ts
        ├── unable-to-approve-payment.exception.ts
        ├── unable-to-create-payment.exception.ts
    └── 📁interfaces
        ├── approve-payment.use-case.interface.ts
        ├── create-payment.use-case.interface.ts
        ├── find-payment.use-case.interface.ts
        ├── handle-reservation-created.use-case-interface.ts
        ├── list-payments-with-pagination-and-filter.use-case.interface.ts
    └── 📁repositories
        ├── payments.repository.ts
    └── 📁schedulers
        ├── payments.scheduler.ts
    └── 📁schemas
        ├── payments.schema.ts
    └── 📁services
        ├── payments.service.ts
    └── 📁swagger
        └── 📁schemas
            ├── payment.api-schema.ts
            ├── payments-pagination-result.api-schema.ts
    └── 📁use-cases
        ├── approve-payment.use-case.ts
        ├── create-payment.use-case.ts
        ├── find-payment.use-case.ts
        ├── handle-reservation-created.use-case.ts
        ├── list-payments-with-pagination-and-filter.use-case.ts
    └── payments.module.ts
```

## Testes

### Como executar os testes:

Para executar os testes é necessário a utilização da ferramenta [**k6**](https://grafana.com/docs/k6/latest/set-up/install-k6/), após instala-la siga os passos:

1. Executar [aplicação](#ambiente-com-alta-disponibilidade-e-múltiplos-nós)
2. Executar os [seeders](#migrations--seeders)
3. Executar os testes:

```bash
// Rodar teste de carga em reservas de assentos
npm run load-test:reserve-seat
```

### Resultados _load-test:reserve-seat_:

O teste de carga simula **25 usuários virtuais (VUs)** tentando reservar **o mesmo assento simultaneamente**, validando que os mecanismos de lock distribuído (Redlock) e controle de concorrência funcionam corretamente em ambiente distribuído (3 instâncias da API + NGINX).

**Cenário:** Todos os 25 VUs disparam ao mesmo tempo uma requisição `POST /sessions/:id/seats/:seatId/reserve` para o mesmo assento.

**Thresholds esperados:**

- `successful_reservations == 1` → Exatamente **1 reserva** deve ser confirmada
- `failed_reservations == 24` → As outras **24 devem receber 409** (`SessionSeatAlreadyReservedException`)

**Resultado:**

```
  █ THRESHOLDS

    failed_reservations
    ✓ 'count == 24' count=24

    successful_reservations
    ✓ 'count == 1' count=1


  █ TOTAL RESULTS

    checks_total.......: 25      16.067129/s
    checks_succeeded...: 100.00% 25 out of 25
    checks_failed......: 0.00%   0 out of 25

    ✓ response is 200 (success) or 409 (expected conflict)

    CUSTOM
    failed_reservations............: 24     15.424444/s
    successful_reservations........: 1      0.642685/s

    HTTP
    http_req_duration..............: avg=302.74ms min=6.86ms   med=294.88ms max=531.76ms p(90)=444.73ms p(95)=478.04ms
      { expected_response:true }...: avg=164.87ms min=6.86ms   med=178.42ms max=252.96ms p(90)=229.61ms p(95)=241.29ms
    http_req_failed................: 77.41% 24 out of 31
    http_reqs......................: 31     19.92324/s

    EXECUTION
    iteration_duration.............: avg=335.17ms min=136.38ms med=321.21ms max=532.1ms  p(90)=459.44ms p(95)=484.23ms
    iterations.....................: 25     16.067129/s
    vus_max........................: 25     min=25       max=25

    NETWORK
    data_received..................: 23 kB  15 kB/s
    data_sent......................: 10 kB  6.5 kB/s


running (00m01.6s), 00/25 VUs, 25 complete and 0 interrupted iterations
default ✓ [ 100% ] 25 VUs  00m00.5s/10m0s  25/25 shared iters
```

Todos os thresholds foram satisfeitos: **1 reserva com sucesso (HTTP 200)** e **24 conflitos esperados (HTTP 409)**. O tempo médio de resposta foi de **302ms**, com o assento vencedor respondendo em ~165ms (tempo médio das respostas bem-sucedidas).
