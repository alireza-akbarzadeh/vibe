import { useState } from 'react';
import { BottomPlayer } from '../components/bottom-plyaer';
import { LibraryView } from '../components/library-view';
import { Sidebar } from '../components/sidebar';


export function Library() {
  const [currentSong, setCurrentSong] = useState({
    id: 1,
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    albumArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=80",
    duration: 245,
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  return (
    <div className="h-screen bg-black flex flex-col overflow-hidden">
      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main view */}
        <div className="flex-1 overflow-y-auto pb-24">
          <LibraryView />
        </div>
      </div>

      {/* Bottom player */}
      <BottomPlayer
        currentSong={currentSong}
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        currentTime={currentTime}
        onTimeChange={setCurrentTime}
      />
    </div>
  );
}