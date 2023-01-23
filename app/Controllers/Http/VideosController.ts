import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Video from 'App/Models/Video'
import VideoValidator from 'App/Validators/VideoValidator'

export default class VideosController {
  public async index({ request, response, session, view }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 10

    try {
      const videos = await Video.query()
        .preload('user')
        .orderBy('created_at', 'desc')
        .paginate(page, limit)

      if (videos.lastPage < page) {
        console.log('Página inválida')
        session.flash('message', {
          normalText: 'A página procurada',
          highlight: 'não pode ser encontrada',
        })
        return response.redirect().toRoute('videos.notFound')
      }

      videos.baseUrl('/videos')
      return view.render('videos/index', { videos: videos })
    } catch (err) {
      console.log('Página inválida')
      session.flash('message', {
        normalText: 'A página procurada',
        highlight: 'não pode ser encontrada',
      })
      return response.redirect().toRoute('videos.notFound')
    }
  }

  public async create({ auth, response, view }: HttpContextContract) {
    if (!auth.isLoggedIn) return response.redirect().back()
    return view.render('videos/create')
  }

  public async store({ auth, request, response, session }: HttpContextContract) {
    if (!auth.isLoggedIn) return response.redirect().back()

    // Passando os dados de volta para o front
    session.flashAll()

    const validatedData = await request.validate(VideoValidator)
    const { title, description, url } = validatedData
    const videoUrl = new URL(url)
    const videoId = videoUrl.searchParams.get('v')

    if (!videoId) {
      session.flash('alert', 'Vídeo inválido!')
      return response.redirect().back()
    }

    await Video.create({
      userId: auth.user?.id,
      title: title,
      description: description || '',
      url: url,
      urlId: videoId,
    })

    return response.redirect().toRoute('index')
  }

  // Mostrar vídeos do usuário
  public async userVideos({ auth, request, response, session, view }: HttpContextContract) {
    if (!auth.isLoggedIn) return response.redirect().back()

    const page = request.input('page', 1)
    const limit = 10

    try {
      const videos = await Video.query()
        .preload('user')
        .where('user_id', auth.user?.id)
        .orderBy('created_at', 'desc')
        .paginate(page, limit)

      if (videos.lastPage < page) {
        session.flash('message', {
          normalText: 'A página procurada',
          highlight: 'não pode ser encontrada',
        })
        return response.redirect().toRoute('videos.notFound')
      }

      videos.baseUrl('/user-videos')
      return view.render('videos/user_videos', { videos: videos })
    } catch (err) {
      console.log('Página inválida')
      session.flash('message', {
        normalText: 'A página procurada',
        highlight: 'não pode ser encontrada',
      })
      return response.redirect().toRoute('videos.notFound')
    }
  }

  // Mostrar um único vídeo
  public async show({ params, response, session, view }: HttpContextContract) {
    try {
      const video = await Video.query().preload('user').where('id', params.id).firstOrFail()
      return view.render('videos/show', { video: video })
    } catch (err) {
      console.log('Usuário tentou pesquisar vídeo inexistente')
      session.flash('message', {
        normalText: 'O vídeo procurado',
        highlight: 'não pode ser encontrado',
      })
      return response.redirect().toRoute('videos.notFound')
    }
  }

  public async notFound({ response, session, view }: HttpContextContract) {
    /* Verificando se existe uma mensagem para poder acessar a página e retransmitindo para o site */
    if (session.flashMessages.has('message')) {
      const message = session.flashMessages.get('message')
      session.flash('message', message)
      return view.render('videos/not_found')
    }
    return response.redirect().back()
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
