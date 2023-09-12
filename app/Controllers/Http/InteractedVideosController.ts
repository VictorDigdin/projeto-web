import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import InteractedVideo from 'App/Models/InteractedVideo'

export default class InteractedVideosController {
  public async watchedVideos({ auth, request, response, session, view }: HttpContextContract) {
    let page = request.input('page', 1)
    const limit = 5
    page = !isNaN(page) ? page : -1

    if (auth.isLoggedIn && auth.user !== undefined) {
      try {
        const interactedVideos = await InteractedVideo.query()
          .where('user_id', auth.user.id)
          .andWhere('watched', true)
          .preload('video', (videoQuery) => videoQuery.preload('user'))
          .paginate(page, limit)

        if (interactedVideos.lastPage < page) {
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
            interactedVideos.currentPage - sideLimit > interactedVideos.firstPage
              ? interactedVideos.currentPage - sideLimit
              : Math.max(interactedVideos.currentPage - sideLimit, interactedVideos.firstPage),
          end:
            interactedVideos.lastPage < paginationLimit
              ? interactedVideos.lastPage
              : interactedVideos.currentPage < sideLimit + 1
              ? paginationLimit
              : Math.min(interactedVideos.currentPage + sideLimit, interactedVideos.lastPage),
        }

        interactedVideos.baseUrl('/watched-videos')
        return view.render('interacted_videos/watched_videos', {
          interactedVideos,
          sideLimit,
          pagination,
        })
      } catch (error) {
        console.log(error)
        session.flash('message', {
          normalText: 'A página procurada',
          highlight: 'não pode ser encontrada',
        })
        return response.redirect().toRoute('videos.notFound')
      }
    } else {
      return response.redirect().toRoute('auth.create')
    }
  }

  public async likedVideos({ auth, request, response, session, view }: HttpContextContract) {
    let page = request.input('page', 1)
    const limit = 12
    page = !isNaN(page) ? page : -1

    if (auth.isLoggedIn && auth.user !== undefined) {
      try {
        const interactedVideos = await InteractedVideo.query()
          .where('user_id', auth.user.id)
          .andWhere('liked', true)
          .preload('video', (videoQuery) => videoQuery.preload('user'))
          .orderBy('created_at', 'desc')
          .paginate(page, limit)

        if (interactedVideos.lastPage < page) {
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
            interactedVideos.currentPage - sideLimit > interactedVideos.firstPage
              ? interactedVideos.currentPage - sideLimit
              : Math.max(interactedVideos.currentPage - sideLimit, interactedVideos.firstPage),
          end:
            interactedVideos.lastPage < paginationLimit
              ? interactedVideos.lastPage
              : interactedVideos.currentPage < sideLimit + 1
              ? paginationLimit
              : Math.min(interactedVideos.currentPage + sideLimit, interactedVideos.lastPage),
        }

        interactedVideos.baseUrl('/liked-videos')
        return view.render('interacted_videos/liked_videos', {
          interactedVideos,
          sideLimit,
          pagination,
        })
      } catch (error) {
        console.log(error)
        session.flash('message', {
          normalText: 'A página procurada',
          highlight: 'não pode ser encontrada',
        })
        return response.redirect().toRoute('videos.notFound')
      }
    } else {
      return response.redirect().toRoute('auth.create')
    }
  }

  public async markAsWatched({ auth, params, response }: HttpContextContract) {
    if (auth.isLoggedIn && auth.user !== undefined) {
      try {
        const interactedVideo = await InteractedVideo.query()
          .where('user_id', auth.user.id)
          .andWhere('video_id', params.id)
          .firstOrFail()

        interactedVideo.watched = true
        await interactedVideo.save()
      } catch (error) {
        const user = await User.findOrFail(auth.user.id)
        await user.related('interactedVideos').create({
          videoId: params.id,
          watched: true,
        })
      }
    }
    return response.redirect().back()
  }

  public async unmarkAsWatched({ auth, params, request, response }: HttpContextContract) {
    if (auth.isLoggedIn && auth.user !== undefined) {
      let pageUrl = request.input('pageUrl')

      if (pageUrl === 'null') {
        pageUrl = '/watched-videos'
      }

      try {
        const interactedVideo = await InteractedVideo.query()
          .where('user_id', auth.user.id)
          .andWhere('video_id', params.id)
          .firstOrFail()

        interactedVideo.watched = false
        await interactedVideo.save()
        return response.redirect().toPath(pageUrl)
      } catch (error) {
        console.log(error)
      }
    }
    return response.redirect().back()
  }

  public async unmarkAsLiked({ auth, params, request, response }: HttpContextContract) {
    if (auth.isLoggedIn && auth.user !== undefined) {
      let pageUrl = request.input('pageUrl')

      if (pageUrl === 'null') {
        pageUrl = '/liked-videos'
      }

      try {
        const interactedVideo = await InteractedVideo.query()
          .where('user_id', auth.user.id)
          .andWhere('video_id', params.id)
          .firstOrFail()

        interactedVideo.liked = false
        await interactedVideo.save()
        return response.redirect().toPath(pageUrl)
      } catch (error) {
        console.log(error)
      }
    }
    return response.redirect().back()
  }

  public static async getData(userId, videoId) {
    try {
      const interactedVideo = await InteractedVideo.query()
        .where('user_id', userId)
        .andWhere('video_id', videoId)
        .firstOrFail()

      return interactedVideo
    } catch (error) {}
  }
}
