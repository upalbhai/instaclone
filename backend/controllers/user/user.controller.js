import { Post } from "../../model/post/post.model.js";
import { User } from "../../model/user/user.model.js";
import cloudinary from "../../utils/cloudinary.js";
import getDataUri from "../../utils/datauri.js";
import sendResponse from "../../utils/sendResponse.js";
import bcrypt from 'bcryptjs';
import jwt from  'jsonwebtoken'
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if all required fields are provided
        if (!username || !email || !password) {
            return sendResponse(res, 400, 'Username, email, and password are required.');
        }

        // Check if the email is already registered
        const user = await User.findOne({ email });
        if (user) {
            return sendResponse(res, 409, 'Email is already registered. Please try with a different email.');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        await User.create({
            username,
            email,
            password: hashedPassword,
        });

        return sendResponse(res, 201, 'Account created successfully', true);
    } catch (error) {
        console.error('Registration error:', error);
        return sendResponse(res, 500, 'Internal Server Error');
    }
};


export const login = async(req,res)=>{
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return sendResponse(res,401,'Something is missing')
        }
        let user = await User.findOne({email});
        if(!user){
            return sendResponse(res,401,'This email does not exist')
        }
        const isPasswordMatch = await bcrypt.compare(password,user.password);
        if(!isPasswordMatch){
            return sendResponse(res,401,'Incorrect Password')
        }
        const populatedPosts = await Promise.all(
            user.posts.map(async(postId)=>{
                const post = await Post.findById(postId);
                if(post.author.equals(user._id)){
                    return post;
                }
                return null;
            })
        )
        user={
            _id:user._id,
            username:user.username,
            email:user.email,
            profilePicture:user.profilePicture,
            bio:user.bio,
            followers:user.followers,
            following:user.following,
            posts:populatedPosts
        }
        const token = await jwt.sign({userId:user._id},process.env.SECRET_KEY,{expiresIn:'1d'});
        return res.cookie('token',token,{httpOnly:true,sameSite:'strict',maxAge:1*24*60*60*1000}).json({
            message:`Welcome back ${user.username}`,
            succes:true
        })
    } catch (error) {
        
    }
}

export const logout = async(req,res)=>{
    try {
        return res.cookie('token','',{maxAge:0}).json({
            message:'Logged Out',
            succes:true
        })
    } catch (error) {
        console.log(error)
    }
}

export const getProfile = async(req,res)=>{
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select('-password');
        if(!user){
            return sendResponse(res,404,'User not found');
        }
        return res.json({
            user,
            success:true
        });
    } catch (error) {
        console.log(error)
    }
}

export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender } = req.body;
        const profilePicture = req.file;
        let cloudResponse;

        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);

            // Log the fileUri to ensure it's correct
            if (!fileUri) {
                return sendResponse(res, 400, 'Invalid file uploaded');
            }

            // Upload the file to Cloudinary using the Data URI
            cloudResponse = await cloudinary.uploader.upload(fileUri, {
                resource_type: 'image', // Specify the resource type
            });

            // Check if Cloudinary returned a secure URL
            if (!cloudResponse || !cloudResponse.secure_url) {
                return sendResponse(res, 500, 'Failed to upload profile picture');
            }
        }

        const user = await User.findById(userId);
        if (!user) {
            return sendResponse(res, 401, 'User not found');
        }

        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();

        // Exclude password from the user object before sending it in the response
        const updatedUser = await User.findById(userId).select('-password');

        return sendResponse(res, 201, 'Profile Updated Successfully', true, updatedUser);
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, 'An error occurred while updating the profile');
    }
};


export const getSuggestedUser = async (req, res) => {
    try {
        const currentUserId = req.id;

        // Find the current user to access their following list
        const currentUser = await User.findById(currentUserId).populate('following');
        if (!currentUser) {
            return sendResponse(res, 400, 'User not found');
        }

        // Exclude current user and those they are already following
        const suggestedUsers = await User.find({
            _id: { $ne: currentUserId, $nin: currentUser.following }
        }).select('-password').limit(10); // Limit the number of suggestions

        if (!suggestedUsers.length) {
            return sendResponse(res, 200, 'No suggested users at the moment');
        }

        return sendResponse(res, 200, 'Suggested users retrieved successfully', true, suggestedUsers);
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, 'An error occurred while retrieving suggested users');
    }
};


export const followOrUnfollow = async (req, res) => {
    try {
        const followKrneWala = req.id; // patel
        const jiskoFollowKrunga = req.params.id; // shivani
        if (followKrneWala === jiskoFollowKrunga) {
            return res.status(400).json({
                message: 'You cannot follow/unfollow yourself',
                success: false
            });
        }

        const user = await User.findById(followKrneWala);
        const targetUser = await User.findById(jiskoFollowKrunga);

        if (!user || !targetUser) {
            return res.status(400).json({
                message: 'User not found',
                success: false
            });
        }
        // mai check krunga ki follow krna hai ya unfollow
        const isFollowing = user.following.includes(jiskoFollowKrunga);
        if (isFollowing) {
            // unfollow logic ayega
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $pull: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $pull: { followers: followKrneWala } }),
            ])
            return res.status(200).json({ message: 'Unfollowed successfully', success: true });
        } else {
            // follow logic ayega
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $push: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $push: { followers: followKrneWala } }),
            ])
            return res.status(200).json({ message: 'followed successfully', success: true });
        }
    } catch (error) {
        console.log(error);
    }
}


