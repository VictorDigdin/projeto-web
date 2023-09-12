import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Video from 'App/Models/Video'

export default class VideosController {
  public async index({ request, response, session, view }: HttpContextContract) {
    let page = request.input('page', 1)
    const limit = 20
    page = !isNaN(page) ? page : -1

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

      const paginationLimit = 5
      const sideLimit = (paginationLimit - 1) / 2
      const pagination = {
        start:
          videos.currentPage - sideLimit > videos.firstPage
            ? videos.currentPage - sideLimit
            : Math.max(videos.currentPage - sideLimit, videos.firstPage),
        end:
          videos.lastPage < paginationLimit
            ? videos.lastPage
            : videos.currentPage < sideLimit + 1
            ? paginationLimit
            : Math.min(videos.currentPage + sideLimit, videos.lastPage),
      }

      videos.baseUrl('/')
      return view.render('videos/index', { videos, sideLimit, pagination })
    } catch (error) {
      console.log(error)
      console.log('Página inválida')
      session.flash('message', {
        normalText: 'A página procurada',
        highlight: 'não pode ser encontrada',
      })
      return response.redirect().toRoute('videos.notFound')
    }
  }

  public async show({ auth, params, response, session, view }: HttpContextContract) {
    try {
      const video = await Video.query().preload('user').where('id', params.id).firstOrFail()

      if (auth.isLoggedIn && auth.user !== undefined) {
        const user = await User.query()
          .preload('interactedVideos', (interactedVideosQuery) =>
            interactedVideosQuery.where('video_id', params.id)
          )
          .where('id', auth.user.id)
          .firstOrFail()

        return view.render('videos/show', {
          video: video,
          user: user,
        })
      } else {
        return view.render('videos/show', { video: video })
      }
    } catch (error) {
      console.log(error)
      session.flash('message', {
        normalText: 'O vídeo procurado',
        highlight: 'não pode ser encontrado',
      })
      return response.redirect().toRoute('videos.notFound')
    }
  }

  public async search({ request, response, session, view }: HttpContextContract) {
    let page = request.input('page', 1)
    let queryString = request.qs() // URL: /?username=digdin * qs: { username: 'digdin' }
    let search = request.input('search').trim()
    const limit = 12
    page = !isNaN(page) ? page : -1

    try {
      const videos = await Video.query()
        .preload('user')
        .whereILike('title', '%' + search + '%')
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

      const paginationLimit = 5
      const sideLimit = (paginationLimit - 1) / 2
      const pagination = {
        start:
          videos.currentPage - sideLimit > videos.firstPage
            ? videos.currentPage - sideLimit
            : Math.max(videos.currentPage - sideLimit, videos.firstPage),
        end:
          videos.lastPage < paginationLimit
            ? videos.lastPage
            : videos.currentPage < sideLimit + 1
            ? paginationLimit
            : Math.min(videos.currentPage + sideLimit, videos.lastPage),
      }
      session.flashAll()
      videos.baseUrl(request.url()).queryString(queryString)
      return view.render('videos/search', { videos, sideLimit, pagination, search })
    } catch (error) {
      console.log(error)
      console.log('Página inválida')
      session.flash('message', {
        normalText: 'Não foram encontrados resultados para a ',
        highlight: 'pesquisa',
      })
      return response.redirect().toRoute('videos.notFound')
    }
  }

  public async notFound({ response, session, view }: HttpContextContract) {
    if (session.flashMessages.has('message')) {
      const message = session.flashMessages.get('message')
      session.flash('message', message)
      return view.render('videos/not_found')
    }
    return response.redirect().back()
  }
}
