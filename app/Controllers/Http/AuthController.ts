import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'

export default class AuthController {
  public async create({ auth, view, response }: HttpContextContract) {
    if (auth.isLoggedIn) return response.redirect().back()

    return view.render('auth/create')
  }

  public async store({ auth, request, response, session }: HttpContextContract) {
    if (auth.isLoggedIn) return response.redirect().back()

    const email = request.input('email')
    const password = request.input('password')
    let rememberMe = request.input('remember')
    rememberMe = rememberMe === undefined ? false : true

    try {
      const user = await User.query().where('email', email).firstOrFail()

      if (!(await Hash.verify(user.password, password))) {
        session.flash('errors.invalidLogin', 'Não foi possível logar, verifique seus dados')
        session.flash('email', email)
        return response.redirect().toRoute('auth.create')
      }

      await auth.use('web').login(user)
      return response.redirect().toRoute('videos.index')
    } catch (error) {
      session.flash('errors.invalidLogin', 'Não foi possível logar, verifique seus dados')
      session.flash('username', email)
      return response.redirect().back()
    }
  }

  public async destroy({ auth, response }: HttpContextContract) {
    await auth.use('web').logout()
    return response.redirect().toRoute('videos.index')
  }
}
