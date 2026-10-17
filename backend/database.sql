CREATE DATABASE conteex_db

CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    cpf VARCHAR(14) UNIQUE,
    cep VARCHAR(9),
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    categoria VARCHAR(100),
    preco NUMERIC(10, 2) NOT NULL CHECK (preco >= 0),
    estoque INTEGER NOT NULL DEFAULT 0 CHECK (estoque >= 0),
    imagem_url TEXT,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER NOT NULL
        REFERENCES clientes(id),
    data_pedido TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) NOT NULL DEFAULT 'pendente',
    valor_total NUMERIC(10, 2) NOT NULL DEFAULT 0
        CHECK (valor_total >= 0)
);

CREATE TABLE pedido_itens (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER NOT NULL
        REFERENCES pedidos(id),
    produto_id INTEGER NOT NULL
        REFERENCES produtos(id),
    quantidade INTEGER NOT NULL
        CHECK (quantidade > 0),
    preco_unitario NUMERIC(10, 2) NOT NULL
        CHECK (preco_unitario >= 0)
);

SELECT * FROM pedidos;

SELECT * FROM pedido_itens;