import { ModelsUser } from "@/services/models";

type Session = {
	user: ModelsUser;
};

export function UseSession(): Session {
	return { user: {} };
}
