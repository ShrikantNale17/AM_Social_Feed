const router = require('express').Router()

const Post = require('../models/post')
const User = require('../models/user')
const postController = require('../controller/uploadImage')
const getPagination = require('../controller/paginate')

/* router.get('/', async (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    try {
        const posts = await Post.find()
        res.status(200).json(posts)
    } catch (err) {
        res.status(400).json(err)
    }
}) */

/* router.get('/post/:id', async (req, res) => {
    try {
        const posts = await Post.findById(req.params.id)
        res.status(200).json(posts)
    } catch (err) {
        res.status(400).json(err)
    }
}) */

router.post('/addPost', postController, async (req, res) => {
    const user = await User.findById(req.user.id)
    if (user) {
        const { _id, password, email, createdAt, updatedAt, __v, ...other } = user._doc
        console.log(other);
        if (req.file) {
            const newPost = await new Post({
                userID: req.user.id,
                user: other,
                image: req.file.filename,
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
        } else {
            res.json({
                message: "image is required to create post"
            })
        }
    } else {
        res.json({
            message: 'user not found'
        })
    }
})

router.put('/like/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post.likes.includes(req.user.id)) {
            await post.updateOne({ $push: { likes: req.user.id } })
            const a1 = await Post.findById(req.params.id)
            res.status(200).json({
                message: 'post liked ',
                likes: a1.likes.length
            })
        } else {
            await post.updateOne({ $pull: { likes: req.user.id } })
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
        const user = await User.findById(req.user.id)
        if (post) {
            await post.updateOne({
                $push: {
                    comments: {
                        userID: req.user.id,
                        user: {
                            name: user.firstname + ' ' + user.lastname,
                            image: user.image
                        },
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

router.get('/allPosts', async (req, res) => {
    var pageNo = parseInt(req.query.pageNo) || 1
    var size = parseInt(req.query.size)
    var query = {}
    if (pageNo < 0 || pageNo === 0) {
        response = { "error": true, "message": "invalid page number, should start with 1" };
        return res.json(response)
    }
    query.skip = size * (pageNo - 1)
    query.limit = size
    // Find some documents
    Post.count({}, function (err, totalCount) {
        if (err) {
            response = { "error": true, "message": "Error fetching data" }
        }
        Post.find({}, {}, query, function (err, data) {
            // Mongo command to fetch all data from collection.
            if (err) {
                response = { "error": true, "message": "Error fetching data" };
            } else {
                var totalPages = Math.ceil(totalCount / size)
                response = { "error": false, "message": data.reverse(), "pages": totalPages };
            }
            res.json(response);
        });
    })
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