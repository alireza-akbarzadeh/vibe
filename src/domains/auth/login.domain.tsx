import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { ArrowRight, Loader2, Mail, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useForm } from "@/components/ui/forms/form";
import { InputPassword } from "@/components/ui/forms/input-password";
import { Input } from "@/components/ui/input";
import { socialProviders } from "@/config/socials";
import AuthLayout from "@/domains/auth/auth-layout";
import { authClient } from "@/lib/auth-client";

const loginFormSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export function LoginDomain() {
    const navigate = useNavigate();
    const router = useRouter();

    const form = useForm(loginFormSchema, {
        defaultValues: {
            email: "",
            password: "",
        },
        onSubmit: async ({ value }) => {
            const { data, error } = await authClient.signIn.email({
                email: value.email,
                password: value.password,
                rememberMe: true
            });

            if (error) {
                toast.error(error.message || "Authentication failed");
                return;
            }

            toast.success(`Welcome back, ${data?.user.name}!`);
            await router.invalidate();
            await navigate({ to: "/" });
        },
    });

    const handleSocialSignIn = async (providerId: "google" | "github") => {
        await authClient.signIn.social({
            provider: providerId,
            callbackURL: "/",
        });
    };

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Sign in to continue your journey"
        >
            <form.Root className="space-y-5">
                {/* Email Field */}
                <form.Field
                    name="email"
                    label="Email Address"
                    icon={Mail}
                >
                    {(field) => (
                        <Input
                            type="email"
                            placeholder="you@example.com"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50 rounded-xl transition-all"
                        />
                    )}
                </form.Field>

                {/* Password Field */}
                <form.Field name="password">
                    {(field) => (
                        <InputPassword
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            errorMessage={field.state.meta.errors?.[0]?.message}
                            isInvalid={!!field.state.meta.errors?.length && field.state.meta.isTouched}
                        />
                    )}
                </form.Field>

                {/* Submit Button */}
                <form.Subscribe selector={(s) => s.isSubmitting}>
                    {(isSubmitting) => (
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-12 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 group"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    )}
                </form.Subscribe>

                {/* Divider & Socials */}
                <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-[#0a0a0a] text-gray-500">
                            Or continue with
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {socialProviders.map((social) => (
                        <Button
                            key={social.id}
                            type="button"
                            variant="outline"
                            onClick={() => handleSocialSignIn(social.id as "google" | "github")}
                            className="h-11 bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl"
                        >
                            <img src={social.icon} className="w-5 h-5" alt={social.name} />
                            {social.name}
                        </Button>
                    ))}
                </div>
            </form.Root>

            <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                    >
                        Create one free
                    </Link>
                </p>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-gray-500 text-xs">
                <Sparkles className="w-4 h-4" />
                <span>Trusted by 50M+ streamers worldwide</span>
            </div>
        </AuthLayout >
    );
}