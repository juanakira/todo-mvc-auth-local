// importing and initializing express
const express = require('express')
const app = express()
// importing mongoose: MVC applied to mongo in node
const mongoose = require('mongoose')
// 
const passport = require('passport')
const session = require('express-session')
// Using Mongo to store session information
const MongoStore = require('connect-mongo')(session)
// way to give the user information, for validation errors
const flash = require('express-flash')
// Morgan logs the codes when running the dev environment
const logger = require('morgan')

// Created by us
  // import the module to connect to the DV
const connectDB = require('./config/database')
  // import router files
const mainRoutes = require('./routes/main')
const todoRoutes = require('./routes/todos')

// dotenv files
require('dotenv').config({path: './config/.env'})

// Passport config
require('./config/passport')(passport)

// Initializing database
connectDB()

// setting up EJS as the templating language
app.set('view engine', 'ejs')
// setting up express properties like the dir for static files and stuff to help urls and parse json
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// 
app.use(logger('dev'))
// Sessions
app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  )
  
// Passport middleware
app.use(passport.initialize())
app.use(passport.session())
// 
app.use(flash())
// setting up the imported routers
app.use('/', mainRoutes)
app.use('/todos', todoRoutes)
 
app.listen(process.env.PORT, ()=>{
    console.log('Server is running, you better catch it!')
})    