# Teste para Desenvolvedor(a) Back-End Node.js/NestJS - Sistemas Distribuídos

## Conteúdo

- [Estrutura](#estrutura)
- [Decisões](#decisões)

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

O módulo de autenticação foi feito para ser simples, sem ter que reinventar a roda, utilizando o better-auth juntamente com a lib `@thallesp/nestjs-better-auth` para uma integração mais simples com o NestJs.

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

## Decisões

No decorrer da criação desse projeto muitas decisões foram tomadas, gostaria de compartilhar as principais:

### **Padrão de projeto:**

- A forma na qual eu decidi estruturar o projeto e não utilizar uma arquitetura hexagonal, DDD, ou qualquer outro design pattern. Foi pensando justamente em como vamos lidar com os projetos dentro da Starsoft (kube por exemplo) com uma arquitetura mais simples e direta.

### **Packages & Microsserviços:**

- A estrutura de módulos criada no projeto funcionaria muito bem caso fosse necessário separa-la em packages, pensando em uma escala maior uma migração para microsserviços precisaria de uma refatoração um pouco mais complexa em relação a como os módulos se comunicam, um for exemplo seria a deduplicação de dados em um scenario no qual o catalogo de filmes fosse isolado do domínio de sessões seria interessante mantermos uma cópia dos dados essenciais de filmes no contexto de sessões.

### **Autenticação:**

- Como muitas das decisões tomadas nesse projeto teve influencia do tempo que passamos desenvolvendo o Kube e do que víamos o time praticar, uma delas é "não reinventar a roda", a parte de autenticação é um forte exemplo disso, acabei optando por utilizar o better-auth uma solução topzera para lidar com autenticação com tudo rodando localmente.

### **Cluster:**

- O cenário do problema inicial indica múltiplas aplicações rodando ao mesmo tempo, com isso decidi por criar um arquivo [docker-compose.cluster.yml](#) com a configuração necessária para rodar um cenário com múltiplas instancias da API, do banco de dados Redis, e do Postgres. Assim podendo realizar testes mais precisos!

- Para fazer a API rodar com múltiplas instancias utilizei o **NGINX** como load balancer para distribuir as requisições entre as aplicações.

- Para o banco de dados Redis utilizei o **Redis Sentinel**, provendo alta disponibilidade e "Automatic failover", caso o banco **master** comece a ter mal funcionamento uma das **replicas** assume o controle.

- Para o banco de dados Posgres...

- Para o sistema de mensageria utilizei o Kafka, acabei não entrando muito a fundo sobre kafka distribuído, logo utilizei somente uma instancia normal.

### **Cache:**

- Um dos principais pilares para um sistema escalável é a utilização de cache, para rotas mais primordiais como a **reserva de assentos** utilize o Redis para controlar disponibilidade e reservas temporárias, em outras rotas utilizei a própria api de cache do drizzle-orm.

### **Mensageria:**

- Para a mensageria entre components utilizei Kafka juntamente com o pacote próprio do NestJs, provendo assim uma serie de ferramentas úteis para a integridade das mensagens como estrategias de **retry** já existentes.

### **Internacionalização:**

- Utilizei a biblioteca [i18n](#) para lidar com múltiplos idiomas.

### **Exceções:**

- Criei uma [classe customizada](#) como base para exceções customizadas possuindo suporte para o **i18n** com argumentos e **statusCode**.

### **Transações:**

- Algo muito importante em operações mais complexas que envolvem múltiplas buscas/escritas e a chamada de outros "serviços" são as transações, pesquisei sobre e encontrei uma forma de utilizar um decorator `@Transactional()` com drizzle-orm no NestJs, basta utilizar a lib [`@nestjs-cls/transactional`](https://papooch.github.io/nestjs-cls/plugins/available-plugins/transactional).

- No [use-case de reservar assento](#) isso acaba sendo muito util para conter falhas, um forte exemplo seria a falha na publicação de mensagens, impedindo assim que seja possível realizar o pagamento da reserva. Com decorator `@Transactional()` ele identifica qualquer erro recebido dentro da função e automaticamente já realiza um Rollback de todas as queries realizadas nesse contexto.
