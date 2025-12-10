import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  MoreHorizontal, 
  Search, 
  Bell, 
  Image as ImageIcon,
  Smile,
  Share2,
  X,
  Flag,
  Link as LinkIcon,
  UserMinus,
  Move,
  MapPin,
  Target 
} from 'lucide-react';

// --- Mock Data ---

const mockFeelings = [
  { emoji: "😊", text: "Happy" },
  { emoji: "🥳", text: "Celebratory" },
  { emoji: "🤔", text: "Thoughtful" },
  { emoji: "😴", text: "Tired" },
  { emoji: "❤️", text: "Loved" },
  { emoji: "🤯", text: "Mind Blown" },
];

const initialPosts = [
  {
    id: 1,
    user: {
      name: "Alex Rivera",
      handle: "@arivera",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      verified: true
    },
    content: {
      text: "Just explored the new downtown art district. The murals are absolutely stunning! 🎨✨ #CityLife #ArtWalk",
      images: ["https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"],
      feeling: "😊 Happy",
      location: "Downtown Art District"
    },
    stats: { likes: 124, comments: 18, shares: 4 },
    timestamp: "2h ago",
    isLiked: false,
    isSaved: false
  },
  {
    id: 2,
    user: {
      name: "Sarah Chen",
      handle: "@schen_tech",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      verified: false
    },
    content: {
      text: "Working on a new React project. Tailwind CSS makes styling so much faster! 💻🚀 Anyone else loving the new features?",
      images: [],
      feeling: "🤓 Focused",
      location: null
    },
    stats: { likes: 89, comments: 32, shares: 12 },
    timestamp: "4h ago",
    isLiked: true,
    isSaved: true
  },
  {
    id: 3,
    user: {
      name: "Mountain Explorer",
      handle: "@peaks_photo",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
      verified: true
    },
    content: {
      text: "Morning coffee with a view ☕️🏔️. Nothing beats the fresh mountain air.",
      images: ["https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"],
      feeling: null,
      location: "Himalaya Foothills"
    },
    stats: { likes: 854, comments: 45, shares: 89 },
    timestamp: "6h ago",
    isLiked: false,
    isSaved: false
  }
];

const mockComments = [
  { id: 101, user: "Jason Derulo", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jason", text: "This is absolutely incredible! 🔥", time: "1h" },
  { id: 102, user: "Emily Blunt", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily", text: "Where exactly is this? I need to visit.", time: "45m" },
];

const mockLikers = [
  { id: 201, name: "Alice Cooper", handle: "@alice_c", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice" },
  { id: 202, name: "Bob Marley", handle: "@bob_m", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob" },
];


// --- Components & Hooks Defined at Module Level ---

const ActionButton = ({ active, activeColor, icon: Icon, label, onClick, count }) => (
  <button 
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    className={`flex items-center space-x-2 group transition-colors duration-200 ${
      active ? activeColor : 'text-gray-500 hover:text-gray-700'
    }`}
    aria-label={label}
  >
    <div className={`p-2 rounded-full group-hover:bg-gray-100 transition-colors ${active ? 'bg-opacity-10' : ''}`}>
      <Icon 
        className={`w-5 h-5 transition-transform duration-200 ${active ? 'scale-110 fill-current' : ''}`} 
        strokeWidth={active ? 0 : 2}
      />
    </div>
    {count !== undefined && (
      <span className={`text-sm font-medium ${active ? activeColor : 'text-gray-500'}`}>
        {count}
      </span>
    )}
  </button>
);

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-white z-10 shrink-0">
          <h3 className="font-bold text-lg text-gray-900">{title}</h3>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

const LikesModalContent = () => (
  <div className="divide-y divide-gray-50">
    {mockLikers.map(liker => (
      <div key={liker.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
        <div className="flex items-center space-x-3">
          <img src={liker.avatar} alt={liker.name} className="w-10 h-10 rounded-full bg-gray-100" />
          <div>
            <h4 className="font-semibold text-sm text-gray-900">{liker.name}</h4>
            <p className="text-xs text-gray-500">{liker.handle}</p>
          </div>
        </div>
        <button className="px-4 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-full hover:bg-indigo-700 transition-colors">
          Follow
        </button>
      </div>
    ))}
  </div>
);

const CommentsModalContent = ({ post }) => (
  <div className="flex flex-col h-full">
    {/* Original Post Context */}
    <div className="p-4 bg-gray-50 border-b border-gray-100">
      <div className="flex items-start space-x-3">
        <img src={post.user.avatar} alt={post.user.name} className="w-8 h-8 rounded-full" />
        <div className="flex-1">
          <p className="text-sm">
            <span className="font-semibold text-gray-900">{post.user.name}</span>
            <span className="text-gray-600 ml-2">{post.content.text}</span>
          </p>
        </div>
      </div>
    </div>

    {/* Comments List */}
    <div className="flex-1 p-4 space-y-4">
      {mockComments.map(comment => (
        <div key={comment.id} className="flex items-start space-x-3">
          <img src={comment.avatar} alt={comment.user} className="w-8 h-8 rounded-full bg-gray-100" />
          <div className="flex-1">
            <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-2 inline-block">
              <span className="font-semibold text-sm text-gray-900 block">{comment.user}</span>
              <span className="text-sm text-gray-700">{comment.text}</span>
            </div>
            <div className="flex items-center space-x-4 mt-1 ml-2">
              <span className="text-xs text-gray-500 font-medium">{comment.time}</span>
              <button className="text-xs text-gray-500 font-medium hover:text-gray-800">Like</button>
              <button className="text-xs text-gray-500 font-medium hover:text-gray-800">Reply</button>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Input Area */}
    <div className="p-3 border-t border-gray-100 bg-white shrink-0">
      <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2">
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" className="w-6 h-6 rounded-full" />
        <input 
          type="text" 
          placeholder="একটি কমেন্ট যোগ করুন..." 
          className="flex-1 bg-transparent border-none outline-none text-sm placeholder-gray-500"
          autoFocus
        />
        <button className="text-indigo-600 font-medium text-sm hover:text-indigo-700">Post</button>
      </div>
    </div>
  </div>
);

// New Component for Feeling Selection
const FeelingPicker = ({ onSelect, currentFeeling, onClear }) => {
  return (
    <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-lg absolute bottom-16 left-4 right-4 z-20">
      <p className="text-sm font-semibold text-gray-700 mb-2">আপনার অনুভূতি কেমন?</p>
      <div className="flex flex-wrap gap-2">
        {mockFeelings.map((f, index) => (
          <button
            key={index}
            onClick={() => onSelect(f)}
            className={`flex items-center space-x-2 px-3 py-1.5 bg-gray-100 rounded-full hover:bg-indigo-100 transition-colors text-sm ${currentFeeling === `${f.emoji} ${f.text}` ? 'bg-indigo-200 border border-indigo-500' : ''}`}
          >
            <span className="text-xl">{f.emoji}</span>
            <span className="text-gray-800 font-medium">{f.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};


const CreatePostModalContent = ({ onClose, onPost }) => {
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const [feeling, setFeeling] = useState(""); 
  const [showFeelingPicker, setShowFeelingPicker] = useState(false); 
  
  const fileInputRef = useRef(null);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const handleImageUpload = (e) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index) => setImages(prev => prev.filter((_, i) => i !== index));

  const handleSort = () => {
    let _images = [...images];
    const draggedItemContent = _images.splice(dragItem.current, 1)[0];
    _images.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setImages(_images);
  };

  const handleFeelingSelect = (selectedFeeling) => {
    setFeeling(`${selectedFeeling.emoji} ${selectedFeeling.text}`);
    setShowFeelingPicker(false);
  };

  const handleSubmit = () => {
    onPost(text, images, feeling, null); 
    onClose();
  };

  const isPostDisabled = !text && images.length === 0;

  return (
    <div className="p-4 flex flex-col h-full relative"> {/* relative is important for picker */}
      <div className="flex space-x-3 mb-4 flex-1 overflow-y-auto">
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" className="w-10 h-10 rounded-full shrink-0" />
        <div className="flex-1 flex flex-col">
          {/* Selected Feeling Display */}
          {feeling && (
            <div className="flex items-center space-x-2 text-sm text-gray-700 p-2 mb-4 bg-indigo-50 rounded-lg">
              <Target className="w-4 h-4 text-indigo-600" />
              <span>
                Feeling <span className="font-semibold">{feeling}</span>
              </span>
              <button onClick={() => setFeeling("")} className="text-gray-400 hover:text-red-500 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="আপনার মনে কী চলছে?" 
            className="w-full min-h-[100px] resize-none text-lg placeholder-gray-400 outline-none mb-4"
            autoFocus
          />
          
          {/* Image Preview & Reorder Area */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {images.map((img, index) => (
                <div 
                  key={index} 
                  className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-move border-2 border-transparent hover:border-indigo-300 transition-all"
                  draggable
                  onDragStart={() => (dragItem.current = index)}
                  onDragEnter={() => (dragOverItem.current = index)}
                  onDragEnd={handleSort}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <img src={img} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium">
                    <Move className="w-6 h-6" />
                  </div>
                  <button 
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors z-10"
                    title="ছবিটি মুছুন" 
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <span className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full pointer-events-none">
                    {index + 1}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Feeling Picker Dropdown (Conditional Rendering) */}
      {showFeelingPicker && (
        <FeelingPicker 
          onSelect={handleFeelingSelect}
          currentFeeling={feeling}
        />
      )}

      <div className="border-t border-gray-100 pt-3 flex justify-between items-center shrink-0">
        <div className="flex space-x-1">
          {/* Image Upload */}
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            multiple 
            accept="image/*"
            onChange={handleImageUpload}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-indigo-600 transition-colors"
            title="ছবি/ভিডিও যোগ করুন" 
          >
            <ImageIcon className="w-5 h-5"/>
          </button>

          {/* Emoji/Feeling Toggle */}
          <button 
            onClick={() => setShowFeelingPicker(!showFeelingPicker)}
            className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${showFeelingPicker || feeling ? 'text-yellow-500' : 'text-gray-500'}`}
            title="অনুভূতি যোগ করুন" 
          >
            <Smile className="w-5 h-5"/>
          </button>

          {/* Static Location Icon (No functionality as requested) */}
          <button 
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
            title="অবস্থান (বর্তমানে স্ট্যাটিক)" 
          >
            <MapPin className="w-5 h-5"/>
          </button>

          {/* Share/Visibility (Mock) */}
          <button 
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
            title="কার সাথে শেয়ার করবেন" 
          >
            <Share2 className="w-5 h-5"/>
          </button>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={isPostDisabled}
          className="px-6 py-2 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Post
        </button>
      </div>
    </div>
  );
};

const Header = () => (
  <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 px-4 h-16">
    <div className="max-w-4xl mx-auto h-full flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <Share2 className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 hidden sm:block">
          SocialStream
        </h1>
      </div>
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="পোস্ট খুঁজুন..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
          />
        </div>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-4">
        <button className="p-2 hover:bg-gray-100 rounded-full relative">
          <Bell className="w-6 h-6 text-gray-600" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        <div className="w-8 h-8 bg-gradient-to-tr from-yellow-400 to-purple-600 rounded-full p-[2px] cursor-pointer">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" 
            alt="Profile" 
            className="w-full h-full rounded-full bg-white object-cover"
          />
        </div>
      </div>
    </div>
  </header>
);

// New Component for Post Meta Information
const PostMeta = ({ feeling, location }) => {
  const [feelingEmoji, ...feelingTextArr] = feeling ? feeling.split(' ') : [null];
  const feelingText = feelingTextArr.join(' ');
  
  if (!feeling && !location) return null;

  return (
    <div className="flex items-center space-x-2 text-xs text-gray-500 mt-0.5">
      {feeling && (
        <span className="flex items-center gap-1">
          <span className="text-base leading-none">{feelingEmoji}</span>
          Feeling <span className="font-semibold text-gray-700">{feelingText}</span>
          {location && <span className="text-gray-400 mx-1">•</span>}
        </span>
      )}
      {location && (
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-red-500" />
          in <span className="font-semibold text-gray-700">{location}</span>
        </span>
      )}
    </div>
  );
};


const Post = ({ post, onLike, onSave, onOpenLikes, onOpenComments }) => {
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };
    if (showOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showOptions]);

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden transition-shadow hover:shadow-md relative">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer">
          <div className="relative">
            <img 
              src={post.user.avatar} 
              alt={post.user.name} 
              className="w-10 h-10 rounded-full bg-gray-100 object-cover border border-gray-100"
            />
            {post.user.verified && (
              <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-[2px] rounded-full">
                <svg className="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <h3 className="font-semibold text-gray-900 hover:underline">{post.user.name}</h3>
              <span className="text-gray-500 text-sm">{post.user.handle}</span>
            </div>
            
            <PostMeta feeling={post.content.feeling} location={post.content.location} />
            
            <p className="text-xs text-gray-400 mt-0.5">{post.timestamp}</p>
          </div>
        </div>

        {/* 3 Dot Menu */}
        <div className="relative" ref={optionsRef}>
          <button 
            onClick={() => setShowOptions(!showOptions)}
            className={`p-2 rounded-full transition-colors ${showOptions ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
            title="অপশন" 
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
          
          {/* Options Dropdown */}
          {showOptions && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                <Bookmark className="w-4 h-4" /> <span>পোস্ট সেভ করুন</span> 
              </button>
              <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                <LinkIcon className="w-4 h-4" /> <span>লিংক কপি করুন</span> 
              </button>
              <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                <UserMinus className="w-4 h-4" /> <span>@{post.user.handle.replace('@','')} কে আনফলো করুন</span> 
              </button>
              <div className="h-px bg-gray-100 my-1"></div>
              <button className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2">
                <Flag className="w-4 h-4" /> <span>পোস্ট রিপোর্ট করুন</span> 
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-2">
        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed mb-3">
          {post.content.text}
        </p>
      </div>

      {post.content.images && post.content.images.length > 0 && (
        <div 
          className="w-full bg-gray-100 cursor-pointer overflow-hidden" 
          onClick={() => onOpenComments(post.id)}
        >
          {post.content.images.length === 1 ? (
             <div className="aspect-video relative">
               <img 
                 src={post.content.images[0]} 
                 alt="Post content" 
                 className="w-full h-full object-cover"
               />
             </div>
          ) : (
            <div className={`grid gap-1 ${post.content.images.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
              {post.content.images.slice(0, 4).map((img, idx) => (
                <div key={idx} className="aspect-square relative">
                  <img src={img} className="w-full h-full object-cover" />
                  {idx === 3 && post.content.images.length > 4 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-xl">
                      +{post.content.images.length - 4}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Stats Bar */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-50">
        <button 
          onClick={() => onOpenLikes(post.id)}
          className="text-sm text-gray-500 hover:text-gray-900 hover:underline cursor-pointer flex items-center gap-1"
        >
          <span className="font-semibold">{post.stats.likes}</span> likes
        </button>
        <div className="flex space-x-3 text-sm text-gray-500">
          <button onClick={() => onOpenComments(post.id)} className="hover:text-gray-900 hover:underline cursor-pointer">
            <span className="font-semibold">{post.stats.comments}</span> comments
          </button>
          <button className="hover:text-gray-900 hover:underline cursor-pointer">
            <span className="font-semibold">{post.stats.shares}</span> shares
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-2 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <ActionButton 
            active={post.isLiked} 
            activeColor="text-red-500" 
            icon={Heart} 
            onClick={() => onLike(post.id)}
            label="Like"
          />
          <ActionButton 
            active={false} 
            activeColor="text-blue-500" 
            icon={MessageCircle} 
            onClick={() => onOpenComments(post.id)} 
            label="Comment"
          />
          <ActionButton 
            active={false} 
            activeColor="text-green-500" 
            icon={Send} 
            onClick={() => {}}
            label="Share"
          />
        </div>
        <ActionButton 
          active={post.isSaved} 
          activeColor="text-blue-600" 
          icon={Bookmark} 
          onClick={() => onSave(post.id)}
          label="Save"
        />
      </div>
    </article>
  );
};


// --- Custom Hooks ---

// Modal state logic centralized
const useModal = () => {
   const [activeModal, setActiveModal] = useState(null); // 'likes', 'comments', 'create'
   const [activePostId, setActivePostId] = useState(null);

   const openModal = (modalType, postId = null) => {
      setActiveModal(modalType);
      setActivePostId(postId);
   };

   const closeModal = () => {
      setActiveModal(null);
      setActivePostId(null);
   };

   return { activeModal, activePostId, openModal, closeModal };
};
   

function Home() {
   
  const [posts, setPosts] = useState(initialPosts);
  const { activeModal, activePostId, openModal, closeModal } = useModal();
  
  const getActivePost = () => posts.find(p => p.id === activePostId);

  const handleLike = (id) => {
    setPosts(posts.map(post => {
      if (post.id === id) {
        return {
          ...post,
          isLiked: !post.isLiked,
          stats: {
            ...post.stats,
            likes: post.isLiked ? post.stats.likes - 1 : post.stats.likes + 1
          }
        };
      }
      return post;
    }));
  };

  const handleSave = (id) => {
    setPosts(posts.map(post => {
      if (post.id === id) {
        return { ...post, isSaved: !post.isSaved };
      }
      return post;
    }));
  };

  const handleCreatePost = (text, images, feeling, location) => {
    const newPost = {
      id: Date.now(),
      user: {
        name: "Current User",
        handle: "@user",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=User",
        verified: false
      },
      content: {
        text: text,
        images: images,
        feeling: feeling || null, 
        location: location || null 
      },
      stats: { likes: 0, comments: 0, shares: 0 },
      timestamp: "Just now",
      isLiked: false,
      isSaved: false
    };
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      
      <main className="pt-20 pb-10 px-4">
        <div className="max-w-xl mx-auto">
          {/* Create Post Input Trigger */}
          <div 
            onClick={() => openModal('create')}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="flex space-x-3 pointer-events-none">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" 
                alt="Current User" 
                className="w-10 h-10 rounded-full bg-gray-100"
              />
              <div className="flex-1">
                <div className="w-full py-2 px-2 text-gray-500 bg-transparent">
                  আপনার মনে কী চলছে?
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 pointer-events-none">
              <div className="flex space-x-2">
                <div className="p-2 text-gray-500 rounded-full"><ImageIcon className="w-5 h-5" /></div>
                <div className="p-2 text-gray-500 rounded-full"><Smile className="w-5 h-5" /></div>
              </div>
              <div className="px-4 py-1.5 bg-indigo-600 text-white font-medium rounded-full text-sm shadow-sm">
                Post
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            {posts.map(post => (
              <Post 
                key={post.id} 
                post={post} 
                onLike={handleLike}
                onSave={handleSave}
                onOpenLikes={() => openModal('likes', post.id)}
                onOpenComments={() => openModal('comments', post.id)}
              />
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">সব দেখা হয়ে গেছে!</p>
          </div>
        </div>
      </main>

      {/* MODALS */}
      
      {/* Likes Modal */}
      <Modal 
        isOpen={activeModal === 'likes'} 
        onClose={closeModal} 
        title="Likes"
      >
        <LikesModalContent />
      </Modal>

      {/* Comments Modal */}
      <Modal 
        isOpen={activeModal === 'comments'} 
        onClose={closeModal} 
        title="Comments"
      >
        {activePostId && getActivePost() && (
          <CommentsModalContent post={getActivePost()} />
        )}
      </Modal>

      {/* Create Post Modal */}
      <Modal 
        isOpen={activeModal === 'create'} 
        onClose={closeModal} 
        title="একটি নতুন পোস্ট তৈরি করুন" 
      >
        <CreatePostModalContent onClose={closeModal} onPost={handleCreatePost} />
      </Modal>

    </div>

   )
}

export default Home