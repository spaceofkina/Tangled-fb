const SidebarLink = ({ Icon, text, active = false, onClick, iconColor, textColor }) => {
  return (
    <div 
      className={`flex items-center space-x-4 p-3 rounded-full transition-all duration-200 cursor-pointer
        ${active ? 'bg-purple-100 shadow-inner' : 'hover:bg-yellow-200 hover:shadow-md'}`}
      onClick={onClick}
    >
      <Icon className={`text-xl ${active ? 'text-purple-600 scale-110' : iconColor || 'text-purple-500'} transition-transform duration-200`} />
      <span className={`font-medium ${textColor || 'text-black'} ${active ? 'font-semibold' : ''}`}>
        {text}
      </span>
      {active && (
        <div className="ml-auto w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
      )}
    </div>
  )
}

export default SidebarLink;