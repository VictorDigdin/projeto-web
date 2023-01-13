import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Video from 'App/Models/Video'

export default class VideosController {
  public async index({ view }: HttpContextContract) {
    const videos = await Video.query().preload('user') // Retornar dados do usuário juntamente com os dados do vídeo
    return view.render('videos/index', { videos: videos })
  }

  public async create({ view, response, auth }: HttpContextContract) {
    if (!auth.isLoggedIn) return response.redirect().back()
    return view.render('videos/create')
  }

  public async store({ auth, request, response }: HttpContextContract) {
    if (!auth.isLoggedIn) return response.redirect().back()

    const { title, description, url, thumb } = request.all()

    await Video.create({
      userId: auth.user?.id,
      title: title,
      description: description,
      url: url,
      thumb: thumb,
    })

    return response.redirect().toRoute('index')
  }

  // Mostrar vídeos do usuário
  public async userVideos({ auth, view }: HttpContextContract) {
    try {
      const videos = await Video.query().where('user_id', auth.user?.id)
      return view.render('videos/user_videos', { videos: videos })
    } catch (err) {
      console.log(err)
    }
  }

  // Mostrar um único vídeo
  public async show({ params, view }: HttpContextContract) {
    try {
      const video = await Video.findOrFail(params.id)
      return view.render('videos/show', { video: video })
    } catch (err) {
      console.log(err)
    }
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
