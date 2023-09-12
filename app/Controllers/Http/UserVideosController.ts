import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import VideoValidator from 'App/Validators/VideoValidator'
import Video from 'App/Models/Video'

export default class UserVideosController {
  public async index({ auth, request, response, session, view }: HttpContextContract) {
    if (!auth.isLoggedIn) return response.redirect().toRoute('auth.create')

    const page = request.input('page', 1)
    const limit = 12

    try {
      if (auth.user !== undefined) {
        const videos = await Video.query()
          .preload('user')
          .where('user_id', auth.user.id)
          .orderBy('created_at', 'desc')
          .paginate(page, limit)

        if (videos.lastPage < page) {
          session.flash('message', {
            normalText: 'A página procurada',
            highlight: 'não pode ser encontrada',
          })
          return response.redirect().toRoute('videos.notFound')
        }

        const paginationLimit = 9
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

        videos.baseUrl('/user-videos')
        return view.render('user_videos/index', {
          videos: videos,
          sideLimit: sideLimit,
          pagination: pagination,
        })
      } else {
        return response.redirect().back()
      }
    } catch (error) {
      console.log('Página inválida')
      session.flash('message', {
        normalText: 'A página procurada',
        highlight: 'não pode ser encontrada',
      })
      return response.redirect().toRoute('videos.notFound')
    }
  }

  public async create({ auth, response, view }: HttpContextContract) {
    if (!auth.isLoggedIn) return response.redirect().toRoute('auth.create')
    return view.render('user_videos/create')
  }

  public async store({ auth, request, response, session }: HttpContextContract) {
    if (!auth.isLoggedIn) return response.redirect().back()

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
      description: description !== null ? description.trim() : '',
      url: url,
      urlId: videoId,
    })

    return response.redirect().toRoute('videos.index')
  }

  public async destroy({ auth, params, request, response, view }: HttpContextContract) {
    if (auth.isLoggedIn && auth.user !== undefined) {
      let pageUrl = request.input('pageUrl')

      if (pageUrl === 'null') {
        pageUrl = '/user-videos'
      }

      try {
        const video = await Video.findOrFail(params.id)
        if (video.userId === auth.user.id) {
          video.delete()
          return response.redirect().toPath(pageUrl)
        }
      } catch (error) {
        console.log(error)
        return view.render('errors/unauthorized')
      }
    }
    return response.redirect().back()
  }
}
