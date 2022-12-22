import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import LoginUser from 'App/Models/User'
import StoreUserValidator from 'App/Validators/StoreUserValidator'
import UpdateUserValidator from 'App/Validators/UpdateUserValidator'

export default class UserController {
  public async create({ view, response, auth }: HttpContextContract) {
    // Não permitir entrar se já estiver logado
    if (auth.isLoggedIn) return response.redirect().back()

    return view.render('users/create')
  }

  public async store({ auth, request, response, session }: HttpContextContract) {
    if (auth.isLoggedIn) return response.redirect().back()

    // Pegando todos os dados passados utilizando o validador
    session.flashAll()
    const validatedData = await request.validate(StoreUserValidator)

    // Se os dados forem válidos o usuário será criado e inserido no BD
    const user = await LoginUser.create({
      username: validatedData.username,
      email: validatedData.email,
      first_name: validatedData.firstName,
      last_name: validatedData.lastName,
      password: validatedData.password,
    })
    //Futuro alerta
    // session.flash({
    //   message: 'Cadastro efetuado com sucesso!',
    // })

    return response.redirect().toRoute('auth.create')
  }

  public async show({}: HttpContextContract) {}

  public async edit({ view, response, auth }: HttpContextContract) {
    // Não permitir entrar se NÃO estiver logado
    if (!auth.isLoggedIn) return response.redirect().back()
    return view.render('users/edit')
  }

  public async update({ request, response, auth, session }: HttpContextContract) {
    if (!auth.isLoggedIn) return response.redirect().back()

    const validatedData = await request.validate(UpdateUserValidator)
    const { username, email, firstName, lastName, password } = validatedData

    try {
      const user = await User.findByOrFail('email', auth.user?.email)
      user.username = username ?? user.username
      user.email = email ?? user.email
      user.first_name = firstName ?? user.first_name
      user.last_name = lastName ?? user.last_name
      user.password = password ?? user.password
      await user.save()
      // Futuro alerta
      // session.flash('notification', 'Informação atualizada!')
      return response.redirect().toRoute('index')
    } catch (error) {
      // Futuro alerta
      // session.flash('errors', 'Ocorreu um erro ao atualizar as informações.')
      return response.redirect().back()
    }
  }

  public async destroy({}: HttpContextContract) {}
}
