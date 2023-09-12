import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'videos'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE') // Com esse relacionamento quando excluir o usuário os vídeos dele serão excluidos
      table.string('title', 255).notNullable()
      table.string('description', 4096).nullable()
      table.string('url', 255).notNullable()
      table.string('url_id', 255).notNullable()
      table.integer('likes').unsigned().defaultTo(0)
      table.integer('dislikes').unsigned().defaultTo(0)

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
