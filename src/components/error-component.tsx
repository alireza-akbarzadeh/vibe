import { type ErrorComponentProps } from "@tanstack/react-router";
import BackButton from "@/components/back-button";
import { Typography } from "@/components/ui/typography";

export default function ErrorComponent({ error }: ErrorComponentProps) {
    return (
        <div className="space-y-6 flex flex-col justify-center items-center h-screen px-4 text-center">
            <Typography.H1 className="block bg-linear-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent text-5xl font-black">
                Error
            </Typography.H1>
            <p className="text-destructive max-w-md font-mono text-sm bg-destructive/10 p-4 rounded-lg">
                {error?.message || "Something went wrong!"}
            </p>
            <BackButton />
        </div>
    );
}
