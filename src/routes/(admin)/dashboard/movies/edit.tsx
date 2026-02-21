import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { MediaForm } from "@/domains/dashboard/movies/components/media-form/media-form";
import { orpc } from "@/lib/orpc";
import type {
    MediaCreatorSchema,
    MediaGenreSchema,
} from "@/orpc/models/media.schema";

const editSearchSchema = z.object({
    mediaId: z.string(),
});

type MediaGenre = z.infer<typeof MediaGenreSchema>;
type MediaCreator = z.infer<typeof MediaCreatorSchema>;

export const Route = createFileRoute("/(admin)/dashboard/movies/edit")({
    validateSearch: editSearchSchema,
    loaderDeps: ({ search }) => ({ mediaId: search.mediaId }),
    loader: async ({ deps }) => {
        const response = await orpc.media.find({ id: deps.mediaId });
        return { media: response.data };
    },
    component: RouteComponent,
});

function RouteComponent() {
    const { media } = Route.useLoaderData();

    if (!media) {
        return (
            <div className="container mx-auto py-6">
                <div className="p-16 text-center border-2 border-dashed rounded-2xl">
                    <h3 className="font-bold text-lg">Media not found</h3>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6">
            <MediaForm
                mode="edit"
                initialData={{
                    id: media.id,
                    title: media.title,
                    description: media.description,
                    thumbnail: media.thumbnail,
                    type: media.type,
                    videoUrl: media.videoUrl,
                    audioUrl: media.audioUrl,
                    duration: media.duration,
                    releaseYear: media.releaseYear,
                    collectionId: media.collectionId,
                    sortOrder: media.sortOrder,
                    genreIds: media.genres?.map((g: MediaGenre) => g.genre.id) || [],
                    creatorIds:
                        media.creators?.map((c: MediaCreator) => c.creator.id) || [],
                }}
            />
        </div>
    );
}
