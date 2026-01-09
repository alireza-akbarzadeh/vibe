import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import { SearchHeader } from '@/domains/movies/components';
import { MovieCard } from '@/domains/movies/components/movie-card';
import { allMovies } from '@/domains/movies/data';

export const Route = createFileRoute('/explore/$section')({
  component: RouteComponent,
  loader: () => allMovies
})


function RouteComponent() {
  const movies = Route.useLoaderData()
  const [searchQuery, setSearchQuery] = useState("");
  const flatMovies = movies.flatMap((item) => item)
  return (
    <div
      className="min-h-screen bg-[#0a0a0a] relative overflow-hidden"
    >
      <SearchHeader title='explore' searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-30'>
        {flatMovies?.map((movie, index) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            index={index}
            showProgress={true}
            variant={"featured"}
          />
        ))}
      </div>
    </div>
  )
}
