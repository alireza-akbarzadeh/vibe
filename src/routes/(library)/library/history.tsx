import { createFileRoute } from '@tanstack/react-router'
import { History, Info, Play, Search, Trash2, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Typography } from "@/components/ui/typography"
import { mockPodcasts, mockTracks, mockVideos } from '@/domains/library/library-mock-data'
import { libraryActions } from '@/domains/library/store/library-actions'
import { appStore, useLibraryStore } from "@/domains/library/store/library-store"
import { cn } from "@/lib/utils"

export const Route = createFileRoute('/(library)/library/history')({
  component: RouteComponent,
})

function RouteComponent() {
  const [searchQuery, setSearchQuery] = useState('')

  const historyIds = useLibraryStore((state) => state.history)

  const filteredHistory = useMemo(() => {
    const allItems = [
      ...mockVideos.filter(v => historyIds.videos.includes(String(v.id))).map(v => ({ ...v, type: 'Video' as const })),
      ...mockTracks.filter(t => historyIds.tracks.includes(t.id)).map(t => ({ ...t, type: 'Track' as const })),
      ...mockPodcasts.filter(p => historyIds.podcasts.includes(p.id)).map(p => ({ ...p, type: 'Podcast' as const }))
    ]

    if (!searchQuery) return allItems

    return allItems.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ('channel' in item && item.channel.toLowerCase().includes(searchQuery.toLowerCase())) ||
      ('artist' in item && item.artist.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [historyIds, searchQuery])

  // 2. Action Handlers
  const handleClearAll = () => {
    if (confirm("Permanently wipe all playback logs?")) {
      appStore.setState((state) => ({
        ...state,
        history: { tracks: [], videos: [], blogs: [], podcasts: [] }
      }))
    }
  }

  const handleRemoveItem = (type: string, id: string) => {
    const key = (type.toLowerCase() + 's') as 'tracks' | 'videos' | 'podcasts'
    appStore.setState((state) => ({
      ...state,
      history: {
        ...state.history,
        [key]: state.history[key].filter(itemId => itemId !== id)
      }
    }))
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-16">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-zinc-500">
            <History size={20} />
            <Typography.S className="font-black uppercase tracking-[0.4em] text-[10px]">Registry Logs</Typography.S>
          </div>
          <Typography.H1 className="text-7xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8] italic">
            Playback <span className="text-zinc-800 not-italic">History</span>
          </Typography.H1>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
            <Input
              placeholder="SEARCH LOGS..."
              className="bg-zinc-900/40 border-white/5 pl-11 rounded-full text-[10px] font-black uppercase tracking-widest focus-visible:ring-primary/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            onClick={handleClearAll}
            variant="destructive"
            size="icon"
            className="rounded-full size-12 shrink-0 bg-zinc-900 hover:bg-red-600/20 text-red-500 border border-white/5"
          >
            <Trash2 size={18} />
          </Button>
        </div>
      </header>

      <div className="space-y-12">
        {filteredHistory.length > 0 ? (
          <div className="grid gap-2">
            <TimeDivider label="Stored Logs" />
            {filteredHistory.map((item) => (
              <HistoryItem
                key={`${item.type}-${item.id}`}
                type={item.type}
                title={item.title}
                meta={'channel' in item ? item.channel : item.artist}
                time="RECENT"
                image={'poster_path' in item ? item.poster_path : item.cover}
                progress={item.duration}
                onPlay={() => {
                  if (item.type === 'Track') libraryActions.playTrack(item)
                  if (item.type === 'Podcast') libraryActions.playPodcast(item)
                }}
                onRemove={() => handleRemoveItem(item.type, String(item.id))}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-dashed border-white/5 rounded-[3rem]">
            <Typography.P className="text-zinc-600 font-black uppercase tracking-[0.4em] text-xs">
              No entries found in current registry
            </Typography.P>
          </div>
        )}
      </div>
    </div>
  )
}

function TimeDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-6 mb-4">
      <Typography.S className="font-black uppercase tracking-[0.5em] text-xs text-primary whitespace-nowrap">
        {label}
      </Typography.S>
      <div className="h-px w-full bg-white/5" />
    </div>
  )
}

function HistoryItem({ type, title, meta, time, image, progress, onPlay, onRemove }: {
  type: 'Video' | 'Track' | 'Podcast',
  title: string,
  meta: string,
  time: string,
  image: string,
  progress?: number,
  onPlay: () => void,
  onRemove: () => void
}) {
  return (
    <div className="group flex items-center gap-6 p-4 rounded-2xl hover:bg-zinc-900/40 transition-all border border-transparent hover:border-white/5">
      <div
        onClick={onPlay}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault()
            onPlay()
          }
        }}
        className={cn(
          "relative shrink-0 overflow-hidden bg-zinc-900 cursor-pointer",
          type === 'Video' ? "aspect-video w-32 md:w-40 rounded-xl" : "size-16 md:size-20 rounded-lg"
        )}
      >
        <img src={image} alt={title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
          <Play size={24} fill="white" className="text-white" />
        </div>
        {progress && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
            <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Typography.S className="text-[9px] font-black uppercase tracking-widest text-zinc-500">{type}</Typography.S>
          <div className="size-1 rounded-full bg-zinc-800" />
          <Typography.S className="text-[9px] font-black uppercase tracking-widest text-zinc-500">{time}</Typography.S>
        </div>
        <Typography.H4 className="text-sm md:text-base font-bold truncate group-hover:text-primary transition-colors cursor-pointer" onClick={onPlay}>
          {title}
        </Typography.H4>
        <Typography.P className="text-[10px] md:text-xs uppercase font-bold text-zinc-600 truncate mt-1">
          {meta}
        </Typography.P>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 text-zinc-500">
          <Info size={16} />
        </Button>
        <Button
          onClick={onRemove}
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-red-500/10 text-zinc-500 hover:text-red-500"
        >
          <X size={16} />
        </Button>
      </div>
    </div>
  )
}