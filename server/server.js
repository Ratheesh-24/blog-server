import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import connectDB from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'
import {notFound, errorHandler} from './middleware/errorMiddleware.js'
dotenv.config()
connectDB()

const app = express()

app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({limit: '50mb', extended:false}))

app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)

const __dirname = path.resolve()
if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '/client/build')))
    
      app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
      )
}
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`)
})