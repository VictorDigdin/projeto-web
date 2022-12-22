import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StoreUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    // Todos os campos são requiridos por predefinição, não precisa colocar o rules.required()
    username: schema.string({ trim: true }, [
      rules.alphaNum(),
      rules.minLength(3),
      rules.maxLength(30),
      rules.notIn(['admin']),
      rules.unique({ table: 'users', column: 'username', caseInsensitive: true }),
    ]),

    email: schema.string({ trim: true }, [
      rules.email(),
      rules.escape(),
      rules.minLength(5),
      rules.maxLength(180),
      rules.normalizeEmail({
        allLowercase: true,
        gmailRemoveDots: true,
      }),
      rules.unique({ table: 'users', column: 'email', caseInsensitive: true }),
    ]),

    firstName: schema.string({ trim: true }, [rules.alpha(), rules.maxLength(40)]),

    lastName: schema.string({ trim: true }, [rules.alpha(), rules.maxLength(40)]),

    password: schema.string({ trim: true }, [
      rules.minLength(6),
      rules.maxLength(60),
      rules.regex(new RegExp('^[a-zA-Z0-9!?@]+$')),
      rules.confirmed('passwordConfirmation'),
    ]),

    passwordConfirmation: schema.string({ trim: true }, []),
  })

  public messages: CustomMessages = {
    'required': 'Campo Obrigatório',
    'email.email': 'O email inserido é inválido',
    'email.minLength': 'O tamanho do email inserido é inválido',
    'email.maxLength': 'O endereço de email deve conter até 180 caracteres',
    'email.unique': 'Esse endereço de email já está sendo utilizado',
    'firstName.alpha': 'O nome inserido contém caracteres inválidos',
    'firstName.maxLength': 'O nome deve conter até 40 caracteres',
    'lastName.alpha': 'O nome inserido contém caracteres inválidos',
    'lastName.maxLength': 'O sobrenome deve conter até 40 caracteres',
    'username.alphaNum': 'O nome de usuário contém caracteres inválidos',
    'username.minLength': 'O nome de usuário deve ter entre 6 e 30 caracteres',
    'username.maxLength': 'O nome de usuário deve ter entre 6 e 30 caracteres',
    'username.notIn': 'Nome de usuário inválido',
    'username.unique': 'Esse nome de usuário não está disponível',
    'password.minLength': 'A senha deve ter pelo menos 6 caracteres',
    'password.maxLength': 'A senha deve ter no máximo 60 caracteres',
    'password.regex': 'A senha contém caracteres inválidos',
    'passwordConfirmation.confirmed': 'As senhas não batem',
  }
}
