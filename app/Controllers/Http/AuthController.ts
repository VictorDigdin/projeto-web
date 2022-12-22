import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'

export default class AuthController {
  public async create({ auth, view, response }: HttpContextContract) {
    // Não permitir entrar se já estiver logado
    if (auth.isLoggedIn) return response.redirect().back()

    return view.render('auth/create')
  }

  public async store({ auth, request, response, session }: HttpContextContract) {
    if (auth.isLoggedIn) return response.redirect().back()

    // Lembrando que o Adonis pega pelo "name" que foi dado pela tag
    const email = request.input('email')
    const password = request.input('password')
    let rememberMe = request.input('remember')
    rememberMe = rememberMe === undefined ? false : true

    console.log(rememberMe)

    try {
      const user = await User.query().where('email', email).firstOrFail()

      // Achou o usuário, verificando senhas
      if (!(await Hash.verify(user.password, password))) {
        session.flash('errors.invalidLogin', 'Não foi possível logar, verifique seus dados')
        session.flash('email', email)
        return response.redirect().back()
      }

      // Criando a sessão
      await auth.use('web').login(user)
      return response.redirect().toRoute('index')
    } catch (error) {
      // Se entrou aqui não achou o usuário
      session.flash('errors.invalidLogin', 'Não foi possível logar, verifique seus dados')
      // Passando o usuário para poder manter ao errar login
      session.flash('username', email)
      return response.redirect().back()
    }
  }

  public async destroy({ auth, response }: HttpContextContract) {
    await auth.use('web').logout()
    return response.redirect('/')
  }
}
