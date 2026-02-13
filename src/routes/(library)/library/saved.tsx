import { createFileRoute } from '@tanstack/react-router'
import { Bookmark, Clock, FileText, Mic, Music, Play, Tv } from 'lucide-react'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { mockBlogs, mockPodcasts, mockTracks, mockVideos } from '@/domains/library/library-mock-data'
import { cn } from "@/lib/utils"

export const Route = createFileRoute('/(library)/library/saved')({
  component: RouteComponent,
})

type FilterType = 'all' | 'music' | 'video' | 'podcast' | 'blog'

function RouteComponent() {
  const [filter, setFilter] = useState<FilterType>('all')

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-16">
      {/* Header Section */}
      <header className="flex flex-col gap-4 mb-16">
        <div className="flex items-center gap-3 text-primary">
          <Bookmark size={24} fill="currentColor" />
          <Typography.S className="font-black uppercase tracking-[0.3em] text-xs">Library Registry</Typography.S>
        </div>
        <Typography.H1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase italic leading-[0.8]">
          Saved <span className="text-zinc-800 text-6xl md:text-8xl not-italic">Items</span>
        </Typography.H1>
      </header>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-12 border-b border-white/5 pb-8">
        <FilterButton active={filter === 'all'} onClick={() => setFilter('all')} label="All" count={26} />
        <FilterButton active={filter === 'music'} onClick={() => setFilter('music')} label="Music" icon={<Music size={14} />} />
        <FilterButton active={filter === 'video'} onClick={() => setFilter('video')} label="Movies & TV" icon={<Tv size={14} />} />
        <FilterButton active={filter === 'podcast'} onClick={() => setFilter('podcast')} label="Podcasts" icon={<Mic size={14} />} />
        <FilterButton active={filter === 'blog'} onClick={() => setFilter('blog')} label="Articles" icon={<FileText size={14} />} />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">

        {/* Render Videos */}
        {(filter === 'all' || filter === 'video') && mockVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}

        {/* Render Music Tracks */}
        {(filter === 'all' || filter === 'music') && mockTracks.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}

        {/* Render Podcasts */}
        {(filter === 'all' || filter === 'podcast') && mockPodcasts.map((podcast) => (
          <PodcastCard key={podcast.id} podcast={podcast} />
        ))}

        {/* Render Blogs */}
        {(filter === 'all' || filter === 'blog') && mockBlogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  )
}

/**
 * ATOMIC COMPONENTS
 */

function FilterButton({ label, active, onClick, icon, count }: { label: string, active: boolean, onClick: () => void, icon?: React.ReactNode, count?: number }) {
  return (
    <Button
      variant={active ? "default" : "ghost"}
      onClick={onClick}
      className={cn(
        "rounded-full px-6 font-black uppercase tracking-widest text-[10px] h-10 transition-all",
        active ? "bg-primary text-black" : "text-zinc-500 hover:text-white"
      )}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
      {count && <span className="ml-2 opacity-50">{count}</span>}
    </Button>
  )
}

function VideoCard({ video }: { video: any }) {
  return (
    <div className="group cursor-pointer space-y-4">
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-900">
        <img src={video.poster_path} alt={video.title} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 opacity-80" />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
        <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold">
          {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
        </div>
        {video.progress > 0 && (
          <div className="absolute bottom-0 left-0 h-1 bg-primary transition-all" style={{ width: `${video.progress}%` }} />
        )}
      </div>
      <div>
        <Typography.S className="text-[10px] font-black uppercase tracking-widest text-primary mb-1 block">Video</Typography.S>
        <Typography.H4 className="text-sm font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">{video.title}</Typography.H4>
        <Typography.P className="text-[10px] uppercase font-bold text-zinc-600 mt-2">{video.channel} • {video.year}</Typography.P>
      </div>
    </div>
  )
}

function TrackCard({ track }: { track: any }) {
  return (
    <div className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all">
      <div className="size-16 shrink-0 rounded-lg overflow-hidden relative">
        <img src={track.cover} alt={track.title} className="object-cover w-full h-full" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
          <Play size={20} fill="white" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <Typography.S className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-0.5">Track</Typography.S>
        <Typography.H4 className="text-sm font-bold truncate">{track.title}</Typography.H4>
        <Typography.P className="text-[10px] uppercase font-bold text-zinc-600 truncate">{track.artist}</Typography.P>
      </div>
      <Clock size={14} className="text-zinc-800 group-hover:text-zinc-500 transition-colors" />
    </div>
  )
}

function PodcastCard({ podcast }: { podcast: any }) {
  return (
    <div className="group border border-white/5 bg-zinc-950/30 p-4 rounded-3xl hover:border-primary/30 transition-all">
      <div className="flex gap-4 mb-4">
        <img src={podcast.cover} alt={podcast.title} className="size-20 rounded-xl object-cover" />
        <div className="flex flex-col justify-center">
          <Typography.S className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1">Episode</Typography.S>
          <Typography.H4 className="text-xs font-black uppercase leading-tight line-clamp-2">{podcast.title}</Typography.H4>
        </div>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <Typography.P className="text-[9px] font-bold uppercase text-zinc-500">{podcast.show}</Typography.P>
        <Button size="icon-xs" variant="ghost" className="rounded-full bg-white/5 hover:bg-primary hover:text-black">
          <Play size={10} fill="currentColor" />
        </Button>
      </div>
    </div>
  )
}

function BlogCard({ blog }: { blog: any }) {
  return (
    <div className="group space-y-4">
      <div className="h-40 rounded-2xl overflow-hidden bg-zinc-900 border border-white/5">
        <img src={blog.cover} alt={blog.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
      </div>
      <div className="px-1">
        <div className="flex items-center gap-2 mb-2">
          <Typography.S className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">Article</Typography.S>
          <div className="size-1 rounded-full bg-zinc-800" />
          <Typography.S className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">{blog.readTime} MIN READ</Typography.S>
        </div>
        <Typography.H4 className="text-sm font-bold leading-snug line-clamp-2">{blog.title}</Typography.H4>
      </div>
    </div>
  )
}