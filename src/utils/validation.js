const Joi = require('@hapi/joi')

const customError = () => {
  return new Error('Invalid password must be a number and one capital letter')
}

export const validationUser = user => {
  const schema = Joi.object({
    name: Joi.string().required(),
    username: Joi.string()
      .alphanum()
      .min(5)
      .max(12)
      .required(),
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .required(),
    password: Joi.string()
      .min(8)
      .max(16)
      .pattern(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/)
      .error(customError)
      .required()
  })
  return schema.validate(user)
}

export const validationLogin = user => {
  const schema = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .required(),
    password: Joi.string()
      .alphanum()
      .min(8)
      .max(16)
      .required()
  })
  return schema.validate(user)
}

export const validationPost = post => {
  const schema = Joi.object({
    title: Joi.string().required(),
    slug: Joi.string().required(),
    body: Joi.string()
      .min(20)
      .required(),
    author: Joi.string(),
    tags: Joi.array()
  })
  return schema.validate(post)
}

export const verify = (value, error) => {
  if (value)
    throw new Error(
      ` User validation failed: " ${error} " has already been taken`
    )
}
