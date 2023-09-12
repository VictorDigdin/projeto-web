import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Video from './Video'
import User from './User'
import { DateTime } from 'luxon'

export default class InteractedVideo extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public videoId: number

  @column()
  public watched: boolean

  @column()
  public liked: boolean

  @column()
  public disliked: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Video)
  public video: BelongsTo<typeof Video>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
