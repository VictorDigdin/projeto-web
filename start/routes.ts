import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async ({ view }) => {
  return view.render('index')
})

Route.get('/index', async ({ view }) => {
  return view.render('index')
}).as('index')

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
  Route.get('/submit-video', 'VideosController.create').as('create')
  Route.post('/submit-video', 'VideosController.store').as('store')
  Route.get('/show-videos', 'VideosController.index').as('index')
  Route.get('/user-videos', 'VideosController.userVideos').as('userVideos')
  Route.get('/video/:id', 'VideosController.show').as('singleVideo')
}).as('videos')
// Todas as outras rotas específicas devem ser definidas acima da rota curinga
// Route.get('*', async ({ response }) => {
//   return response.redirect().toRoute('index')
// })
