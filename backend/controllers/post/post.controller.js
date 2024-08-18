import { Comment } from "../../model/comment/comment.model.js";
import { Post } from "../../model/post/post.model.js";
import { User } from "../../model/user/user.model.js";
import cloudinary from "../../utils/cloudinary.js";
import sendResponse from "../../utils/sendResponse.js";
import sharp from "sharp";
export const addpost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;
    if (!image) {
      return sendResponse(res, 401, "Image Required");
    }
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });
    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }
    await post.populate({ path: "author", select: "-password" });
    return sendResponse(res, 200, "Post Added Successfully", true, post);
  } catch (error) {
    console.log(error);
  }
};


export const getPost = async (req, res) => {
    try {
        const posts = await Post.find({})
            .sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username profilePicture' })
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: 'username profilePicture'
                }
            });

        return sendResponse(res, 200, posts, true);
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, 'An error occurred while fetching the posts.');
    }
};


export const getuserPost = async(req,res)=>{
    try {
        const authorId = req.id;
        const posts = await Post.find({author:authorId}).sort({createdAt:-1}).populate({
            path:'author',
            select:'username,profilePicture',
        }).populate({
            path:'comments',
            sort:{createdAt:-1},
            populate:{
                path:'author',
                select:'username,profilePicture'
            }
        })
        return sendResponse(res,200,posts,true);

    } catch (error) {
        
    }
}

export const like = async (req, res) => {
    try {
        const likeKarvavaroUser = req.id;  // Authorized user who is liking or disliking the post
        const postId = req.params.id;      // ID of the post to like or dislike

        // Check if postId is provided
        if (!postId) {
            return sendResponse(res, 400, 'Post ID is required.');
        }

        // Fetch the post
        const post = await Post.findById(postId);
        if (!post) {
            return sendResponse(res, 404, 'Post not found.');
        }

        // Toggle like/dislike status
        const isLiked = post.likes.includes(likeKarvavaroUser);
        if (isLiked) {
            post.likes = post.likes.filter(id => id !== likeKarvavaroUser);
            await post.save();
            return sendResponse(res, 200, 'Post disliked successfully.', true);
        } else {
            post.likes.push(likeKarvavaroUser);
            await post.save();
            return sendResponse(res, 200, 'Post liked successfully.', true);
        }
    } catch (error) {
        console.error('Like/Dislike error:', error);
        return sendResponse(res, 500, 'An error occurred while liking/disliking the post.');
    }
};


export const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const commentKarvavaroUser = req.id;
        const { text } = req.body;

        if (!postId) return sendResponse(res, 400, 'Post ID is required.');
        if (!text) return sendResponse(res, 400, 'Comment text is required.');

        const post = await Post.findById(postId);
        if (!post) return sendResponse(res, 404, 'Post not found.');

        let comment = await Comment.create({
            text: text,
            author: commentKarvavaroUser,
            post: postId,
        });

        comment = await comment.populate({
            path: 'author',
            select: 'profilePicture username',
        });

        post.comments.push(comment._id);
        await post.save();

        return sendResponse(res, 201, 'Commented successfully', true, comment);

    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, 'An error occurred while adding the comment.');
    }
};


export const getAllCommentsOfPost = async(req,res)=>{
    try {
        const postId = req.params.id;
        const comments = await Post.findById(postId).populate({
            path: 'comments',
            populate: {
                path: 'author',
                select: 'profilePicture username'
                }
            })
            if(!comments){
                return sendResponse(res,404,'There are no comments')
            }
            return sendResponse(res,200,true,comments)
    } catch (error) {
        
    }
}

export const deletePost = async(req,res)=>{
    try {
        const postId = req.params.id;
        authorId = req.id;
        const post = await Post.findById(postId);
        if(!post){
            return sendResponse(res,401,'no post found')
        }
        if(post.author.toString!==authorId){
            return sendResponse(res,403,'you are not the author of this post');
        }
        await Post.findByIdAndDelete(postId);
        // removing post id from user
        let user = await User.findById(authorId);
        user.posts = user.posts.filter(id=>id.toString()!==postId);
        await user.save();

        // deleting the comments also

        await Comment.deleteMany({post:postId})
        return sendResponse(res,200,'post deleted successfully')
    } catch (error) {
        
    }
}

export const bookmarkPost = async (req,res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message:'Post not found', success:false});
        
        const user = await User.findById(authorId);
        if(user.bookmarks.includes(post._id)){
            // already bookmarked -> remove from the bookmark
            await user.updateOne({$pull:{bookmarks:post._id}});
            await user.save();
            return res.status(200).json({type:'unsaved', message:'Post removed from bookmark', success:true});

        }else{
            // bookmark krna pdega
            await user.updateOne({$addToSet:{bookmarks:post._id}});
            await user.save();
            return res.status(200).json({type:'saved', message:'Post bookmarked', success:true});
        }

    } catch (error) {
        console.log(error);
    }
}