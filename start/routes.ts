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

// Todas as outras rotas específicas deve ser definida acima da rota curinga
// Route.get('*', async ({ response }) => {
//   return response.redirect().toRoute('index')
// })
