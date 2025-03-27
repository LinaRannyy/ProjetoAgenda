const mongoose = require('mongoose')
const validator = require('validator')

const dataModel = new mongoose.Schema({
    nome: { type: String, required: true },
    sobrenome: String,
    email: String,
    telefone: String,
    data: {type: Date, default: Date.now} 
})

const contatoModel = mongoose.model('contatos', dataModel)

class Contato {
    constructor(body) {
        this.body = body
        this.errors = []
        this.contato = null
    }

    async register() {
        this.valida()
        if(this.errors.length > 0) return

        this.contato = await contatoModel.create(this.body)
    }

    static async buscaPorId(id) {

        if(typeof id !== 'string') return null

        try {
            const user = await contatoModel.findById(id) 
            return user

        } catch(e) {
            console.log(e)
            return null
        }
    }

    valida() {
        this.cleanUp()

        if(!this.body.nome) this.errors.push('Nome é um campo obrigatório')
        if(!this.body.telefone && !this.body.email) this.errors.push('Preencha no mínimo o nome e o telefone ou email do contato')
        if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('Email inválido')

    }

    cleanUp() {
        for(let i in this.body) {
            if(typeof this.body[i] !== 'string') {
                this.body[i] = ' '
            }
        }

        this.body = {
            nome: this.body.nome,
            sobrenome: this.body.sobrenome,
            email: this.body.email,
            telefone: this.body.telefone
        }
    }

    async editpost(id) {
        if(typeof id !== 'string') return
        this.valida()
        if(this.errors.length > 0) return

        this.contato = await contatoModel.findByIdAndUpdate(id, this.body, { new: true })
    }

    static async buscaContatos() {

        try {
            const contatos = await contatoModel.find() 
              .sort( { criadoEm: -1, } ) 
            return contatos

        } catch(e) {
            console.log(e)
            return null
        }
    }

    static async excluirContato(id) {
        if(typeof id !== 'string') return

        const contato = await contatoModel.findOneAndDelete({ _id: id })
        return contato //????
    }
}

module.exports = Contato