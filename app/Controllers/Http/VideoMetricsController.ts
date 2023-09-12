import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import InteractedVideo from 'App/Models/InteractedVideo'
import User from 'App/Models/User'
import Video from 'App/Models/Video'

export default class VideoMetricsController {
  public async store({ auth, params, request, response }: HttpContextContract) {
    if (auth.isLoggedIn && auth.user !== undefined) {
      const liked = request.input('liked')
      const disliked = request.input('disliked')

      try {
        const user = await User.findOrFail(auth.user.id)
        const video = await Video.findOrFail(params.id)

        let interactedVideo = await user
          .related('interactedVideos')
          .query()
          .where('videoId', params.id)
          .first()

        if (!interactedVideo) {
          interactedVideo = await user.related('interactedVideos').create({
            videoId: params.id,
            liked: liked,
            disliked: disliked,
          })
        } else if (liked && interactedVideo.liked) {
          interactedVideo.liked = false
        } else if (disliked && interactedVideo.disliked) {
          interactedVideo.disliked = false
        } else {
          if (liked) {
            interactedVideo.liked = true
            interactedVideo.disliked = false
          } else if (disliked) {
            interactedVideo.liked = false
            interactedVideo.disliked = true
          }
        }

        await interactedVideo.save()

        video.likes = (
          await InteractedVideo.query()
            .where('video_id', params.id)
            .andWhere('liked', 1)
            .count('*', 'total')
        )[0].$extras.total

        video.dislikes = (
          await InteractedVideo.query()
            .where('video_id', params.id)
            .andWhere('disliked', 1)
            .count('*', 'total')
        )[0].$extras.total

        await video.save()

        return response.json({
          liked: interactedVideo.liked,
          disliked: interactedVideo.disliked,
          likes: video.likes,
          dislikes: video.dislikes,
        })
      } catch (error) {
        console.log(error)
      }
    }
  }
}
