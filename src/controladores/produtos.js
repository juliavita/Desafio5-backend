const jwt = require('jsonwebtoken');
const segredo = require('../segredo');
const conexao = require('../conexao');

const produtosUsuario = async (req, res) => {
    const { usuario } = req;

    try {
        const queryProdutosUsuario = 'select * from produtos where usuario_id=$1';
        const produtos = await conexao.query(queryProdutosUsuario,[usuario.id]);

        if(produtos.rowCount == 0) {
            return res.status(400).json('Nenhum produto encontrado.');
        }

        return res.status(200).json(produtos.rows);
        
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const buscarProdutoUsuario = async (req, res) => {
    const { usuario } = req;
    const { id: idProduto } = req.params;

    try {
        const queryProdutoUsuario = 'select * from produtos where id = $1 and usuario_id = $2';
        const produto = await conexao.query(queryProdutoUsuario,[idProduto, usuario.id]);

        if(produto.rowCount == 0) {
            return res.status(400).json('Não foi possível localizar o produto.');
        }

        return res.status(200).json(produto.rows);
        
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const cadastrarProduto = async (req, res) => {
    const { nome, quantidade, categoria, preco, descricao, imagem } = req.body;
    const { usuario } = req;

    if(!nome) {
        return res.status(400).json('O campo nome é obrigatório.')
    }

    if(!quantidade) {
        return res.status(400).json('O campo quantidade é obrigatório.')
    }

    if(quantidade < 0) {
        return res.status(400).json('O campo quantidade precisa ser maior que 0.')
    }

    if(!categoria) {
        return res.status(400).json('O campo categoria é obrigatório.')
    }

    if(!preco) {
        return res.status(400).json('O campo preco é obrigatório.')
    }

    try {
        const queryProduto = 'insert into produtos (usuario_id, nome, quantidade,categoria,preco,descricao,imagem) values ($1, $2, $3, $4, $5, $6, $7)';
        const produto = await conexao.query(queryProduto, [usuario.id, nome, quantidade, categoria, preco, descricao, imagem ]);

        if(produto.rowCount == 0) {
            return res.status(400).json('Não foi possível cadastrar o produto.');
        }
        return res.status(200).json('Produto cadastrado com sucesso.')
    } catch (error) {
        return res.status(400).json(error.message);
    }

}

const atualizarProduto = async (req, res) => {
    const { nome, quantidade, categoria, preco, descricao, imagem } = req.body;
    const { usuario } = req;
    const { id: idProduto } = req.params;


    if(!nome) {
        return res.status(400).json('O campo nome é obrigatório.')
    }

    if(!quantidade) {
        return res.status(400).json('O campo quantidade é obrigatório.')
    }

    if(quantidade < 0) {
        return res.status(400).json('O campo quantidade deve ser maior que 0.')
    }

    if(!categoria) {
        return res.status(400).json('O campo categoria é obrigatório.')
    }

    if(!preco) {
        return res.status(400).json('O campo preco é obrigatório.')
    }

    try {
        const queryProdutoExistente = 'select * from produtos where id = $1 and usuario_id = $2';
        const ProdutoExistente = await conexao.query(queryProdutoExistente, [idProduto, usuario.id]);

        if(ProdutoExistente.rowCount == 0) {
            return res.status(400).json('Não foi possível atualizar o produto.');
        }

        const queryAtualizarProduto = 'update produtos set nome=$1, quantidade=$2, categoria=$3, preco=$4, descricao=$5, imagem=$6 where id =$7 and usuario_id=$8';
        const produtoAtualizado = await conexao.query(queryAtualizarProduto, [nome, quantidade, categoria, preco, descricao, imagem, idProduto, usuario.id]);

        if(produtoAtualizado.rowCount == 0) {
            return res.status(400).json('Não foi possível atualizar o produto.');
        }

        return res.status(200).json('Produto atualizado com sucesso.');

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const excluirPostagem = async (req,res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {
        const queryProdutoExistente = 'select * from produtos where id = $1 and usuario_id = $2';
        const ProdutoExistente = await conexao.query(queryProdutoExistente, [id, usuario.id]);

        if(ProdutoExistente.rowCount == 0) {
            return res.status(400).json('Não foi possível excluir o produto.');
        }

        const { rowCount } = await conexao.query('delete from produtos where id=$1',[id]);

        if(rowCount == 0) {
            res.status(400).json('Não foi possível excluir o produto.');
        }

        return res.status(200).json('Produto excluído com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    cadastrarProduto,
    atualizarProduto,
    excluirPostagem,
    produtosUsuario,
    buscarProdutoUsuario
}