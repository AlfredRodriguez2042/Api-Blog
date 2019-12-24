import mongoose from 'mongoose'

export async function Connect() {
  const test = process.env.MONGO_DB_TEST
  const dev = process.env.MONGO_DB_PROD

  mongoose.Promise = global.Promise
  if (process.env.NODE_ENV === 'test') {
    mongoose.connect(test, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    console.log('Connected successfully to server Test')
  } else {
    mongoose.connect(dev, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    console.log('Connected successfully to server Dev')
  }
}

// const sequelize = new Sequelize(dbconfig)

// const models = {
//   Post: sequelize.import('./models/post'),
//   Tag: sequelize.import('./models/tag')
// }
// Object.keys(models).forEach(modelName => {
//   if ('assosiate' in models[modelName]) {
//     models[modelName].assosiate(models)
//   }
// })

// models.sequelize = sequelize

// export default models
