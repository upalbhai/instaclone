import express from 'express';
import isAuthenticated from '../../middlewares/isAuthenticated.js';
import upload from '../../middlewares/multer.js';
import { addComment, addpost, bookmarkPost, deletePost, getAllCommentsOfPost, getPost, getuserPost, like } from '../../controllers/post/post.controller.js';

const router = express.Router();

router.route('/addpost').post(isAuthenticated,upload.single('image'),addpost);
router.route('/all').get(isAuthenticated,getPost);
router.route('/userpost/all').get(isAuthenticated,getuserPost);
router.route('/:id/likedislike').get(isAuthenticated,like);
router.route('/:id/comment').post(isAuthenticated,addComment);
router.route('/:id/comment/all').post(isAuthenticated,getAllCommentsOfPost);
router.route('/delete/:id').post(isAuthenticated,deletePost);
router.route('/:id/bookmark').post(isAuthenticated,bookmarkPost);

export default router;