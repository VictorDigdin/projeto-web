import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class VideoValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string({}, [rules.maxLength(100)]),

    description: schema.string.nullable({}, [rules.maxLength(255)]),

    url: schema.string({ trim: true }, [
      rules.url({
        protocols: ['http', 'https'],
        requireProtocol: false,
        requireHost: true,
        allowedHosts: ['www.youtube.com', 'youtube.com'],
      }),
      rules.normalizeUrl({
        stripWWW: true,
      }),
    ]),
  })

  public messages: CustomMessages = {
    'required': 'Campo Obrigatório',
    'title.maxLength': 'O título do vídeo deve conter até 100 caracteres',
    'description.maxLength': 'A descrição do vídeo deve conter até 255 caracteres',
    'url.url':
      'A URL inserida é inválida, verifique o domínio (aceitamos apenas o Youtube) e se o link é válido',
  }
}
