import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/register', 'UsersController.create').as('create')
  Route.post('/register', 'UsersController.store').as('store')
  Route.get('/update-user', 'UsersController.edit').as('edit').middleware('auth')
  Route.post('/update-user', 'UsersController.update').as('update').middleware('auth')
}).as('users')

Route.group(() => {
  Route.get('/login', 'AuthController.create').as('create')
  Route.post('/login', 'AuthController.store').as('store')
  Route.get('/logout', 'AuthController.destroy').as('destroy').middleware('auth')
}).as('auth')

Route.group(() => {
  Route.get('/', 'VideosController.index').as('index')
  Route.get('/video/:id', 'VideosController.show').as('show')
  Route.get('/results', 'VideosController.search').as('search')
  Route.get('/videos/not-found', 'VideosController.notFound').as('notFound')
}).as('videos')

Route.group(() => {
  Route.get('/user-videos', 'UserVideosController.index').as('index')
  Route.get('/submit-video', 'UserVideosController.create').as('create')
  Route.post('/submit-video', 'UserVideosController.store').as('store')
  Route.post('/user-videos/delete/:id', 'UserVideosController.destroy').as('destroy')
}).as('userVideos')

Route.group(() => {
  Route.post('/watched/:id', 'InteractedVideosController.markAsWatched').as('watched')
  Route.get('/liked-videos', 'InteractedVideosController.likedVideos').as('likedVideos')
  Route.get('/watched-videos', 'InteractedVideosController.watchedVideos').as('watchedVideos')
  Route.post('/watched-videos/delete/:id', 'InteractedVideosController.unmarkAsWatched').as(
    'unmarkAsWatched'
  )
  Route.post('/liked-videos/delete/:id', 'InteractedVideosController.unmarkAsLiked').as(
    'unmarkAsLiked'
  )
}).as('interactedVideos')

Route.post('/store/:id', 'VideoMetricsController.store').as('videoMetrics.store')
