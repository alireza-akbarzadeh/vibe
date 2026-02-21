import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
	Clock,
	FileVideo,
	Film,
	Image,
	Info,
	Layers,
	Music,
	Star,
	Tag,
	Upload,
	Users,
	Zap,
} from "lucide-react";
import { toast } from "sonner";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { CompactMultiSelect } from "@/components/ui/compact-multi-select";
import { CompactSelect } from "@/components/ui/compact-select";
import { DatePicker } from "@/components/ui/date-picker";
import { useAppForm } from "@/components/ui/forms/form";
import { Label } from "@/components/ui/label";
import { CompactField } from "@/domains/dashboard/components/user-table/compact-field";
import { orpc } from "@/orpc/client";


import type { MediaFormData } from "../../media.schema";
import { mediaFormSchema } from "../../media.schema";
import { MediaFormHeader } from "./media-form-header";

export function MediaForm({
	initialData,
	mode = "create",
}: {
	initialData?: Partial<MediaFormData>;
	mode?: "create" | "edit";
}) {
	const navigate = useNavigate();
	const isEditMode = mode === "edit" || !!initialData?.id;

	// Use TanStack Query with ORPC for data fetching
	const { data: genresData } = useSuspenseQuery(orpc.genres.list.queryOptions());
	const { data: collectionsData } = useSuspenseQuery(
		orpc.collections.list.queryOptions({
			input: {
				page: 1,
				limit: 100,
			},
		}),
	);

	const genres = genresData?.data || [];
	const collections = collectionsData?.data.items || [];

	const useCreateMedia = () =>
		useMutation({
			...orpc.media.create.mutationOptions(),
			onSuccess: () => {
				toast.success("Media created successfully");
				navigate({ to: "/dashboard/movies" });
			},
			onError: (error) => {
				console.error("Media creation error:", error);
				toast.error("Failed to create media");
			},
		});

	const useUpdateMedia = () =>
		useMutation({
			...orpc.media.update.mutationOptions(),
			onSuccess: () => {
				toast.success("Media updated successfully");
				navigate({ to: "/dashboard/movies" });
			},
			onError: (error) => {
				console.error("Media update error:", error);
				toast.error("Failed to update media");
			},
		});

	const createMedia = useCreateMedia();
	const updateMedia = useUpdateMedia();

	const form = useAppForm(mediaFormSchema, {
		defaultValues: initialData ?? {
			title: "",
			description: "",
			thumbnail: "",
			type: "MOVIE",
			status: "DRAFT",
			videoUrl: null,
			audioUrl: null,
			duration: 0,
			releaseYear: new Date().getFullYear(),
			rating: null,
			criticalScore: null,
			reviewCount: 0,
			viewCount: 0,
			collectionId: null,
			sortOrder: null,
			genreIds: [],
			creatorIds: [],
		},
		onSubmit: async ({ value }) => {
			const formData = value as MediaFormData;
			if (isEditMode && initialData?.id) {
				await updateMedia.mutateAsync({ ...formData, id: initialData.id });
			} else {
				await createMedia.mutateAsync(formData);
			}
		},
	});

	const mediaTypeOptions = ["MOVIE", "EPISODE", "TRACK"] as const;
	const statusOptions = ["DRAFT", "REVIEW", "PUBLISHED", "REJECTED"] as const;

	return (
		<div className="min-h-screen bg-[#020408] text-slate-400 px-6 font-sans">
			<div className="bg-[#0a0c10] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
				<MediaFormHeader isEditMode={isEditMode} />

				<form.Root className="p-8">
					<Accordion
						type="multiple"
						defaultValue={["basic", "media", "metadata", "advanced"]}
						className="space-y-6"
					>
						{/* SECTION 1: BASIC INFORMATION */}
						<AccordionItem
							value="basic"
							className="border border-white/5 rounded-xl bg-slate-900/20 backdrop-blur-sm"
						>
							<AccordionTrigger className="px-6 py-4 hover:no-underline">
								<div className="flex items-center gap-2">
									<Info className="h-4 w-4 text-primary" />
									<h2 className="text-lg font-bold text-white">
										Basic Information
									</h2>
								</div>
							</AccordionTrigger>
							<AccordionContent className="px-6 pb-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
									<CompactField
										form={form}
										name="title"
										label="Media Title"
										placeholder="Enter media title"
										icon={Film}
									/>
									<CompactField
										form={form}
										name="type"
										label="Media Type"
										type="select"
										options={mediaTypeOptions}
										icon={FileVideo}
									/>
									<CompactField
										form={form}
										name="status"
										label="Publication Status"
										type="select"
										options={statusOptions}
										icon={Zap}
									/>
									<form.Field name="releaseYear">
										{(field) => {
											const currentYear = field.state.value
												? new Date(field.state.value, 0, 1)
												: new Date();
											return (
												<div className="space-y-2">
													<Label className="text-sm font-medium text-slate-300">
														Release Year
													</Label>
													<DatePicker
														calendar={{
															selected: currentYear,
															onSelect: (date) => {
																if (date) {
																	field.handleChange(date.getFullYear());
																}
															},
														}}
														className=""
													/>
													{field.state.meta.errors && (
														<p className="text-xs text-red-400">
															{field.state.meta.errors.join(", ")}
														</p>
													)}
												</div>
											);
										}}
									</form.Field>
									<div className="md:col-span-2">
										<CompactField
											form={form}
											name="description"
											label="Description"
											type="textarea"
											placeholder="Enter detailed description..."
										/>
									</div>
								</div>
							</AccordionContent>
						</AccordionItem>

						{/* SECTION 2: MEDIA FILES */}
						<AccordionItem
							value="media"
							className="border border-white/5 rounded-xl bg-slate-900/20 backdrop-blur-sm"
						>
							<AccordionTrigger className="px-6 py-4 hover:no-underline">
								<div className="flex items-center gap-2">
									<Upload className="h-4 w-4 text-blue-500" />
									<h2 className="text-lg font-bold text-white">Media Files</h2>
								</div>
							</AccordionTrigger>
							<AccordionContent className="px-6 pb-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
									<CompactField
										form={form}
										name="thumbnail"
										label="Thumbnail URL"
										placeholder="https://..."
										icon={Image}
									/>
									<CompactField
										form={form}
										name="duration"
										label="Duration (seconds)"
										placeholder="7200"
										icon={Clock}
									/>
									<CompactField
										form={form}
										name="videoUrl"
										label="Video URL"
										placeholder="https://..."
										icon={FileVideo}
									/>
									<CompactField
										form={form}
										name="audioUrl"
										label="Audio URL"
										placeholder="https://..."
										icon={Music}
									/>
								</div>
							</AccordionContent>
						</AccordionItem>

						{/* SECTION 3: METADATA & RELATIONSHIPS */}
						<AccordionItem
							value="metadata"
							className="border border-white/5 rounded-xl bg-slate-900/20 backdrop-blur-sm"
						>
							<AccordionTrigger className="px-6 py-4 hover:no-underline">
								<div className="flex items-center gap-2">
									<Users className="h-4 w-4 text-purple-500" />
									<h2 className="text-lg font-bold text-white">
										Metadata & Relationships
									</h2>
								</div>
							</AccordionTrigger>
							<AccordionContent className="px-6 pb-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
									<form.Field name="genreIds">
										{(field) => (
											<div className="space-y-2">
												<Label className="text-sm font-medium text-slate-300 flex items-center gap-2">
													<Tag className="size-4" />
													Genres
												</Label>
												<CompactMultiSelect
													props={{
														options: genres,
														getOptionValue: (g) => g.id,
														getOptionLabel: (g) => g.name,
													}}
													field={field}
													baseStyles=""
													placeholder="Select genres..."
													label="genres"
													Icon={Tag}
												/>
												{field.state.meta.errors && (
													<p className="text-xs text-red-400">
														{field.state.meta.errors.join(", ")}
													</p>
												)}
											</div>
										)}
									</form.Field>
									<form.Field name="collectionId">
										{(field) => (
											<div className="space-y-2">
												<Label className="text-sm font-medium text-slate-300 flex items-center gap-2">
													<Layers className="size-4" />
													Collection (Optional)
												</Label>
												<CompactSelect
													props={{
														options: collections,
														getOptionValue: (c) => c.id,
														getOptionLabel: (c) => c.title,
													}}
													field={{
														state: { value: field.state.value || "" },
														handleChange: field.handleChange,
													}}
													baseStyles=""
													placeholder="Select collection..."
													label="collection"
													Icon={Layers}
												/>
												{field.state.meta.errors && (
													<p className="text-xs text-red-400">
														{field.state.meta.errors.join(", ")}
													</p>
												)}
											</div>
										)}
									</form.Field>
									<CompactField
										form={form}
										name="sortOrder"
										label="Sort Order (Optional)"
										placeholder="1"
									/>
								</div>
							</AccordionContent>
						</AccordionItem>

						{/* SECTION 4: STATS & RATINGS (Edit Mode Only) */}
						{isEditMode && (
							<AccordionItem
								value="advanced"
								className="border border-white/5 rounded-xl bg-slate-900/20 backdrop-blur-sm"
							>
								<AccordionTrigger className="px-6 py-4 hover:no-underline">
									<div className="flex items-center gap-2">
										<Star className="h-4 w-4 text-amber-500" />
										<h2 className="text-lg font-bold text-white">
											Stats & Ratings
										</h2>
									</div>
								</AccordionTrigger>
								<AccordionContent className="px-6 pb-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
										<CompactField
											form={form}
											name="rating"
											label="User Rating (0-10)"
											placeholder="8.5"
										/>
										<CompactField
											form={form}
											name="criticalScore"
											label="Critical Score (0-100)"
											placeholder="85"
										/>
										<CompactField
											form={form}
											name="reviewCount"
											label="Review Count"
											placeholder="1000"
										/>
										<CompactField
											form={form}
											name="viewCount"
											label="View Count"
											placeholder="50000"
										/>
									</div>
								</AccordionContent>
							</AccordionItem>
						)}
					</Accordion>

					{/* FOOTER ACTIONS */}
					<div className="flex items-center justify-end gap-3 pt-8 px-8 pb-8 mt-6">
						<form.Submit className="px-10 h-11 rounded-xl text-white font-bold transition-all active:scale-95 shadow-lg shadow-blue-600/20">
							{isEditMode ? "Update Media" : "Create Media"}
						</form.Submit>
					</div>
				</form.Root>
			</div>
		</div>
	);
}
