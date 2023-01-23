import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Video extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  // Por padrão, o foreignKey é a representação camelCase do nome do modelo pai junto com sua chave primária
  @column()
  public userId: number

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public url: string

  @column()
  public urlId: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Indicando que essa classe pertence a classe do usuário
  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
