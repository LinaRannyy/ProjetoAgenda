const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')

const loginSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: {type: String, required: true}
})

const LoginModel = mongoose.model( 'Login', loginSchema) 
class Login {
    constructor(body){
        this.body = body
        this.errors = []
        this.user = null
    }

    async login() {
        this.valida()
        if(this.errors.length > 0) return

        this.user = await LoginModel.findOne({ email: this.body.email }) 
        
        
        if(!this.user) {
            this.errors.push('Usuário ou senha inválidos')
            return
        }

        if(!bcryptjs.compareSync(this.body.password, this.user.password)) {
            this.errors.push('Senha incorreta')
            this.user = null
            return
        }
        
    }

    async register() { 
        this.valida()
        if(this.errors.length > 0) return

        await this.userExists() 

        if(this.errors.length > 0) return


        const salt = bcryptjs.genSaltSync() 
        this.body.password = bcryptjs.hashSync(this.body.password, salt) 

        
        this.user = await LoginModel.create(this.body) 
    }

    async userExists() { 
        const user = await LoginModel.findOne({ email: this.body.email }) 

        if(user) {
            this.errors.push('Esse usuário já existe, faça login')
        }
    }

    valida() {
        this.cleanUp() 

        if(!validator.isEmail(this.body.email)) this.errors.push('Email inválido')

        if(this.body.password.length < 3 || this.body.password.length > 50) this.errors.push('A senha precisa ter entre 3 e 50 caracteres')
    }

    cleanUp() {
        for(const key in this.body) { 
            if(typeof this.body[key] !== 'string') {
                this.body[key] = ''
            } 
        }

        this.body = {
            email: this.body.email,
            password: this.body.password
        } 
    }

}

module.exports = Login
