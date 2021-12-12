import express from 'express'
import { createPost, deletePost, getAllPosts, getPostByID, updatePost, likePost, unlikePost } from '../controllers/postController.js'
import { auth } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').get(getAllPosts).post(auth, createPost)
router.route('/:id').get(getPostByID).put(auth, updatePost).delete(auth, deletePost)
router.route('/like/:id').put(auth, likePost)
router.route('/unlike/:id').put(auth, unlikePost)

export default router