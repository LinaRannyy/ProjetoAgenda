const Login = require('./modules/login');

const login = new Login('.form-login')
const cadastro = new Login('.form-cadastro')

login.init()
cadastro.init()
