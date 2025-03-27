const express = require('express')
const route = express.Router()

const homecontroller = require('./src/views/controllers/homecontroller')
const logincontroller = require('./src/views/controllers/logincontroller')
const contatocontroller = require('./src/views/controllers/contatocontroller')


//rotas da home
route.get('/', homecontroller.index)

//Rotas de login
route.get('/login/index', logincontroller.index)
route.post('/login/register', logincontroller.register)
route.post('/login/login', logincontroller.login)
route.get('/login/logout', logincontroller.logout)

//rotas de contato

route.get('/contatos/index', contatocontroller.index)
route.post('/contatos/register', contatocontroller.register)
route.get('/contato/index/:id', contatocontroller.edit)
route.post('/contatos/edit/:id', contatocontroller.editpost)
route.get('/contato/delete/:id', contatocontroller.delete )
 
module.exports = route