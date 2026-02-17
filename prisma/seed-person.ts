import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import 'dotenv/config';
import { setGlobalDispatcher, Agent } from 'undici';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Increase connection timeout
setGlobalDispatcher(new Agent({
  connect: {
    timeout: 60000,
  },
  bodyTimeout: 60000,
}));


// Initialize Prisma Client
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

// TMDB Configuration
const TMDB_BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YTQ5Y2I0ODRiYTE4ZjUzYmY5MTBiNTg2ZTFlODU4OSIsIm5iZiI6MTYyMjQwNzYwMi4wMjcsInN1YiI6IjYwYjNmOWIyYWJmOGUyMDAyYmRhMWRmZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ixH4tVwZjRV6EX0p3bI3ZtNL15mxomUknidiiaueMwY';
const BASE_URL = 'https://api.themoviedb.org/3';

// Setup DNS for fetch compatibility
// import dns from 'node:dns';
// dns.setDefaultResultOrder('ipv4first');

// Helper to fetch from TMDB using curl (fallback for restricted networks)
async function fetchWithCurl(url: string): Promise<any> {
  // Use curl with -k (insecure) to bypass potential SSL certificate issues in corporate proxies
  // Use --fail to return non-zero exit code on HTTP errors
  const cmd = `curl -s -k --fail "${url}" -H "Authorization: Bearer ${TMDB_BEARER_TOKEN}" -H "Accept: application/json"`;
  
  try {
    const { stdout } = await execAsync(cmd);
    return JSON.parse(stdout);
  } catch (error: any) {
    throw new Error(`Curl failed: ${error.message}`);
  }
}

// Helper to fetch from TMDB
async function fetchTMDB(endpoint: string, retries = 3): Promise<any> {
  const url = `${BASE_URL}${endpoint}`;

  for (let i = 0; i < retries; i++) {
    try {
      console.log(`[TMDB] Fetching: ${url} (Attempt ${i + 1}/${retries})`);

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${TMDB_BEARER_TOKEN}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          signal: AbortSignal.timeout(10000), // Short timeout for fetch
        });

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorBody}`);
        }

        return await response.json();
      } catch (fetchError) {
        console.warn(`[TMDB] Fetch failed, trying curl fallback...`);
        return await fetchWithCurl(url);
      }
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

const MOCK_DATA_TOM_HANKS = {
  id: 31,
  name: "Tom Hanks",
  popularity: 100.5,
  profile_path: "/xndWFsBlClOJFRdhDc4JDtZoRPh.jpg",
  known_for_department: "Acting",
  adult: false,
  gender: 2,
  original_name: "Tom Hanks",
  known_for: [
    {
      id: 13,
      title: "Forrest Gump",
      original_title: "Forrest Gump",
      media_type: "movie",
      release_date: "1994-07-06",
      poster_path: "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
      backdrop_path: "/7c9UVPPiTPltouxRVY6N9uugaVA.jpg",
      overview: "A man with a low IQ has accomplished great things in his life and been present during significant historical events—in each case, far exceeding what anyone imagined he could do. Yet despite all he has achieved, his one true love eludes him.",
      vote_average: 8.5,
      vote_count: 26000,
      popularity: 100.0,
      genre_ids: [35, 18, 10749]
    },
    {
      id: 36,
      title: "Cast Away",
      original_title: "Cast Away",
      media_type: "movie",
      release_date: "2000-12-22",
      poster_path: "/4Iu5f2nv7huqvuYkmPlSZZTEIbZ.jpg",
      backdrop_path: "/p7th71u3B9f4F9kK7k3y2V3f2w.jpg",
      overview: "Chuck Noland is a FedEx systems engineer whose ruled by the clock. His fast-paced career takes him to offices around the world, but his personal life is suffering. A business trip turns into a disaster when his plane crashes into the Pacific Ocean, leaving him stranded on a deserted island.",
      vote_average: 7.7,
      vote_count: 11000,
      popularity: 60.0,
      genre_ids: [12, 18]
    },
    {
      id: 857,
      title: "Saving Private Ryan",
      original_title: "Saving Private Ryan",
      media_type: "movie",
      release_date: "1998-07-24",
      poster_path: "/uqx37cS8cpzv8UHEVs8U6qWakRf.jpg",
      backdrop_path: "/hZkgoQYus5vegHoetLkCJzb17zJ.jpg",
      overview: "As U.S. troops storm the beaches of Normandy, three brothers lie dead on the battlefield, with a fourth trapped behind enemy lines. Ranger captain John Miller and seven men are tasked with penetrating German-held territory and bringing the boy home.",
      vote_average: 8.2,
      vote_count: 15000,
      popularity: 55.0,
      genre_ids: [18, 36, 10752]
    }
  ]
};

// Function to seed a person by name
async function seedPerson(name: string) {
  console.log(`\n--- Seeding Person: ${name} ---`);

  let personData;
  try {
    // 1. Search for the person
    const searchData = await fetchTMDB(`/search/person?query=${encodeURIComponent(name)}&include_adult=false&language=en-US&page=1`);
    const results = searchData.results || [];

    if (results.length === 0) {
      console.log(`No results found for "${name}"`);
      return;
    }

    // We'll take the first result as the primary match
    personData = results[0];
    console.log(`Found: ${personData.name} (ID: ${personData.id})`);
  } catch (error) {
    console.error(`Failed to fetch person "${name}":`, error instanceof Error ? error.message : error);
    
    if (name.toLowerCase() === "tom hanks") {
      console.log("⚠️ Network failed. Using MOCK DATA for Tom Hanks.");
      personData = MOCK_DATA_TOM_HANKS;
    } else {
      return;
    }
  }

  try {
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

  } catch (error: any) {
    console.error(`Failed to seed person "${name}":`, error);
  }
}

// Main execution
async function main() {
  const actorsToSeed = [
  "Tom Cruise",
  "Leonardo DiCaprio",
  "Brad Pitt",
  "Robert Downey Jr.",
  "Denzel Washington",
  "Morgan Freeman",
  "Matt Damon",
  "Johnny Depp",
  "Keanu Reeves",
  "Will Smith",
  "Chris Hemsworth",
  "Chris Evans",
  "Scarlett Johansson",
  "Angelina Jolie",
  "Jennifer Lawrence",
  "Natalie Portman",
  "Meryl Streep",
  "Tom Hanks",
  "Christian Bale",
  "Hugh Jackman",
  "Ryan Reynolds",
  "Anne Hathaway",
  "Samuel L. Jackson",
  "George Clooney",
  "Robert De Niro",
  "Al Pacino",
  "Julia Roberts",
  "Charlize Theron",
  "Benedict Cumberbatch",
  "Zendaya"
]

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
