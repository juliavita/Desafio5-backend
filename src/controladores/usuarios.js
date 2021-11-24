const conexao = require('../conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const cadastrarUsuario = async (req, res) => {
    const { nome, nome_loja, email, senha } = req.body;
    if(!nome) {
        return res.status(400).json('O campo "nome" é obrigatório.');
    }

    if(!nome_loja) {
        return res.status(400).json('O campo nome_loja é obrigatório.');
    }

    if(!email) {
        return res.status(400).json('O campo "email" é obrigatório.');
    }

    if(!senha) {
        return res.status(400).json('O campo "senha" é obrigatório.');
    }

    try {
        const queryConsultaEmail = 'select * from usuarios where email = $1';
        const {rowCount : quantidadeUsuarios} = await conexao.query(queryConsultaEmail, [email]);

        if (quantidadeUsuarios > 0) {
            return res.status(400).json('O email informado já está sendo utilizado.');
        }

        const senhaCriptografada = await bcrypt.hash(senha,10);
        const query = 'insert into usuarios (nome, nome_loja, email, senha) values ($1, $2, $3, $4)';
        const usuarioCadastrado = await conexao.query(query, [nome, nome_loja, email, senhaCriptografada]);

        if(usuarioCadastrado.rowCount == 0) {
            return res.status(400).json('Não foi possível cadastrar o usuário.');
        } else {
            return res.status(200).json('Usuário cadastrado com sucesso.');
        }

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const mostrarUsuario = async (req, res) => {
    const { usuario } = req;

    try {
        const queryMostrarUsuario = 'select * from usuarios where id=$1';
        const perfilUsuario = await conexao.query(queryMostrarUsuario,[usuario.id]);

        return res.status(200).json(perfilUsuario.rows);
        
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const atualizarUsuario = async (req, res) => {
    const { nome, email, senha, nome_loja } = req.body;
    const { usuario } = req;

    if(!nome) {
        return res.status(400).json('O campo nome é obrigatório.')
    }

    if(!email) {
        return res.status(400).json('O campo email é obrigatório.')
    }

    if(!senha) {
        return res.status(400).json('O campo senha é obrigatório.')
    }

    if(!nome_loja) {
        return res.status(400).json('O campo nome_loja é obrigatório.')
    }

    try {
        const queryConsultaEmail = 'select * from usuarios where email = $1';
        const {rowCount : quantidadeUsuarios} = await conexao.query(queryConsultaEmail, [email]);

        if (quantidadeUsuarios > 0) {
            return res.status(400).json('O email informado já está sendo utilizado.');
        }

        const senhaCriptografada = await bcrypt.hash(senha,10);
        const queryAtualizaUsuario = 'update usuarios set nome=$1, email=$2, senha=$3, nome_loja=$4 where id=$5';
        const usuarioAtualizado = await conexao.query(queryAtualizaUsuario, [nome, email, senha, nome_loja, usuario.id]);

        if(usuarioAtualizado.rowCount == 0) {
            return res.status(400).json('Não foi possível atualizar o usuário.');
        } 

        return res.status(200).json('Usuário atualizado com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    cadastrarUsuario,
    mostrarUsuario,
    atualizarUsuario
}