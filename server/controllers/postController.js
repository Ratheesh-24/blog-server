import asyncHandler from 'express-async-handler'
import { cloudinary } from '../cloudinary/index.js'
import Post from '../models/postModel.js'
import User from '../models/userModel.js'

//@route  GET api/posts
//@desc   Get all blog posts
//@access Public

const getAllPosts = asyncHandler(async (req, res) => {
      const pageSize = 8
      const page = Number(req.query.pageNumber) || 0
      const count = await Post.countDocuments({})
      const posts = await Post.find().sort({date: -1}).limit(pageSize).skip(pageSize*page)
      res.json({
            totalPages: Math.ceil(count/pageSize),
            posts
      })
 })

//@route  POST api/posts
//@desc   Create a blog post
//@access Private
const createPost = (asyncHandler(async (req, res) => {
      const user = await User.findById(req.user._id)
      const { title, description, content, image } = req.body
      const uploadedImage = await cloudinary.uploader.upload(image)
      const newPost = new Post({
            title,
            description,
            content,
            user: req.user._id,
            name: user.name,
            image: {
                  cloud_name: process.env.CLOUDINARY_NAME,
                  imageID: uploadedImage.public_id
            }
      })
      const post = await newPost.save()
      res.status(201).json(post)
}))

//@route  GET api/posts/:id
//@desc   Get a blog post by id
//@access Public

const getPostByID = asyncHandler(async (req, res) => {
      
      const post = await Post.findById(req.params.id)
      if (!post) {
            res.status(400)
            throw new Error("Post not found")
      }
      else {
            res.json(post)
      }
})

//@route  PUT api/posts/:id
//@desc   Update/Edit a blog post
//@access Public

const updatePost = asyncHandler(async (req, res) => {
      const post = await Post.findById(req.params.id)
      if (!post) {
            res.status(400)
            throw new Error("Post not found")
      }
      if (post.user.toString() != req.user._id) {
            res.status(401)
            throw new Error("User not authorized")
      }
      else {
            post.title = req.body.title || post.title,
            post.content = req.body.content || post.content,
            post.description = req.body.description || post.content
            await post.save()
            res.json(post)
      }
})

//@route  DELETE api/posts/:id
//@desc   Delete a post
//@access Private

const deletePost = asyncHandler(async (req, res) => {
     
      const post = await Post.findById(req.params.id)
      if (!post) {
            res.status(401)
            throw new Error("Post not found")
      }
      if (post.user.toString() != req.user._id) {
            res.status(401)
            throw new Error("User not authorized")
      }
      else {
            await post.remove()
            res.json({ message: 'Post removed' })
      }
})

//@route  PUT api/posts/like/:id
//@desc   Like a post
//@access Private

const likePost = asyncHandler(async (req, res) => {
      const post = await Post.findById(req.params.id)
      if (!post) {
            res.status(400)
            throw new Error("Post not found")
      }
      else {
            const checkIfLiked = post.likes.filter((like) => (
                  like.user.toString() == req.user._id
            ))
            if (checkIfLiked.length > 0) {
                  res.status(400)
                  throw new Error("Post already liked")
            }
            else {
                  post.likes.unshift({ user: req.user._id })
                  await post.save()
                  res.json(post.likes)
            }
      }
})

//@route  PUT api/posts/unlike/:id
//@desc   Unlike a post
//@access Private

const unlikePost = asyncHandler(async (req, res) => {
      const post = await Post.findById(req.params.id)
      if (!post) {
            res.status(400)
            throw new Error("Post not found")
      }
      else {
            const checkIfLiked = post.likes.filter((like) => (
                  like.user.toString() == req.user._id
            ))
            if (checkIfLiked.length === 0) {
                  res.status(400)
                  throw new Error("Post has not yet been liked")
            }
            else {
                  const likedBy = post.likes.map((like) => (
                        like.user.toString()
                  ))
                  const likedIdx = likedBy.indexOf(req.user._id)
                  post.likes.splice(likedIdx, 1)
                  await post.save()
                  res.send(post.likes)
            }
      }
})


export {getAllPosts, createPost, getPostByID, deletePost, updatePost, likePost, unlikePost}