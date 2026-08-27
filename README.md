# Furniro

Desafio Full Stack individual que recria a **Furniro**, uma loja de móveis e decoração. O projeto foi desenvolvido como parte do programa de bolsas da **Compass UOL**.

## Sumário

- [Preview](#preview)
- [Frontend](#frontend)
    - [Tecnologias](#tecnologias-frontend)
    - [Estrutura](#estrutura-frontend)
    - [Páginas](#páginas)
    - [Funcionalidades](#funcionalidades)
    - [Como funciona o Mosaico Animado](#como-funciona-o-mosaico-animado)
    - [Como funciona o Carrinho](#como-funciona-o-carrinho)
    - [Como funciona a Autenticação](#como-funciona-a-autenticação)
- [Backend](#backend)
    - [Tecnologias](#tecnologias-backend)
    - [Estrutura](#estrutura-backend)
    - [Rotas](#rotas)
    - [Middlewares](#middlewares)
    - [Modelos do banco](#modelos-do-banco)
    - [Seed do banco](#seed-do-banco)
- [Docker](#docker)
- [Como rodar](#como-rodar)
- [Links](#links)
- [Autor](#autor)

---

## Preview

A aplicação é composta pelas seguintes páginas:

- **Home** — landing page com Hero, Categories, Our Products, Inspiration, Mosaic e Footer
- **Shop** — listagem completa de produtos com filtros, paginação e categorias
- **Product** — página dinâmica de produto individual via slug
- **Cart** — página do carrinho com alteração de quantidade, remoção e resumo dos valores
- **Login** — autenticação do usuário com retorno para a rota protegida originalmente solicitada
- **Register** — cadastro de usuário com validações e armazenamento seguro da senha
- **Checkout** — página protegida com formulário, consulta de CEP, resumo do pedido e seleção de pagamento
- **Contact** — página protegida com informações de contato e formulário validado

---

## Frontend

### Tecnologias Frontend

| Tecnologia       | Versão |
| ---------------- | ------ |
| React            | 19     |
| TypeScript       | 6      |
| Tailwind CSS     | 4      |
| Vite             | 8      |
| React Router DOM | 7      |
| Zustand          | 5      |

| Lib externa         | Versão | Objetivo                                 |
| ------------------- | ------ | ---------------------------------------- |
| Axios               | 1      | Comunicação com o backend e com a ViaCEP |
| React Hook Form     | 7      | Gerenciamento dos formulários            |
| Zod                 | 4      | Criação dos schemas de validação         |
| @hookform/resolvers | 5      | Integração entre React Hook Form e Zod   |
| clsx                | 2      | Organização das classes do Tailwind      |
| react-hot-toast     | 2      | Toasts de validação e feedback           |
| react-icons         | 5      | Ícones da interface                      |
| lucide-react        | 1      | Ícones gerais da aplicação               |

### Estrutura Frontend

```text
frontend/src/
├── components/
│   ├── AuthField/             # Campo reutilizável de autenticação
│   ├── AuthLayout/            # Layout das páginas Login e Register
│   ├── BannerCard/            # Banner das páginas internas
│   ├── BillingDetails/        # Campos de cobrança do Checkout
│   ├── BillingField/          # Campo reutilizável do Checkout
│   ├── BreadCrumb/            # Navegação por breadcrumb
│   ├── CartDrawer/            # Drawer global do carrinho
│   ├── Categories/            # Seção de categorias
│   ├── ContactForm/           # Formulário da página Contact
│   ├── ContactInfo/           # Informações da página Contact
│   ├── FilterBar/             # Filtros da página Shop
│   ├── Footer/                # Rodapé com newsletter
│   ├── Header/                # Header fixo e responsivo
│   ├── Hero/                  # Banner principal
│   ├── Inspiration/           # Seção de inspiração
│   ├── Mosaic/                # Galeria animada
│   ├── OrderSummary/          # Resumo dos produtos no Checkout
│   ├── OurProducts/           # Grid de produtos
│   ├── PaymentMethods/        # Métodos de pagamento
│   ├── ProtectedRoute/        # Proteção das rotas autenticadas
│   ├── SingleProductCard/     # Informações do produto individual
│   ├── SingleProductImages/   # Galeria do produto individual
│   └── ...                    # Demais componentes auxiliares
├── context/
│   ├── authStore.ts           # Store Zustand da autenticação
│   ├── cartStore.ts           # Store Zustand do carrinho
│   ├── useAuth.ts             # Hook de acesso à autenticação
│   └── useCart.ts             # Hook de acesso ao carrinho
├── hooks/
│   └── useZipCodeLookup.ts    # Consulta e preenchimento do CEP
├── interface/                 # Tipos TypeScript compartilhados
├── pages/
│   ├── Home/page.tsx
│   ├── Shop/page.tsx
│   ├── Product/page.tsx
│   ├── Cart/page.tsx
│   ├── Login/page.tsx
│   ├── Register/page.tsx
│   ├── Checkout/
│   │   ├── page.tsx
│   │   └── checkout.schema.ts
│   ├── Contact/
│   │   ├── page.tsx
│   │   └── contact.schema.ts
│   └── NotFoundPage/
├── services/
│   ├── api.ts                 # Instância Axios e interceptor de autenticação
│   ├── auth.service.ts        # Cadastro, Login e consulta da sessão
│   ├── cart.service.ts        # Sincronização do carrinho autenticado
│   ├── product.service.ts     # Chamadas à API de produtos
│   └── viacep.service.ts      # Consulta de endereço pela ViaCEP
└── utils/                     # Funções utilitárias
```

### Páginas

#### Shop (`/shop/:category?`)

A página Shop consome a API do backend e exibe os produtos com filtros por categoria, ordenação e paginação.

A rota aceita uma categoria opcional diretamente no path:

```text
/shop/dining
/shop/living
/shop/bedroom
```

Quando uma categoria inválida é informada, a aplicação exibe um toast e redireciona para `/shop`.

Os parâmetros `page`, `limit` e `sort` são armazenados na query string. A barra de filtros atualiza a URL, que permanece como a fonte de verdade dos filtros selecionados.

A grade é responsiva e distribui os produtos em uma, duas, três ou quatro colunas de acordo com a largura disponível.

#### Product (`/product/:slug`)

Página dinâmica que busca o produto pelo slug por meio do endpoint `GET /products/:slug`.

Enquanto o produto é carregado, a página exibe um spinner. Se o slug não existir, o componente de produto não encontrado é renderizado.

A página apresenta:

- Galeria de imagens
- Nome, preço e avaliações
- Seleção de tamanho e cor
- Controle de quantidade
- Adição ao carrinho
- Descrição e informações adicionais
- Produtos relacionados

#### Cart (`/cart`)

A página Cart utiliza o estado global do Zustand e permite:

- Visualizar os produtos adicionados
- Aumentar ou diminuir a quantidade
- Remover itens
- Consultar subtotal e total
- Navegar para o Checkout

Os descontos dos produtos são considerados nos cálculos.

#### Login (`/login`)

A página Login autentica o usuário por e-mail e senha.

Quando uma rota protegida é acessada sem autenticação, a aplicação redireciona para o Login usando o parâmetro `referer`:

```text
/login?referer=/checkout
```

Após o Login, o usuário retorna para a rota originalmente solicitada. O valor de `referer` aceita somente caminhos internos, evitando redirecionamentos para URLs externas.

A autenticação é persistida no navegador e validada pelo endpoint `GET /auth/me`.

#### Register (`/register`)

A página Register permite criar uma conta com:

- E-mail válido
- Senha entre 8 e 72 bytes
- Confirmação da senha

Os dados são validados antes do envio. O backend normaliza o e-mail, impede cadastros duplicados e armazena somente o hash da senha.

#### Checkout (`/checkout`)

O Checkout é uma rota protegida e utiliza React Hook Form com Zod.

A página possui:

- Dados de cobrança
- Validações estilizadas
- Consulta de CEP com debounce
- Preenchimento automático do endereço pela ViaCEP
- Campos de endereço editáveis
- Resumo dos produtos do carrinho
- Cálculo de subtotal e total
- Seleção obrigatória do método de pagamento
- Bloqueio do pedido quando o carrinho está vazio
- Toast de confirmação após um envio válido

Os métodos disponíveis são:

- Direct Bank Transfer
- Cash On Delivery

O Checkout simula a realização do pedido. Não existe integração com gateway de pagamento ou persistência de pedidos.

#### Contact (`/contact`)

A página Contact também é protegida por autenticação.

Ela apresenta:

- Endereço
- Telefones
- Horários de atendimento
- Formulário de contato
- Layout responsivo baseado no Figma

Somente os campos `Your name` e `Email address` são obrigatórios e validados. `Subject` e `Message` permanecem opcionais.

Após um envio válido, a aplicação apresenta um toast e limpa o formulário. Não existe envio real de e-mail ou persistência da mensagem.

### Funcionalidades

- **Layout responsivo** — interface adaptada para mobile, tablet e desktop
- **Header fixo** — navegação permanece visível durante o scroll
- **Menu mobile** — menu acessível para telas menores
- **Autenticação JWT** — cadastro, Login, validação da sessão e Logout
- **Rotas protegidas** — Checkout e Contact exigem autenticação
- **Retorno pós-login** — retorno seguro para a rota originalmente solicitada
- **Cart Drawer** — visualização rápida do carrinho sem sair da página atual
- **Carrinho visitante** — persistido localmente com Zustand
- **Carrinho autenticado** — persistido no backend e isolado por usuário
- **Mesclagem do carrinho** — itens adicionados como visitante são mesclados após o Login
- **Sincronização do carrinho** — adições, remoções e quantidades são sincronizadas com a API
- **ViaCEP** — consulta e preenchimento automático do endereço
- **Formulários validados** — React Hook Form e Zod no Checkout e Contact
- **Toasts** — feedback de cadastro, Login, carrinho, formulários e newsletter
- **Show More** — redirecionamento da Home para a Shop
- **Badges** — indicação dinâmica de desconto ou produto novo
- **Hover nos cards** — ações visuais de compartilhar, comparar e favoritar
- **Filtros da Shop** — ordenação, paginação, limite e categoria
- **Newsletter** — validação própria com envio por clique ou Enter

### Como funciona o Mosaico Animado

A seção Mosaic exibe uma galeria que desliza horizontalmente de forma contínua.

A animação é definida no `index.css`:

```css
--animate-slide-loop: loop 40s linear infinite;

@keyframes loop {
    from {
        transform: translateX(0);
    }

    to {
        transform: translateX(-50%);
    }
}
```

O conteúdo é duplicado lado a lado. Quando a animação chega à metade do container, a segunda cópia ocupa a posição da primeira, criando um loop contínuo.

```tsx
<div className="animate-slide-loop w-728 flex gap-4">
    <MosaicContent />
    <MosaicContent />
</div>
```

### Como funciona o Carrinho

O carrinho é controlado pelo Zustand e utiliza um identificador composto por produto, cor e tamanho:

```ts
const createItemId = (item: AddCartItem) =>
    `${item.productId}:${item.color}:${item.size}`;
```

Isso permite que o mesmo produto com variações diferentes seja armazenado como itens separados.

#### Carrinho visitante

Antes do Login, os itens são persistidos no `localStorage` por meio da chave `furniro-cart`.

#### Carrinho autenticado

Depois do Login:

1. A sessão do usuário é validada.
2. O carrinho visitante é enviado para a API.
3. Os itens locais e remotos são mesclados.
4. O carrinho resultante atualiza o Zustand.
5. Adições, remoções e alterações de quantidade são sincronizadas com o backend.

Cada usuário possui um carrinho isolado no banco. A combinação de usuário, produto, cor e tamanho é única.

O Zustand continua sendo a fonte de verdade para a interface, garantindo atualização imediata da página Cart e da Cart Drawer.

### Como funciona a Autenticação

O cadastro armazena a senha usando bcrypt com 12 salt rounds.

No Login, o backend valida as credenciais e emite um JWT assinado com HS256. O token contém o ID e o e-mail do usuário e possui tempo de expiração configurável.

O frontend:

1. Persiste usuário e token com Zustand.
2. Adiciona automaticamente o Bearer token às requisições Axios.
3. Valida a sessão pelo endpoint `/auth/me`.
4. Remove a sessão quando recebe uma resposta `401`.
5. Protege Checkout e Contact com `ProtectedRoute`.
6. Remove a autenticação e o carrinho do usuário da interface no Logout.

---

## Backend

### Tecnologias Backend

| Tecnologia        | Versão |
| ----------------- | ------ |
| Node.js / Express | 5      |
| TypeScript        | 7      |
| Prisma ORM        | 5      |
| MongoDB           | 8      |
| Winston           | 3      |

| Lib             | Objetivo                                       |
| --------------- | ---------------------------------------------- |
| bcryptjs        | Hash e comparação de senhas                    |
| jsonwebtoken    | Emissão e validação dos tokens JWT             |
| Zod             | Validação dos dados de autenticação e carrinho |
| @faker-js/faker | Geração de dados para o seed                   |
| nodemon + tsx   | Hot reload em desenvolvimento                  |
| cors            | Liberação de CORS para o frontend              |

### Estrutura Backend

```text
backend/src/
├── config/
│   └── auth.config.ts             # Configuração do JWT
├── controllers/
│   ├── auth.controller.ts         # Requisições de autenticação
│   ├── cart.controller.ts         # Requisições do carrinho
│   └── product.controller.ts      # Requisições de produtos
├── middlewares/
│   ├── auth.middleware.ts         # Validação do Bearer token
│   ├── error.middleware.ts        # Tratamento global de erros
│   ├── http-exception.middleware.ts
│   └── validation.middleware.ts   # Validação de slug e ObjectId
├── repositories/
│   ├── cart.repository.ts
│   ├── prisma.cart.repository.ts
│   ├── prisma.product.repository.ts
│   ├── prisma.user.repository.ts
│   ├── product.repository.ts
│   └── user.repository.ts
├── routes/
│   ├── auth.routes.ts
│   ├── cart.routes.ts
│   └── products.routes.ts
├── schemas/
│   ├── auth.schema.ts
│   └── cart.schema.ts
├── services/
│   ├── auth.service.ts
│   ├── cart.service.ts
│   └── products.service.ts
├── db/seed/
│   └── seed.ts
├── utils/logger/
│   └── logger.ts
├── app.ts
└── server.ts
```

### Rotas

#### Produtos

| Método | Rota               | Autenticação | Descrição                              |
| ------ | ------------------ | ------------ | -------------------------------------- |
| `GET`  | `/products`        | Não          | Lista produtos com filtros e paginação |
| `GET`  | `/products/:slug`  | Não          | Busca um produto pelo slug             |
| `GET`  | `/products/id/:id` | Não          | Busca um produto pelo ObjectId         |

Parâmetros disponíveis em `GET /products`:

| Parâmetro  | Tipo   | Descrição                                                    |
| ---------- | ------ | ------------------------------------------------------------ |
| `category` | string | Filtra por categoria sem diferenciar maiúsculas e minúsculas |
| `page`     | number | Página atual, com valor padrão `1`                           |
| `limit`    | number | Quantidade por página, com valor padrão `16`                 |
| `sort`     | string | Aceita `price_asc` ou `price_desc`                           |

Exemplo de resposta:

```json
{
    "products": [],
    "total": 30,
    "page": 1,
    "limit": 16,
    "totalPages": 2
}
```

#### Autenticação

| Método | Rota             | Autenticação | Descrição                             |
| ------ | ---------------- | ------------ | ------------------------------------- |
| `POST` | `/auth/register` | Não          | Cria uma conta                        |
| `POST` | `/auth/login`    | Não          | Valida as credenciais e retorna o JWT |
| `GET`  | `/auth/me`       | Bearer JWT   | Retorna o usuário autenticado         |

#### Carrinho

Todas as rotas do carrinho exigem Bearer JWT.

| Método   | Rota                  | Descrição                                         |
| -------- | --------------------- | ------------------------------------------------- |
| `GET`    | `/cart`               | Retorna o carrinho do usuário                     |
| `POST`   | `/cart/merge`         | Mescla o carrinho visitante com o carrinho remoto |
| `POST`   | `/cart/items`         | Adiciona ou atualiza um item                      |
| `PUT`    | `/cart/items/:itemId` | Atualiza a quantidade de um item                  |
| `DELETE` | `/cart/items/:itemId` | Remove um item                                    |

### Middlewares

#### Validação de entrada

Slugs e ObjectIds são validados antes de consultar o banco:

```ts
const slugRegex = /^[a-z0-9-]+-\d+$/;
const objectIdRegex = /^[a-f0-9]{24}$/i;
```

Os schemas Zod também validam:

- Cadastro
- Login
- Senhas
- Confirmação de senha
- Payloads do carrinho
- Quantidades e variações dos itens

#### Autenticação

O middleware `authenticate` valida:

- Presença do header `Authorization`
- Formato `Bearer <token>`
- Assinatura do JWT
- Algoritmo HS256
- Expiração
- Payload com usuário válido

Tokens ausentes, inválidos ou expirados retornam `401`.

#### Tratamento de erros

O `errorMiddleware` captura as exceções das camadas da aplicação.

Erros conhecidos retornam o status correspondente. Erros inesperados retornam `500`.

As principais exceções são:

- `BadRequestException` — 400
- `UnauthorizedException` — 401
- `NotFoundException` — 404
- `ConflictException` — 409
- `InternalServerErrorException` — 500

### Modelos do banco

#### Product

Armazena os dados de catálogo:

- Nome e slug
- Descrições
- Preço e desconto
- Categoria
- Estoque
- Cores e tamanhos
- Imagens
- Avaliações
- SKU

#### User

Armazena os usuários cadastrados:

- E-mail único
- Hash da senha
- Datas de criação e atualização
- Relação com os itens do carrinho

#### ProductCart

Armazena os itens do carrinho autenticado:

- Usuário
- Slug do produto
- Quantidade
- Cor
- Tamanho

A combinação abaixo é única:

```text
userId + productSlug + currentColor + currentSize
```

Os itens são removidos em cascata quando o usuário é excluído.

### Seed do banco

O seed utiliza Faker.js para gerar 30 produtos.

Cada produto recebe um slug único:

```ts
slug: `${name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")}-${i}`;
```

As imagens são servidas pelo Express em `/images/products/product-N.svg`. O banco armazena apenas o caminho relativo, e o frontend monta a URL completa usando `VITE_API_URL`.

---

## Docker

O projeto utiliza quatro serviços:

| Serviço      | Imagem         | Porta |
| ------------ | -------------- | ----- |
| `mongodb`    | mongo:8        | 27017 |
| `mongo-init` | mongo:8        | —     |
| `backend`    | dockerfile.dev | 3000  |
| `frontend`   | dockerfile.dev | 5173  |

O MongoDB utiliza Replica Set `rs0`, necessário para o funcionamento do Prisma com MongoDB.

O serviço `mongo-init` inicializa o Replica Set depois que o MongoDB estiver saudável.

O backend utiliza as variáveis do arquivo `backend/.env` e inicia somente depois da configuração do Replica Set. O frontend inicia depois do backend.

Os volumes mapeiam o código local para os containers, permitindo hot reload durante o desenvolvimento.

---

## Como rodar

### Pré-requisitos

- Docker
- Docker Compose

### Configuração

Crie o arquivo `backend/.env` a partir do exemplo:

```bash
cp backend/.env.example backend/.env
```

Configure as variáveis:

```env
DATABASE_URL="mongodb://mongodb:27017/furniro?replicaSet=rs0&directConnection=true"
PORT=3000
JWT_SECRET="uma-chave-segura-com-pelo-menos-32-caracteres"
JWT_EXPIRES_IN="1d"
```

O `JWT_SECRET` precisa possuir pelo menos 32 caracteres.

### Com Docker

```bash
git clone git@github.com:lucastrdd/furniro-all.git
cd furniro-all

docker compose up --build
```

Em outro terminal, execute o seed:

```bash
docker compose exec backend npx tsx src/db/seed/seed.ts
```

A aplicação ficará disponível em:

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3000

### Sem Docker

É necessário possuir Node.js e uma instância do MongoDB configurada com Replica Set.

#### Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx tsx src/db/seed/seed.ts
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend utiliza `http://localhost:3000` como backend por padrão. Para alterar, defina `VITE_API_URL`.

---

## Links

- [Facebook Compass UOL](https://www.facebook.com/compass.uol/?locale=pt_BR)
- [Instagram Compass UOL](https://www.instagram.com/compass.uol/)
- [Twitter Compass UOL](https://x.com/compassuol)
- [LinkedIn Compass UOL](https://www.linkedin.com/company/compass-uol/posts/?feedView=all)

## Autor

- Lucas Trindade — [github.com/lucastrdd](https://github.com/lucastrdd)
