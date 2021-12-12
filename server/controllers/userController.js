import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

//@desc    Auth user & get token
//@route   GET/api/users
//@access  Public

const authUser = asyncHandler(async (req,res) => {
      const { email, password } = req.body
      const user = await User.findOne( {email} )
      if (user && (await user.matchPassword(password))) {
            res.json({
                  _id: user._id,
                  name: user.name,
                  email: user.email,
                  isAdmin: user.isAdmin,
                  token: jwt.sign({id: user._id}, process.env.JWT_SECRETKEY, {expiresIn: '30d'})
            })
      }
      else {
            res.status(401)
            throw new Error("Invalid email or password")
      }
})

//@desc    Register user
//@route   POST/api/users
//@access  Public

const registerUser = asyncHandler(async (req,res) => {
      const { email, password, name } = req.body
      const userExists = await User.findOne({ email })
      if (userExists) {
            res.status(400)
            throw new Error('User already exists')
      }
      const user = await User.create({
            name,
            email,
            password
      })
      if (user) {
            res.json({
                  _id: user._id,
                  name: user.name,
                  email: user.email,
                  isAdmin: user.isAdmin,
                  token: jwt.sign({id: user._id}, process.env.JWT_SECRETKEY, {expiresIn: '30d'})
            })
      }
      else {
            res.status(404)
            throw new Error('User not found')
      }
})

export {authUser, registerUser}