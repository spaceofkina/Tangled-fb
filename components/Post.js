import { useSession } from 'next-auth/react'
import React, { useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { BsChat } from 'react-icons/bs'
import { AiFillHeart, AiOutlineHeart, AiOutlineShareAlt } from 'react-icons/ai'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { FaRetweet } from 'react-icons/fa'
import { AppContext } from "../context/AppContext"
import { deleteDoc, doc, collection, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import Image from 'next/image'

const Post = ({ id, post }) => {
    const router = useRouter()
    const [likes, setLikes] = useState([])
    const [liked, setLiked] = useState(false)
    const [comments, setComments] = useState([])
    const { data: session } = useSession()
    const [appContext, setAppContext] = useContext(AppContext)

    const formatRelativeTime = (date) => {
        if (!date) return ""
        
        const now = new Date()
        const seconds = Math.floor((now - date) / 1000)
        
        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60
        }
        
        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit)
            if (interval >= 1) {
                return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`
            }
        }
        
        return 'Just now'
    }
     
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "post", id, "likes"), (snapshot) =>
            setLikes(snapshot.docs)
        )
        return () => unsubscribe()
    }, [id]) // Removed db from dependencies

    useEffect(() => {
        setLiked(likes.findIndex((like) => like.id === session?.user?.uid) !== -1)
    }, [likes, session?.user?.uid]) // Added missing dependency

    const likePost = async () => {
        if (liked) {
            await deleteDoc(doc(db, "post", id, "likes", session.user.uid))
        } else {
            await setDoc(doc(db, "post", id, "likes", session.user.uid), {
                username: session.user.name
            })
        }
    }


     return (
        <div 
            className='mt-4 border-t border-gray-400 px-4 pt-6 pb-4 cursor-pointer' 
            onClick={() => router.push(`/${id}`)}>
            <div className='flex gap-3'>
                <Image 
                    src={post?.userImg} 
                    alt="Profile" 
                    className='h-12 w-12 rounded-full object-cover'
                    width={48}
                    height={48}
                />

                <div className='flex-1'>
                    <div className='flex flex-col'>
                        <h1 className='font-medium'>{post?.username}</h1>
                        <div className='flex items-center gap-1'>
                            <p className='text-gray-700 text-sm'>@{post?.tag}</p>
                            <span className='text-gray-400'>·</span>
                            <p className='text-gray-700 text-sm'>
                                {post?.timestamp && formatRelativeTime(post.timestamp.toDate())}
                            </p>
                        </div>
                    </div>

                    <p className='mt-2'>{post?.text}</p>
                    {post?.image && (
                        <Image
                            className='max-h-[450px] object-cover rounded-[20px] mt-2'
                            src={post?.image}
                            alt="Post content"
                            width={500}
                            height={450}
                        />
                    )}

                    <div className='flex justify-between text-[20px] mt-4 w-[80%]'>
                        <div className='flex gap-1 items-center'>
                            <BsChat className='hoverEffect w-7 h-7 p-1 text-purple-600'
                            onClick={(e) => {
                                e.stopPropagation()
                                //openModal()
                            }}/>
                            {comments.length > 0 && (
                                <span className='text-sm text-purple-600'>{comments.length}</span>
                            )}
                        </div>

                        {session?.user?.uid !== post?.id ? (
                            <FaRetweet className='hoverEffect w-7 h-7 p-1 text-purple-600'/>
                        ) : (
                            <RiDeleteBin6Line className='hoverEffect w-7 h-7 p-1 text-purple-600'
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteDoc(doc(db, "posts", id));
                            }}/> 
                        )}

                        <div className='flex gap-1 items-center'
                        onClick={(e) => {
                            e.stopPropagation()
                            likePost()
                        }}>
                            {liked ? (
                                <AiFillHeart className='hoverEffect w-7 h-7 p-1 text-purple-700' />
                            ) : (
                                <AiOutlineHeart className='hoverEffect w-7 h-7 p-1 text-purple-600' />
                            )}
                            {likes.length > 0 && (
                                <span className={`${liked ? "text-purple-700" : "text-purple-600"} text-sm`}>
                                    {likes.length}
                                </span>
                            )}
                        </div>
                        <AiOutlineShareAlt className='hoverEffect w-7 h-7 p-1 text-purple-600' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Post