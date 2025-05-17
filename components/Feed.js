import React, { useEffect, useState } from 'react'
import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import Input from './input';
import Post from './Post';

const Feed = () => {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, "posts"), orderBy("timestamp", "desc")),
            (snapshot) => {
                setPosts(snapshot.docs)
            }
        )
        return () => unsubscribe()
    }, []) // Removed db from dependencies

    return (
        <div className='sm:ml-[81px] xl:ml-[340px] w-[660px] min-h-screen border-r border-white text-black py-2'> 
            <div className='sticky top-4 bg-white flex justify-between font-medium text-[20px] px-4 py-7'>
                Home
            </div>
            <Input />
            {posts.map((post) => (
                <Post key={post.id} id={post.id} post={post.data()}/>
            ))}
        </div>
    )
}

export default Feed