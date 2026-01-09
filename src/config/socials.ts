import { IMAGES } from "@/constants/media";

export interface SocialProvider {
	id: string;
	name: string;
	icon: string;
	size?: number;
	logoColor?: string;
	textColor: string;
	backgroundColor: string;
}

export const socialProviders: SocialProvider[] = [
	{
		id: "google",
		name: "Google",
		icon: IMAGES.SOCIALS.GOOGLE_48,
		size: 20,
		logoColor: "#4285F4",
		textColor: "#000",
		backgroundColor: "#fff",
	},
	{
		id: "apple",
		name: "Apple",
		icon: IMAGES.SOCIALS.APPLE_50,
		size: 20,
		logoColor: "#fff",
		textColor: "#fff",
		backgroundColor: "#000",
	},
];
