# Teste para Desenvolvedor(a) Back-End Node.js/NestJS - Sistemas Distribuídos

## Conteúdo

- Estrutura
- Decisões

## Estrutura

A estrutura do projeto foi feita pensando em responsabilidades separadas, sendo assim cada módulo possui sua própria lógica, sendo alguns deles divididos em submódulos Em módulos diretamente acoplados (movies, rooms -> sessions), a comunicação acontece por meio da importação de serviços, já em módulos nos quais o desacoplamento seria "essencial" pensando em uma escala futura (sessions <-> payments), a comunicação é realizada através de mensageria assíncrona (kafka).

```
└── 📁src
    └── 📁modules
        └── 📁auth
            └── ([modules/auth](#modules/auth))
        └── 📁movies
            └── (#movies)
        └── 📁payments
            └── (#payments)
        └── 📁rooms
            └── (#rooms)
        └── 📁sessions
            └── 📁core
                └── (#sessions-core)
            └── 📁seats
                └── (#sessions-seats)
    └── 📁shared
        └── (...)
```

### modules/auth

...
