const Contato = require('../../models/contatosmodel')

exports.index = async (req, res) => {
    const contatos = await Contato.buscaContatos()
    res.render('index', { contatos })
}