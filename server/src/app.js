console.log('Waking up fellas')
const express = require('express')
const bodyParse = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const {sequelize} = require('./models')
const config = require('./config/config')
const app = express()
const querystring = require('querystring');
app.use(morgan('combined'))
app.use(bodyParse.json())
app.use(cors({
  origin: '*',
  allowedHeaders: ['Content-Type', 'Accept', 'X-Requested-With', 'Method', 'Authorization', 'userId'],
  optionsSuccessStatus: 200,
}));

require('./routes')(app)

sequelize.sync({force: false})
  .then(() => {
    app.listen(config.port)
    console.log(`Up and running, on port: ${config.port}`)
  })
