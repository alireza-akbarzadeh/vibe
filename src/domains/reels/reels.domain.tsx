import { motion } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import CommentModal from './components/reel-comment';
import { VideoCard } from './components/reels-video-card';


export function ReelsDomain() {
    const [activeTab, setActiveTab] = useState('foryou');
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [commentModalOpen, setCommentModalOpen] = useState(false);
    const [activeVideoId, setActiveVideoId] = useState(null);
    const [isMuted, setIsMuted] = useState(true);
    const containerRef = useRef(null);

    // Sample video data - replace with API call
    const videos = [
        {
            id: 1,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80',
            user: {
                username: 'creativestudio',
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
                isFollowing: false,
                isVerified: true
            },
            caption: 'Amazing sunset vibes 🌅 #nature #sunset #peaceful',
            likes: 45200,
            comments: 892,
            shares: 234,
            views: 1200000,
            isLiked: false,
            isSaved: false,
            soundName: 'Original Sound - creativestudio',
            soundId: 'sound_123'
        },
        {
            id: 2,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80',
            user: {
                username: 'musicvibes',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
                isFollowing: true,
                isVerified: true
            },
            caption: 'New track dropping soon! 🎵🔥 What do you think?',
            likes: 89300,
            comments: 1523,
            shares: 567,
            views: 2400000,
            isLiked: true,
            isSaved: false,
            soundName: 'Summer Vibes Mix 2026',
            soundId: 'sound_456'
        },
        {
            id: 3,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&q=80',
            user: {
                username: 'travelmore',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
                isFollowing: false,
                isVerified: true
            },
            caption: 'Hidden gems in Bali 🏝️✨ #travel #bali #paradise',
            likes: 123400,
            comments: 2341,
            shares: 890,
            views: 3500000,
            isLiked: false,
            isSaved: true,
            soundName: 'Chill Tropical Beats',
            soundId: 'sound_789'
        },
        {
            id: 4,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80',
            user: {
                username: 'fitlife',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
                isFollowing: false,
                isVerified: false
            },
            caption: 'Morning workout routine 💪 Try this! #fitness #workout #motivation',
            likes: 67800,
            comments: 1124,
            shares: 445,
            views: 890000,
            isLiked: false,
            isSaved: false,
            soundName: 'Workout Motivation Mix',
            soundId: 'sound_101'
        },
        {
            id: 5,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
            user: {
                username: 'foodieheaven',
                avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
                isFollowing: true,
                isVerified: true
            },
            caption: 'Best pizza recipe ever! 🍕👨‍🍳 #food #cooking #pizza',
            likes: 234500,
            comments: 3456,
            shares: 1234,
            views: 5600000,
            isLiked: true,
            isSaved: true,
            soundName: 'Cooking ASMR Sounds',
            soundId: 'sound_202'
        }
    ];

    const [videoData, setVideoData] = useState(videos);

    useEffect(() => {
        const handleScroll = () => {
            if (containerRef.current) {
                const scrollTop = containerRef.current.scrollTop;
                const windowHeight = window.innerHeight;
                const index = Math.round(scrollTop / windowHeight);
                setCurrentVideoIndex(index);
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, []);

    const handleOpenComments = (videoId) => {
        setActiveVideoId(videoId);
        setCommentModalOpen(true);
    };

    const handleLike = (videoId) => {
        setVideoData(prev => prev.map(video =>
            video.id === videoId
                ? {
                    ...video,
                    isLiked: !video.isLiked,
                    likes: video.isLiked ? video.likes - 1 : video.likes + 1
                }
                : video
        ));
    };

    const handleSave = (videoId) => {
        setVideoData(prev => prev.map(video =>
            video.id === videoId
                ? { ...video, isSaved: !video.isSaved }
                : video
        ));
    };

    const handleFollow = (username) => {
        setVideoData(prev => prev.map(video =>
            video.user.username === username
                ? { ...video, user: { ...video.user, isFollowing: !video.user.isFollowing } }
                : video
        ));
    };

    return (
        <div className="relative h-screen w-screen bg-black overflow-hidden">
            {/* Header */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="fixed top-0 left-0 right-0 z-50 px-4 pt-safe"
            >
                <div className="h-16 flex items-center justify-between">
                    {/* Tab selector */}
                    <div className="flex-1 flex items-center justify-center gap-8">
                        <button
                            onClick={() => setActiveTab('following')}
                            className="relative"
                        >
                            <span className={`text-lg font-semibold transition-colors ${activeTab === 'following' ? 'text-white' : 'text-gray-400'
                                }`}>
                                Following
                            </span>
                            {activeTab === 'following' && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white"
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('foryou')}
                            className="relative"
                        >
                            <span className={`text-lg font-semibold transition-colors ${activeTab === 'foryou' ? 'text-white' : 'text-gray-400'
                                }`}>
                                For You
                            </span>
                            {activeTab === 'foryou' && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white"
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                        </button>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-white">
                            <Search className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Video feed */}
            <div
                ref={containerRef}
                className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
                style={{ scrollBehavior: 'smooth' }}
            >
                {videoData.map((video, index) => (
                    <VideoCard
                        key={video.id}
                        video={video}
                        isActive={index === currentVideoIndex}
                        isMuted={isMuted}
                        onToggleMute={() => setIsMuted(!isMuted)}
                        onOpenComments={handleOpenComments}
                        onLike={handleLike}
                        onSave={handleSave}
                        onFollow={handleFollow}
                    />
                ))}
            </div>

            {/* Upload button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-14 h-14 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-pink-500/50"
            >
                <Plus className="w-7 h-7 text-white" />
            </motion.button>

            {/* Comment Modal */}
            <CommentModal
                isOpen={commentModalOpen}
                onClose={() => setCommentModalOpen(false)}
                videoId={activeVideoId}
            />
        </div>
    );
}