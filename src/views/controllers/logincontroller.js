const e = require('connect-flash') //NÃO SEI
const Login = require('../../models/loginmodels')

exports.index = (req, res) => {
    if(req.session.user) return res.render('login-logado')
    console.log(req.session.user)
    //utilizado para renderizar as páginas correspondentes a cada rota
    res.render('login')
}

exports.register = async function(req, res) {
    try {
        const login = new Login(req.body)
        await login.register() //utilizando o método importado do loginmodels
        //já que o método da classe é async é necessário esperar 

        if(login.errors.length > 0) {
            req.flash('errors', login.errors)
            req.session.save(function() {
                return res.redirect('back')
            })
            return
        }
    
        req.flash('success', 'Seu usuário foi salvo com sucesso')
        req.session.save(function() {
            return res.redirect('back')
        })
    
    } catch(e) {
        res.render('404')
        console.log(e)
    }
}

exports.login = async function(req, res) {
    try {
        const login = new Login(req.body)
        await login.login() //utilizando o método importado do loginmodels
        //já que o método da classe é async é necessário esperar 

        if(login.errors.length > 0) {
            req.flash('errors', login.errors)
            req.session.save(function() {
                return res.redirect('back')
            })
            return
        }
    
        req.flash('success', 'Você entrou no sistema')
        req.session.user = login.user
        req.session.save(function() {
            return res.redirect('/')
        })
    
    } catch(e) {
        res.render('404')
        console.log(e)
    }
}

exports.logout = function(req, res) {
    req.session.destroy() //!!!!!!!!! entender depois
    res.redirect('/') //redireciona para a home do site
}