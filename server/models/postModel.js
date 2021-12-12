import mongoose from 'mongoose'

const postSchema = mongoose.Schema({
      user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
      },
      title: {
            type: String,
            required: true,
            maxLength: 60
      },
      description: {
            type: String,
            required: true,
            maxLength: 160
      },
      content: {
            type: String,
            required: true,
            maxLength: 16000
      },
      name: {
            type: String,
            required: true
      },
      image: {
            cloud_name: {
                  type: String, 
                  required: true
            },
            imageID: {
                  type: String,
                  required: true
            }
      },
      likes: [
            {
                  user: {
                        type: mongoose.Schema.ObjectId,
                        ref: 'users'
                  }
            }
      ],
      comments: [
            {
                  user: {
                        type: mongoose.Schema.ObjectId,
                        ref: 'users'
                  },
                  content: {
                        type: String,
                        required: true
                  },
                  date: {
                        type: Date,
                        default: Date.now()
                  }
            }
      ],
      date: {
            type: Date,
            default: Date.now()
      }
})

const Post = mongoose.model('Post', postSchema)
export default Post