const { render } = require('ejs')
const Contato = require('../../models/contatosmodel')
const e = require('connect-flash')

exports.index = function(req, res) {
    res.render('contatoindex', {
        contato: {}
    })
}

exports.register = async function(req, res) {

    try {

        const contato = new Contato(req.body)
        await contato.register()

        if(contato.errors.length > 0) {
            req.flash('errors', contato.errors)
            req.session.save(() => res.redirect('back'))
            return
        } 

        req.flash('success', 'Contato salvo com sucesso')
        req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`))

    } catch(e) {
        console.log(e)
        res.render('404')
    }

    // res.redirect('/')
}

exports.edit = async function(req, res) {
    if(!req.params.id) return res.render('404')
    const contato = await Contato.buscaPorId(req.params.id)

    if(!contato) return res.render('404')

    res.render('contatoindex', {contato})
}

exports.editpost = async function(req, res) {

    try{
        if(!req.params.id) return res.render('404') //caso não seja enviado parâmetros
        const contato = new Contato(req.body)
        await contato.editpost(req.params.id)

        if(contato.errors.length > 0) {
            req.flash('errors', contato.errors)
            req.session.save(() => res.redirect('back'))
            return
        } 

        req.flash('success', 'Contato editado com sucesso')
        req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`))
        
    } catch(e) {
        console.log(e)
    }
    

}

exports.delete = async function(req, res) {
    
    if(!req.params.id) return res.render('404')

    const contato = await Contato.excluirContato(req.params.id)
    if(!contato) return res.render('404')

    req.flash('success', 'Contato apagado com sucesso')
    req.session.save(() => res.redirect(`back`))
    return //????
}