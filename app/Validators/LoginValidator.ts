import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StoreUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({ trim: true }, [
      rules.email,
      rules.normalizeEmail({ allLowercase: true, gmailRemoveDots: true }),
    ]),
    password: schema.string({ trim: true }, [
      rules.escape(),
      rules.regex(new RegExp('^[a-zA-Z0-9!?@]+$')),
    ]),
  })

  public messages: CustomMessages = {
    'email.email': 'Não foi possível logar, verifique seus dados',
    'passwordConfirmation.confirmed': 'Não foi possível logar, verifique seus dados',
  }
}
