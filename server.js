const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const morgan = require('morgan');


const app = express();
dotenv.config();

//middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser())
app.use(morgan('dev'))


//Routes
app.use('/api/', require('./routes/authRoutes'))
app.use('/api/', require('./routes/userRoutes'))


//creating server
const port = process.env.PORT || 8800;
app.listen(port, ()=>{
    console.log(`server is up and running on ${port}`)
})