## Table of Contents

- [Prerequisites](#prerequisites)
- [Up and Run](#up-and-run)

### Prerequisites

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Up and Run

#### For development run

```sh
git clone https://github.com/bipsec/bangla-dictionary-web.git
cd bangla-browse
docker-compose -f docker-compose.dev.yml up --build
```

You'll be able to see the project is being run at [http://localhost:3002/](http://localhost:3002/)
