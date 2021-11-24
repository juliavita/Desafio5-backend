const express = require('express');
const usuarios = require('./controladores/usuarios');
const login = require('./controladores/login');
const produtos = require('./controladores/produtos');
const verificaLogin = require('./filtros/verificaLogin');
const rotas = express();

// Cadastro de usuário
rotas.post("/usuarios", usuarios.cadastrarUsuario);


// Login
rotas.post("/login", login.login);

rotas.use(verificaLogin.verificaLogin);

// Mostrar perfil do usuário
rotas.get("/usuario", usuarios.mostrarUsuario);

// Atualizar perfil do usuário
rotas.put("/usuario", usuarios.atualizarUsuario);

// Produtos
rotas.post("/produtos", produtos.cadastrarProduto);
rotas.put("/produtos/:id", produtos.atualizarProduto);
rotas.delete("/produtos/:id", produtos.excluirPostagem);
rotas.get("/produtos", produtos.produtosUsuario);
rotas.get("/produtos/:id", produtos.buscarProdutoUsuario);

module.exports = rotas;
