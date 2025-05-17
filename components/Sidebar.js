import { SiUpcloud } from "react-icons/si";
import SidebarLink from './SidebarLink';
import { AiOutlineHome, AiOutlineInbox, AiOutlineUser } from "react-icons/ai";
import { BsBell } from "react-icons/bs";
import { useSession, signOut } from 'next-auth/react';
import { IoBarChartSharp } from "react-icons/io5";
import Image from 'next/image';

const Sidebar = ({ onNotificationClick, onChartsClick, onHomeClick }) => {
  const { data: session } = useSession();

  return (
    <>
      {/* Desktop Sidebar (unchanged) */}
      <div className="hidden sm:flex flex-col items-center xl:items-start xl:w-[320px] w-[88px] p-4 fixed h-full border-r border-gray-200 bg-white left-0">
        {/* Logo Section */}
        <div className="flex items-center justify-center mb-8 p-2">
          <SiUpcloud className="text-purple-500 text-5xl xl:mr-3" />
          <h1 className="hidden xl:block text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-amber-500 font-[Poppins] italic">
            Tangled
          </h1>
        </div>

        {/* Navigation Links */}
        <div className="space-y-3 w-full"> 
          <SidebarLink 
            text="Home" 
            Icon={AiOutlineHome} 
            iconColor="text-purple-500" 
            textColor="hidden xl:inline text-black" 
            onClick={() => onHomeClick()}
          />

          <SidebarLink 
            text="Profile" 
            Icon={AiOutlineUser} 
            iconColor="text-purple-500" 
            textColor="hidden xl:inline text-black" 
          />
          
          <SidebarLink 
            text="Notifications" 
            Icon={BsBell} 
            iconColor="text-purple-500" 
            textColor="hidden xl:inline text-black"
            onClick={() => onNotificationClick()}
          />
          
          <SidebarLink 
            text="Messages" 
            Icon={AiOutlineInbox} 
            iconColor="text-purple-500" 
            textColor="hidden xl:inline text-black" 
          />
          
          <SidebarLink 
            text="Charts" 
            Icon={IoBarChartSharp} 
            iconColor="text-purple-500" 
            textColor="hidden xl:inline text-black"
            onClick={() => onChartsClick()}
          />
        </div>

        {/* Post Button (disabled) */}
        <div className="mt-8 hidden xl:flex justify-center w-full">
          <button 
            className='bg-gradient-to-r from-amber-400 to-amber-600 
            text-white rounded-full w-[200px] h-[44px] text-lg font-bold hover:from-amber-300 hover:to-amber-500 
            shadow-lg shadow-amber-500/30 transform hover:scale-103 transition-all duration-200'
            disabled
            title="Post functionality is currently unavailable"
          >
            Post
          </button>
        </div>

        {/* User Profile Section */}
        <div className='flex items-center justify-center xl:justify-start mt-auto p-3 rounded-full hover:bg-gray-100 cursor-pointer transition-colors duration-200 w-full' onClick={signOut}>
          <img 
            src={session?.user.image}
            alt="User profile"
            className='h-10 w-10 rounded-full'
          />
          
          <div className='hidden xl:flex flex-col ml-3'>
            <h4 className='text-black font-medium'>{session?.user?.name}</h4>
            <h4 className='text-gray-500 text-sm'>@{session?.user?.tag}</h4>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation (Facebook-style) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-3 z-50">
        <SidebarLink 
          text="" 
          Icon={AiOutlineHome} 
          iconColor="text-purple-500" 
          onClick={() => onHomeClick()}
          className="flex flex-col items-center"
        />
        
        <SidebarLink 
          text="" 
          Icon={AiOutlineUser} 
          iconColor="text-purple-500" 
          className="flex flex-col items-center"
        />
        
        <SidebarLink 
          text="" 
          Icon={BsBell} 
          iconColor="text-purple-500" 
          onClick={() => onNotificationClick()}
          className="flex flex-col items-center"
        />
        
        <SidebarLink 
          text="" 
          Icon={AiOutlineInbox} 
          iconColor="text-purple-500" 
          className="flex flex-col items-center"
        />
        
        <SidebarLink 
          text="" 
          Icon={IoBarChartSharp} 
          iconColor="text-purple-500" 
          onClick={() => onChartsClick()}
          className="flex flex-col items-center"
        />
        
        <div 
          className="flex flex-col items-center cursor-pointer"
          onClick={signOut}
        >
          <Image 
        src={session?.user.image}
        alt="User profile"
        className='h-10 w-10 rounded-full'
        width={40}
        height={40}
      />
        </div>
      </div>
    </>
  )
}

export default Sidebar;