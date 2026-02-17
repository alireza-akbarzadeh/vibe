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
  const cmd = `curl -s -k "${url}" -H "Authorization: Bearer ${TMDB_BEARER_TOKEN}" -H "Accept: application/json"`;
  
  try {
    const { stdout, stderr } = await execAsync(cmd);
    if (stderr) console.warn('Curl stderr:', stderr);
    
    // Check if output looks like JSON
    try {
        const data = JSON.parse(stdout);
        // Check for TMDB specific error in JSON even if status was 200
        if (data.status_code && data.status_code !== 1) { // 1 is Success in TMDB
             // Actually TMDB success responses don't always have status_code 1, but errors usually have status_code >= 6
             if (data.success === false) throw new Error(`TMDB API Error: ${data.status_message}`);
        }
        return data;
    } catch (e) {
        console.log('Raw Curl Output:', stdout);
        throw new Error(`Failed to parse JSON from curl output: ${e}`);
    }
  } catch (error: any) {
    throw new Error(`Curl execution failed: ${error.message}`);
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

const MOCK_DATA_TOM_CRUISE = {
  id: 500,
  name: "Tom Cruise",
  popularity: 85.5,
  profile_path: "/8qBylBsQf4llkGrWR3qAsOtOU8O.jpg",
  known_for_department: "Acting",
  adult: false,
  gender: 2,
  original_name: "Tom Cruise",
  known_for: [
    {
      id: 744,
      title: "Top Gun",
      original_title: "Top Gun",
      media_type: "movie",
      release_date: "1986-05-16",
      poster_path: "/6jA97fKTmXrZkOWDbOrOoBvFfOl.jpg",
      backdrop_path: "/jILeJ60zNzIjgHOkHYGgVbcjy3y.jpg",
      overview: "For Lieutenant Pete 'Maverick' Mitchell and his friend and co-pilot Nick 'Goose' Bradshaw, being accepted into an elite fighter school is a dream come true. But a tragedy, as well as personal demons, will threaten Pete's dreams of becoming an ace pilot.",
      vote_average: 7.0,
      vote_count: 6000,
      popularity: 50.0,
      genre_ids: [28, 18]
    },
    {
      id: 954,
      title: "Mission: Impossible",
      original_title: "Mission: Impossible",
      media_type: "movie",
      release_date: "1996-05-22",
      poster_path: "/AhMCxWWrJSllhVOPn2b4gny11rA.jpg",
      backdrop_path: "/4V1yIoAKPMRQwGBaSses8vpqJye.jpg",
      overview: "When Ethan Hunt, the leader of a crack espionage team whose peril-prone section has become known as the Impossible Missions Force, is framed for the death of his espionage team, he must flee from government assassins, breaking into the CIA's most impenetrable vault along the way.",
      vote_average: 6.9,
      vote_count: 7000,
      popularity: 45.0,
      genre_ids: [28, 12, 53]
    },
    {
      id: 33,
      title: "Rain Man",
      original_title: "Rain Man",
      media_type: "movie",
      release_date: "1988-12-16",
      poster_path: "/i0tScULK8o00r7d402j6e86X4Gv.jpg",
      backdrop_path: "/7c9UVPPiTPltouxRVY6N9uugaVA.jpg",
      overview: "Selfish yuppie Charlie Babbitt's father left a fortune to his savant brother Raymond and a pittance to Charlie; they travel cross-country.",
      vote_average: 7.7,
      vote_count: 5000,
      popularity: 30.0,
      genre_ids: [18]
    }
  ]
};

const MOCK_DATA_TOM_HOLLAND = {
  "adult": false,
  "gender": 2,
  "id": 1136406,
  "known_for_department": "Acting",
  "name": "Tom Holland",
  "original_name": "Tom Holland",
  "popularity": 7.4075,
  "profile_path": "/mBGcYEyDjK8oBqvyKwBv0Y88jIe.jpg",
  "known_for": [
    {
      "adult": false,
      "backdrop_path": "/tPpYGm2mVecue7Bk3gNVoSPA5qn.jpg",
      "id": 315635,
      "title": "Spider-Man: Homecoming",
      "original_title": "Spider-Man: Homecoming",
      "overview": "Following the events of Captain America: Civil War, Peter Parker, with the help of his mentor Tony Stark, tries to balance his life as an ordinary high school student in Queens, New York City, with fighting crime as his superhero alter ego Spider-Man as a new threat, the Vulture, emerges.",
      "poster_path": "/c24sv2weTHPsmDa7jEMN0m2P3RT.jpg",
      "media_type": "movie",
      "original_language": "en",
      "genre_ids": [
        28,
        12,
        878
      ],
      "popularity": 25.3687,
      "release_date": "2017-07-05",
      "video": false,
      "vote_average": 7.329,
      "vote_count": 22853
    },
    {
      "adult": false,
      "backdrop_path": "/nqUThBjou0TAWXu93Q4SNFpgqai.jpg",
      "id": 634649,
      "title": "Spider-Man: No Way Home",
      "original_title": "Spider-Man: No Way Home",
      "overview": "Peter Parker is unmasked and no longer able to separate his normal life from the high-stakes of being a super-hero. When he asks for help from Doctor Strange the stakes become even more dangerous, forcing him to discover what it truly means to be Spider-Man.",
      "poster_path": "/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
      "media_type": "movie",
      "original_language": "en",
      "genre_ids": [
        28,
        12,
        878
      ],
      "popularity": 33.0447,
      "release_date": "2021-12-15",
      "video": false,
      "vote_average": 7.932,
      "vote_count": 21571
    },
    {
      "adult": false,
      "backdrop_path": "/34jW8LvjRplM8Pv06cBFDpLlenR.jpg",
      "id": 429617,
      "title": "Spider-Man: Far From Home",
      "original_title": "Spider-Man: Far From Home",
      "overview": "Peter Parker and his friends go on a summer trip to Europe. However, they will hardly be able to rest - Peter will have to agree to help Nick Fury uncover the mystery of creatures that cause natural disasters and destruction throughout the continent.",
      "poster_path": "/4q2NNj4S5dG2RLF9CpXsej7yXl.jpg",
      "media_type": "movie",
      "original_language": "en",
      "genre_ids": [
        28,
        12,
        878
      ],
      "popularity": 18.2835,
      "release_date": "2019-06-28",
      "video": false,
      "vote_average": 7.396,
      "vote_count": 16676
    }
  ]
};

const MOCK_DATA_ANA_DE_ARMAS = {
  "adult": false,
  "gender": 1,
  "id": 224513,
  "known_for_department": "Acting",
  "name": "Ana de Armas",
  "original_name": "Ana de Armas",
  "popularity": 11.6621,
  "profile_path": "/tkBWBvcLTihUcVf6iwbMQTFqEEv.jpg",
  "known_for": [
    {
      "adult": false,
      "backdrop_path": "/ilRyazdMJwN05exqhwK4tMKBYZs.jpg",
      "id": 335984,
      "title": "Blade Runner 2049",
      "original_title": "Blade Runner 2049",
      "overview": "Thirty years after the events of the first film, a new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what's left of society into chaos. K's discovery leads him on a quest to find Rick Deckard, a former LAPD blade runner who has been missing for 30 years.",
      "poster_path": "/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
      "media_type": "movie",
      "original_language": "en",
      "genre_ids": [
        878,
        18
      ],
      "popularity": 26.9012,
      "release_date": "2017-10-04",
      "video": false,
      "vote_average": 7.588,
      "vote_count": 14785
    },
    {
      "adult": false,
      "backdrop_path": "/4HWAQu28e2yaWrtupFPGFkdNU7V.jpg",
      "id": 546554,
      "title": "Knives Out",
      "original_title": "Knives Out",
      "overview": "When renowned crime novelist Harlan Thrombey is found dead at his estate just after his 85th birthday, the inquisitive and debonair Detective Benoit Blanc is mysteriously enlisted to investigate. From Harlan's dysfunctional family to his devoted staff, Blanc sifts through a web of red herrings and self-serving lies to uncover the truth behind Harlan's untimely death.",
      "poster_path": "/pThyQovXQrw2m0s9x82twj48Jq4.jpg",
      "media_type": "movie",
      "original_language": "en",
      "genre_ids": [
        35,
        80,
        9648
      ],
      "popularity": 17.6499,
      "release_date": "2019-11-27",
      "video": false,
      "vote_average": 7.842,
      "vote_count": 13660
    },
    {
      "adult": false,
      "backdrop_path": "/1yktYsxkmUtUFTUnCAUaqG6FEiz.jpg",
      "id": 541671,
      "title": "Ballerina",
      "original_title": "Ballerina",
      "overview": "Taking place during the events of John Wick: Chapter 3 – Parabellum, Eve Macarro begins her training in the assassin traditions of the Ruska Roma.",
      "poster_path": "/2VUmvqsHb6cEtdfscEA6fqqVzLg.jpg",
      "media_type": "movie",
      "original_language": "en",
      "genre_ids": [
        28,
        53,
        80
      ],
      "popularity": 23.325,
      "release_date": "2025-06-04",
      "video": false,
      "vote_average": 7.265,
      "vote_count": 2331
    }
  ]
};

const MOCK_DATA_JENIFER_LOPEZ_MILES = {
  "adult": false,
  "gender": 0,
  "id": 5091952,
  "known_for_department": "Production",
  "name": "Jenifer López Miles",
  "original_name": "Jenifer López Miles",
  "popularity": 0.0143,
  "profile_path": null,
  "known_for": [
    {
      "adult": false,
      "backdrop_path": "/eKpMbFeQ4oB39M8OyjyJ0ZOjebl.jpg",
      "id": 956510,
      "title": "Mom",
      "original_title": "Mamá",
      "overview": "No overview provided.",
      "poster_path": null,
      "media_type": "movie",
      "original_language": "en",
      "genre_ids": [],
      "popularity": 0,
      "release_date": null,
      "video": false,
      "vote_average": 0,
      "vote_count": 0
    }
  ]
};

const MOCK_DATA_ANGELINA_JOLIE = {
  "adult": false,
  "gender": 1,
  "id": 11701,
  "known_for_department": "Acting",
  "name": "Angelina Jolie",
  "original_name": "Angelina Jolie",
  "popularity": 10.2303,
  "profile_path": "/nXA9vMvskmIDB5NqHCkTQPmemep.jpg",
  "known_for": [
    {
      "adult": false,
      "backdrop_path": "/lNJ3AxUdUGrYoxPkecMavpU6lI7.jpg",
      "id": 102651,
      "title": "Maleficent",
      "original_title": "Maleficent",
      "overview": "A beautiful, pure-hearted young woman, Maleficent has an idyllic life growing up in a peaceable forest kingdom, until one day when an invading army threatens the harmony of the land. She rises to be the land's fiercest protector, but she ultimately suffers a ruthless betrayal – an act that begins to turn her heart into stone. Bent on revenge, Maleficent faces an epic battle with the invading King's successor and, as a result, places a curse upon his newborn infant Aurora. As the child grows, Maleficent realizes that Aurora holds the key to peace in the kingdom – and to Maleficent's true happiness as well.",
      "poster_path": "/bDG3yei6AJlEAK3A5wN7RwFXQ7V.jpg",
      "media_type": "movie",
      "original_language": "en",
      "genre_ids": [
        14,
        12,
        28,
        10751,
        10749
      ],
      "popularity": 13.8845,
      "release_date": "2014-05-28",
      "video": false,
      "vote_average": 7.087,
      "vote_count": 13579
    },
    {
      "adult": false,
      "backdrop_path": "/bL41GVWvp4YJDJ50PDcxaN4cds9.jpg",
      "id": 1995,
      "title": "Lara Croft: Tomb Raider",
      "original_title": "Lara Croft: Tomb Raider",
      "overview": "Orphaned heiress, English aristocrat and intrepid archaeologist, Lara Croft, embarks on a dangerous quest to retrieve the two halves of an ancient artifact which controls time before it falls into the wrong hands. As an extremely rare planetary alignment is about to occur for the first time in 5,000 years, the fearless tomb raider will have to team up with rival adventurers and sworn enemies to collect the pieces, while time is running out. But, in the end, who can harness the archaic talisman's unlimited power?",
      "poster_path": "/ye5h6fhfz8TkKV4QeuTucvFzxB9.jpg",
      "media_type": "movie",
      "original_language": "en",
      "genre_ids": [
        12,
        28,
        14
      ],
      "popularity": 5.8704,
      "release_date": "2001-06-15",
      "video": false,
      "vote_average": 5.91,
      "vote_count": 6407
    },
    {
      "adult": false,
      "backdrop_path": "/skvI4rYFrKXS73BJxWGH54Omlvv.jpg",
      "id": 420809,
      "title": "Maleficent: Mistress of Evil",
      "original_title": "Maleficent: Mistress of Evil",
      "overview": "Maleficent and her goddaughter Aurora begin to question the complex family ties that bind them as they are pulled in different directions by impending nuptials, unexpected allies, and dark new forces at play.",
      "poster_path": "/vloNTScJ3w7jwNwtNGoG8DbTThv.jpg",
      "media_type": "movie",
      "original_language": "en",
      "genre_ids": [
        10751,
        14,
        12
      ],
      "popularity": 10.7182,
      "release_date": "2019-10-16",
      "video": false,
      "vote_average": 7.3,
      "vote_count": 6392
    }
  ]
};

const MOCK_DATA_ANGELINA_NOA = {
  "adult": false,
  "gender": 1,
  "id": 1148271,
  "known_for_department": "Acting",
  "name": "Angelina Noa",
  "original_name": "Angelina Noa",
  "popularity": 0.3551,
  "profile_path": "/tWUn6bH8Zw8SW7XmFsjAP0cGeWX.jpg",
  "known_for": [
    {
      "adult": false,
      "backdrop_path": "/dzm6sNpz9UwG208xyGKAJ6e4ybA.jpg",
      "id": 166666,
      "title": "3096 Days",
      "original_title": "3096 Tage",
      "overview": "A young Austrian girl is kidnapped and held in captivity for eight years. Based on the real-life case of Natascha Kampusch.",
      "poster_path": "/x2bybyGMtyFSVNjFSxeDNu2fnPD.jpg",
      "media_type": "movie",
      "original_language": "de",
      "genre_ids": [
        18
      ],
      "popularity": 2.5279,
      "release_date": "2013-02-21",
      "video": false,
      "vote_average": 7.39,
      "vote_count": 974
    },
    {
      "adult": false,
      "backdrop_path": "/cT2bZBH9iS735OQh5cfzgIbu8hJ.jpg",
      "id": 60479,
      "title": "Max Schmeling",
      "original_title": "Max Schmeling",
      "overview": "Based on the true story of Max Schmeling. A national hero in the 1930's when he became World heavyweight champion. He lost favour with the Nazi regime when he lost to a black man, Joe Louis, and is sent to the front in the hope he will be killed in battle.",
      "poster_path": "/gk7prsgDDTt7ZMx1IQYkFNOQIVG.jpg",
      "media_type": "movie",
      "original_language": "de",
      "genre_ids": [
        28,
        18
      ],
      "popularity": 0.5128,
      "release_date": "2010-10-07",
      "video": false,
      "vote_average": 5.6,
      "vote_count": 22
    }
  ]
};

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
  
  // Check for local mock data first to save time/network
  if (name.toLowerCase() === "tom hanks") {
    console.log("Using local MOCK DATA for Tom Hanks.");
    personData = MOCK_DATA_TOM_HANKS;
  } else if (name.toLowerCase() === "tom cruise") {
    console.log("Using local MOCK DATA for Tom Cruise.");
    personData = MOCK_DATA_TOM_CRUISE;
  } else if (name.toLowerCase() === "tom holland") {
    console.log("Using local MOCK DATA for Tom Holland.");
    personData = MOCK_DATA_TOM_HOLLAND;
  } else if (name.toLowerCase() === "ana de armas") {
    console.log("Using local MOCK DATA for Ana de Armas.");
    personData = MOCK_DATA_ANA_DE_ARMAS;
  } else if (name.toLowerCase() === "jenifer lópez miles" || name.toLowerCase() === "jennifer lopez") {
    console.log("Using local MOCK DATA for Jenifer López Miles (as provided).");
    personData = MOCK_DATA_JENIFER_LOPEZ_MILES;
  } else if (name.toLowerCase() === "angelina jolie") {
    console.log("Using local MOCK DATA for Angelina Jolie.");
    personData = MOCK_DATA_ANGELINA_JOLIE;
  } else if (name.toLowerCase() === "angelina noa") {
    console.log("Using local MOCK DATA for Angelina Noa.");
    personData = MOCK_DATA_ANGELINA_NOA;
  }

  if (!personData) {
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
  "Tom Holland",
  "Ana de Armas",
  "Jenifer López Miles",
  "Angelina Jolie",
  "Angelina Noa",
  // "Leonardo DiCaprio",
  // "Brad Pitt",
  // "Robert Downey Jr.",
  // "Denzel Washington",
  // "Morgan Freeman",
  // "Matt Damon",
  // "Johnny Depp",
  // "Keanu Reeves",
  // "Will Smith",
  // "Chris Hemsworth",
  // "Chris Evans",
  // "Scarlett Johansson",
  // "Angelina Jolie",
  // "Jennifer Lawrence",
  // "Natalie Portman",
  // "Meryl Streep",
  "Tom Hanks",
  // "Christian Bale",
  // "Hugh Jackman",
  // "Ryan Reynolds",
  // "Anne Hathaway",
  // "Samuel L. Jackson",
  // "George Clooney",
  // "Robert De Niro",
  // "Al Pacino",
  // "Julia Roberts",
  // "Charlize Theron",
  // "Benedict Cumberbatch",
  // "Zendaya"
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
