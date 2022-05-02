const router = require('express').Router()

const Post = require('../models/post')
const User = require('../models/user')
const postController = require('../controller/uploadImage')
const getPagination = require('../controller/paginate')

router.get('/', async (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    try {
        const posts = await Post.find()
        res.status(200).json(posts)
    } catch (err) {
        res.status(400).json(err)
    }
})

// router.get('/post/:id', async (req, res) => {
//     try {
//         const posts = await Post.findById(req.params.id)
//         res.status(200).json(posts)
//     } catch (err) {
//         res.status(400).json(err)
//     }
// })

router.post('/addPost', postController, async (req, res) => {
    const newPost = await new Post({
        userID: req.body.userID,
        image: req.file.path,
        caption: req.body.caption
    })

    try {
        const savePost = await newPost.save()
        res.status(200).json({
            post: savePost,
            message: 'new post uploaded successfully'
        })
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
})

router.put('/like/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post.likes.includes(req.body.userID)) {
            await post.updateOne({ $push: { likes: req.body.userID } })
            const a1 = await Post.findById(req.params.id)
            res.status(200).json({
                message: 'post liked ',
                likes: a1.likes.length
            })
        } else {
            await post.updateOne({ $pull: { likes: req.body.userID } })
            const a1 = await Post.findById(req.params.id)
            res.status(200).json({
                message: 'post unliked',
                likes: a1.likes.length
            })
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

router.put('/comment/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        const user = await User.findById(req.body.userID)
        if (post) {
            await post.updateOne({
                $push: {
                    comments: {
                        userID: req.body.userID,
                        user: user.firstname + ' ' + user.lastname,
                        comment: req.body.comment
                    }
                }
            })

            const a1 = await Post.findById(req.params.id)
            res.status(200).json({
                message: 'comment added successfully ',
                comments: a1.comments
            })
        } else {
            res.status(200).json({
                message: 'Post not found'
            })
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

// router.delete('/delete/:id', async (req, res) => {
//     try {
//         await Post.findByIdAndDelete(req.params.id)
//         res.status(200).json('Product deleted successfully')
//     } catch (err) {
//         res.status(400).json(err)
//     }
// })


module.exports = router