
import 'dotenv/config'
import { CollectionType, CreatorRole, MediaType, PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();


async function main() {
  console.log('🌱 Start seeding real-world media data...');

  // 1. Cleanup existing data (order matters for foreign keys)
  await prisma.mediaGenre.deleteMany();
  await prisma.mediaCreator.deleteMany();
  await prisma.media.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.creator.deleteMany();
  await prisma.collection.deleteMany();

  // 2. Create Genres
  const sciFi = await prisma.genre.create({
    data: { name: 'Sci-Fi', description: 'Speculative fiction dealing with futuristic concepts.' }
  });
  const drama = await prisma.genre.create({
    data: { name: 'Drama', description: 'Narrative fiction intended to be more serious than humorous.' }
  });
  const rock = await prisma.genre.create({
    data: { name: 'Rock', description: 'Broad genre of popular music that originated as "rock and roll".' }
  });

  // 3. Create Creators
  const nolan = await prisma.creator.create({
    data: { 
        name: 'Christopher Nolan', 
        bio: 'British-American film director known for complex storytelling.',
        image: 'https://image.tmdb.org/t/p/w500/director_nolan.jpg' 
    }
  });
  const pinkFloyd = await prisma.creator.create({
    data: { 
        name: 'Pink Floyd', 
        bio: 'English rock band formed in London in 1965.' 
    }
  });

  // 4. Create a Movie (Standalone Media)
  const interstellar = await prisma.media.create({
    data: {
      title: 'Interstellar',
      description: 'When Earth becomes uninhabitable, a farmer and ex-NASA pilot is tasked to pilot a spacecraft.',
      thumbnail: 'https://images.example.com/interstellar_thumb.jpg',
      videoUrl: 'https://stream.example.com/interstellar.mp4',
      duration: 10140, // 2h 49m in seconds
      releaseYear: 2014,
      type: MediaType.MOVIE,
      genres: {
        create: [
          { genreId: sciFi.id },
          { genreId: drama.id }
        ]
      },
      creators: {
        create: [
          { creatorId: nolan.id, role: CreatorRole.DIRECTOR }
        ]
      }
    }
  });

  // 5. Create a Collection (Album) with Tracks (Media)
  const darkSide = await prisma.collection.create({
    data: {
      title: 'The Dark Side of the Moon',
      description: 'The eighth studio album by the English rock band Pink Floyd.',
      thumbnail: 'https://images.example.com/darkside_cover.jpg',
      type: CollectionType.ALBUM,
      media: {
        create: [
          {
            title: 'Time',
            description: 'Ticking away the moments that make up a dull day.',
            thumbnail: 'https://images.example.com/time_song.jpg',
            audioUrl: 'https://audio.example.com/time.mp3',
            duration: 413,
            releaseYear: 1973,
            type: MediaType.TRACK,
            sortOrder: 1,
            genres: { create: { genreId: rock.id } },
            creators: { create: { creatorId: pinkFloyd.id, role: CreatorRole.ARTIST } }
          },
          {
            title: 'Money',
            description: 'Get a good job with more pay and you are okay.',
            thumbnail: 'https://images.example.com/money_song.jpg',
            audioUrl: 'https://audio.example.com/money.mp3',
            duration: 382,
            releaseYear: 1973,
            type: MediaType.TRACK,
            sortOrder: 2,
            genres: { create: { genreId: rock.id } },
            creators: { create: { creatorId: pinkFloyd.id, role: CreatorRole.ARTIST } }
          }
        ]
      }
    }
  });

  console.log({
    genres: 3,
    movies: 1,
    albums: 1,
    tracks: 2
  });
  console.log('✅ Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });