import { useSession } from 'next-auth/react'
import React, { useState, useRef } from 'react'
import { BsImage, BsEmojiSmile } from 'react-icons/bs'
import { AiOutlineGif, AiOutlineClose } from 'react-icons/ai'
import { RiBarChart2Line } from 'react-icons/ri'
import { IoCalendarNumberOutline } from 'react-icons/io5'
import { HiOutlineLocationMarker } from 'react-icons/hi'
import EmojiPicker from 'emoji-picker-react'
import { db, storage } from '@/firebase'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import Image from 'next/image'

const Input = () => {
    const [loading, setLoading] = useState(false)
    const [input, setInput] = useState("")
    const [selectedFile, setSelectedFile] = useState(null)
    const [showEmojis, setShowEmojis] = useState(false)
    const { data: session } = useSession()
    const textareaRef = useRef(null)

    const addImageToPost = (e) => {
        const reader = new FileReader()
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0])
        }

        reader.onload = (readerEvent) => {
            setSelectedFile(readerEvent.target.result)
        }
    }

    const handleEmojiClick = (emojiData) => {
        const textarea = textareaRef.current
        const startPos = textarea.selectionStart
        const endPos = textarea.selectionEnd
        
        setInput(
            input.substring(0, startPos) +
            emojiData.emoji +
            input.substring(endPos)
        )
        
        setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = startPos + emojiData.emoji.length
            textarea.focus()
        }, 0)
    }

    const sendPost = async () => {
        if (loading)
            return

        setLoading(true)

        const docRef = await addDoc(collection(db, "posts"), {
            id: session.user.uid,
            username: session.user.name,
            userImg: session.user.image,
            tag: session.user.tag,
            text: input,
            timestamp: serverTimestamp()
        })

        const imageRef = ref(storage, 'posts/$(docRef.id)/image')

        if(selectedFile) {
            await uploadingString(imageRef, selectedFile, "data_url")
            .then(async () => {
                const downloadURL = await getDownloadURL (imageRef)
                await updateDoc(doc(db, "posts", docRef.id), {
                    image: downloadURL
                })
            })
        }

        setLoading(false)
        setInput("")
        setSelectedFile(null)
        setShowEmojis(false)
    }


    return (
        <div className="pb-3 relative">
            <div className="max-w-1xl mx-auto px-4">
                <div className="flex space-x-4">
                    <div className="flex-shrink-0">
                        <Image 
                            src={session?.user?.image} 
                            alt="Profile" 
                            className="h-12 w-12 rounded-full object-cover" 
                            width={48}
                            height={48}
                        />
                    </div>
                    
                    <div className="flex-1">
                        <textarea
                            ref={textareaRef}
                            className="w-full text-xl outline-none placeholder-gray-500 resize-none"
                            rows="3"
                            placeholder="What's on your mind?"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />

                        {selectedFile && (
                            <div className="relative mt-2 mb-4">
                                <div className="absolute top-2 left-2 bg-black bg-opacity-50 rounded-full p-1 cursor-pointer"
                                    onClick={() => setSelectedFile(null)}>
                                    <AiOutlineClose className="text-white h-4" />
                                </div>
                                <img
                                    src={selectedFile}
                                    alt="Preview"
                                    className="rounded-xl max-h-80 w-full object-contain"
                                />
                            </div>
                        )}

                        <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center space-x-4 text-purple-500">
                                <label className="cursor-pointer">
                                    <BsImage className="h-5 w-5" />
                                    <input 
                                        type="file" 
                                        className="hidden"
                                        onChange={addImageToPost} 
                                    />
                                </label>
                                
                                <div className='border border-purple-500 rounded h-[18px] text-[16px] grid place-items-center'>
                                    <AiOutlineGif />
                                </div>

                                <RiBarChart2Line className='rotate-90' />
                                
                                <div className="relative">
                                    <BsEmojiSmile 
                                        className='cursor-pointer'
                                        onClick={() => setShowEmojis(!showEmojis)}  
                                    />
                                    {showEmojis && (
                                        <div className="absolute top-10 left-0 z-50">
                                            <EmojiPicker
                                                onEmojiClick={handleEmojiClick}
                                                width={300}
                                                height={350}
                                                previewConfig={{ showPreview: false }}
                                            />
                                        </div>
                                    )}
                                </div>
                                
                                <IoCalendarNumberOutline />
                                
                                <HiOutlineLocationMarker />
                            </div>
                            
                            <button 
                                className={`px-4 py-1.5 rounded-full font-bold ${!input.trim() ? 'bg-purple-300 text-white' : 'bg-purple-500 text-white'}`}
                                disabled={!input.trim() && !selectedFile}
                                onClick={sendPost}
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Input