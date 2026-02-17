import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import 'dotenv/config';

// Initialize Prisma Client
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

// TMDB Configuration
const TMDB_BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YTQ5Y2I0ODRiYTE4ZjUzYmY5MTBiNTg2ZTFlODU4OSIsIm5iZiI6MTYyMjQwNzYwMi4wMjcsInN1YiI6IjYwYjNmOWIyYWJmOGUyMDAyYmRhMWRmZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ixH4tVwZjRV6EX0p3bI3ZtNL15mxomUknidiiaueMwY';
const BASE_URL = 'https://api.themoviedb.org/3';

// Setup DNS for fetch compatibility
import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

// Helper to fetch from TMDB
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
        signal: AbortSignal.timeout(15000),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorBody}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error(`--- [TMDB ERROR] Attempt ${i + 1} Failed ---`);
      if (i === retries - 1) throw error;
// Exponential backoff
      const waitTime = 5000 * (i + 1);
      console.log(`Retrying in ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}

// Function to seed a person by name
async function seedPerson(name: string) {
  console.log(`\n--- Seeding Person: ${name} ---`);

  try {
    // 1. Search for the person
    const searchData = await fetchTMDB(`/search/person?query=${encodeURIComponent(name)}&include_adult=false&language=en-US&page=1`);
    const results = searchData.results || [];

    if (results.length === 0) {
      console.log(`No results found for "${name}"`);
      return;
    }

    // We'll take the first result as the primary match
    const personData = results[0];
    console.log(`Found: ${personData.name} (ID: ${personData.id})`);

    // 2. Upsert Person
    const person = await prisma.person.upsert({
      where: { tmdbId: personData.id },
      update: {
        name: personData.name,
        popularity: personData.popularity,
        profilePath: personData.profile_path,
        knownForDepartment: personData.known_for_department,
        adult: personData.adult,
        gender: personData.gender,
        originalName: personData.original_name,
      },
      create: {
        tmdbId: personData.id,
        name: personData.name,
        popularity: personData.popularity,
        profilePath: personData.profile_path,
        knownForDepartment: personData.known_for_department,
        adult: personData.adult,
        gender: personData.gender,
        originalName: personData.original_name,
      },
    });

    console.log(`✓ Upserted Person: ${person.name}`);

    // 3. Upsert KnownFor items
    if (personData.known_for && personData.known_for.length > 0) {
      console.log(`Processing ${personData.known_for.length} "Known For" items...`);

      for (const item of personData.known_for) {
        // Prepare data for KnownFor
        // Note: TMDB "known_for" items can be movies or TV shows.
        // The schema has specific fields.
        
        const knownForData = {
          tmdbId: item.id,
          personId: person.id,
          mediaType: item.media_type || 'unknown',
          title: item.title || item.name || 'Untitled',
          originalTitle: item.original_title || item.original_name,
          posterPath: item.poster_path,
          backdropPath: item.backdrop_path,
          overview: item.overview,
          releaseDate: item.release_date || item.first_air_date ? new Date(item.release_date || item.first_air_date) : null,
          voteAverage: item.vote_average,
          voteCount: item.vote_count,
          popularity: item.popularity,
          adult: item.adult || false,
          video: item.video || false,
          originalLanguage: item.original_language,
          genreIds: item.genre_ids ? JSON.stringify(item.genre_ids) : '[]',
        };

        await prisma.knownFor.upsert({
          where: {
            personId_tmdbId: {
              personId: person.id,
              tmdbId: item.id,
            },
          },
          update: knownForData,
          create: knownForData,
        });
      }
      console.log(`✓ Synced "Known For" items`);
    }

  } catch (error) {
    console.error(`Failed to seed person "${name}":`, error);
  }
}

// Main execution
async function main() {
  const actorsToSeed = ["Tom Hanks"]; // Add more names here if needed

  for (const actor of actorsToSeed) {
    await seedPerson(actor);
  }
  
  console.log('\n--- Seeding Finished ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
