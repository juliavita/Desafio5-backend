const conexao = require('../conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const segredo = require('../segredo');

const login = async (req,res) => {
    const { email, senha } = req.body;

    if(!email) {
        return res.status(404).json('O campo email é obrigatório.');
    }

    if(!senha) {
        return res.status(404).json('O campo senha é obrigatório.');
    }

    try {
        const queryConsultaEmail = 'select * from usuarios where email = $1';
        const { rows, rowCount: quantidadeUsuarios } = await conexao.query(queryConsultaEmail, [email]);

        if (quantidadeUsuarios === 0) {
            return res.status(404).json('Usuário não encontrado.' );
        }

        const usuario = rows[0];

        const senhaVerificada = await bcrypt.compare(senha, usuario.senha);

        if (!senhaVerificada) {
            return res.status(400).json('Email e senha não conferem.');
        }

        const token = jwt.sign({ id: usuario.id }, segredo, { expiresIn: '8h' });
        return res.status(200).json({ token });
        

    } catch (error) {
        return res.status(400).json(error.mensagem);
    }
};

module.exports = {
    login
}