import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import 'dotenv/config';
import { GenreType, MediaStatus, MediaType } from "@prisma/client";

/**
 * Prisma 7+ with custom output paths requires an adapter for PostgreSQL
 */
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

     

const prisma = new PrismaClient({ adapter })

     


const TMDB_BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YTQ5Y2I0ODRiYTE4ZjUzYmY5MTBiNTg2ZTFlODU4OSIsIm5iZiI6MTYyMjQwNzYwMi4wMjcsInN1YiI6IjYwYjNmOWIyYWJmOGUyMDAyYmRhMWRmZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ixH4tVwZjRV6EX0p3bI3ZtNL15mxomUknidiiaueMwY';

const BASE_URL = 'https://api.themoviedb.org/3';

const query="action"


import dns from 'node:dns';

// CRITICAL: Force Node.js to prefer IPv4.
// This fixes 90% of "fetch failed" errors in local Node environments.
dns.setDefaultResultOrder('ipv4first');

async function fetchTMDB(endpoint: string, retries = 3): Promise<any> {
  const url = `${BASE_URL}${endpoint}`;

  for (let i = 0; i < retries; i++) {
    try {
      console.log(`[TMDB] Fetching: ${url} (Attempt ${i + 1}/${retries})`);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${TMDB_BEARER_TOKEN}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        // Using a standard timeout signal
        signal: AbortSignal.timeout(15000),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorBody}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error(`--- [TMDB ERROR] Attempt ${i + 1} Failed ---`);

      // Log the specific internal error code (e.g., ECONNREFUSED, ENOTFOUND)
      if (error.cause) {
        console.error('Cause:', error.cause.code || error.cause);
      } else {
        console.error('Message:', error.message);
      }

      if (i === retries - 1) throw error;

      // Exponential backoff
      const waitTime = 2000 * (i + 1);
      console.log(`Retrying in ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}

async function seedPage(pageNumber: number) {
  console.log(`--- Seeding Page ${pageNumber} ---`);

  try {
    // 1. Fetch Keywords for "action"
    const keywordData = await fetchTMDB(`/search/keyword?query=${query}&page=${pageNumber}`);
    const keywords = keywordData.results || [];

    if (keywords.length === 0) {
      console.log(`No keywords found on page ${pageNumber}`);
      return;
    }

    for (const kw of keywords) {
      console.log(`Processing keyword: ${kw.name} (ID: ${kw.id})`);

      try {
        // 2. Fetch movies for the specific keyword
        const movieData = await fetchTMDB(`/keyword/${kw.id}/movies?include_adult=false&language=en-US&page=1`);
        const movies = movieData.results || [];

        console.log(`  Found ${movies.length} movies for keyword "${kw.name}"`);

        for (const movie of movies) {
          try {
            const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 0;

            await db.client.media.upsert({
              where: { id: movie.id.toString() },
              update: {},
              create: {
                id: movie.id.toString(),
                title: movie.title,
                description: movie.overview || 'No description available.',
                thumbnail: movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : 'https://via.placeholder.com/500x750',
                duration: 120, // Default since search doesn't provide runtime
                releaseYear: releaseYear,
                type: MediaType.MOVIE,
                status: MediaStatus.PUBLISHED,
                rating: movie.vote_average || 0,
                reviewCount: movie.vote_count || 0,
                genres: {
                  create: movie.genre_ids?.map((gId: number) => ({
                    genre: {
                      connectOrCreate: {
                        where: { name: `Genre-${gId}` },
                        create: {
                          name: `Genre-${gId}`,
                          type: GenreType.MOVIE
                        }
                      }
                    }
                  })) || []
                }
              }
            });
            console.log(`    ✓ Seeded: ${movie.title}`);
          } catch (error) {
            console.error(`    ✗ Failed to seed movie "${movie.title}":`, error instanceof Error ? error.message : error);
          }
        }
      } catch (error) {
        console.error(`  Failed to fetch movies for keyword "${kw.name}":`, error instanceof Error ? error.message : error);
        continue;
      }
    }
  } catch (error) {
    console.error(`Failed to fetch keywords for page ${pageNumber}:`, error instanceof Error ? error.message : error);
    throw error;
  }
}

async function main() {
  try {
    // Seed Page 1 first
    await seedPage(1);

    // Then Seed Page 2
    await seedPage(2);

    console.log('--- All Seeding Finished Successfully ---');
  } catch (error) {
    console.error('Seed Error:', error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
