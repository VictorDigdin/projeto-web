import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import LoginUser from 'App/Models/User'
import StoreUserValidator from 'App/Validators/StoreUserValidator'
import UpdateUserValidator from 'App/Validators/UpdateUserValidator'

export default class UserController {
  public async create({ view, response, auth }: HttpContextContract) {
    if (auth.isLoggedIn) return response.redirect().back()

    return view.render('users/create')
  }

  public async store({ auth, request, response, session }: HttpContextContract) {
    if (auth.isLoggedIn) return response.redirect().back()

    session.flashAll()
    const validatedData = await request.validate(StoreUserValidator)

    await LoginUser.create({
      username: validatedData.username,
      email: validatedData.email,
      first_name: validatedData.firstName,
      last_name: validatedData.lastName,
      password: validatedData.password,
    })

    session.flash('alert', 'Cadastro efetuado com sucesso!')

    return response.redirect().toRoute('auth.create')
  }

  public async edit({ view, response, auth }: HttpContextContract) {
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

      session.flash('alert', 'Informação atualizada!')
      return response.redirect().toRoute('users.edit')
    } catch (error) {
      return response.redirect().back()
    }
  }

  public async destroy({}: HttpContextContract) {}
}
