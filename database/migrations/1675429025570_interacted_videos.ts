import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'interacted_videos'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('users.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table
        .integer('video_id')
        .unsigned()
        .notNullable()
        .references('videos.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.boolean('watched').defaultTo(false)
      table.boolean('liked').defaultTo(false)
      table.boolean('disliked').defaultTo(false)

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
