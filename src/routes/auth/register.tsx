import {useForm} from "@tanstack/react-form";
import {createFileRoute, Link, useNavigate} from "@tanstack/react-router";
import {motion} from "framer-motion";
import {ArrowRight, Check, Loader2, Lock, Mail, Sparkles, User,} from "lucide-react";
import {useId} from "react";
import {toast} from "sonner";
import {z} from "zod";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import AuthLayout from "@/domains/auth/auth-layout";
import {PrivacyPolicyDialog} from "@/domains/auth/privacy-dialog";
import {TermsOfServiceDialog} from "@/domains/auth/terms-dialog";
import {usePostAuthRegister} from "@/services/endpoints/authentication/authentication.ts";
import {Http} from "@/constants/constants.ts";

export const Route = createFileRoute("/auth/register")({
    component: RouteComponent,
});

const benefits = [
    "Unlimited movie streaming",
    "Personalized recommendations",
    "Access on all your devices",
];
const registerFormSchema = z.object({
    firstName: z.string().min(1, "first name is required"),
    lastName: z.string().min(1, "last name is required"),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    agreeToTerms: z.boolean().refine((val) => val, {
        message: "You must agree to the terms and conditions",
    }),
});

export type RegisterFormValues = z.infer<typeof registerFormSchema>;

function RouteComponent() {
    const navigate = useNavigate();
    const {mutateAsync} = usePostAuthRegister()
    const form = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            agreeToTerms: false,
        },
        validators: {
            onSubmit: registerFormSchema,
            onChange: registerFormSchema,
            onBlur: registerFormSchema,
        },
        onSubmit: async ({value}) => {
            try {
                const response = await mutateAsync({
                    data: {
                        email: value.email,
                        first_name: value.firstName,
                        last_name: value.lastName,
                        password: value.password
                    }
                })
                if (response.code === Http.STATUS_CODE_SERVICE_SUCCESS) {
                    toast.success(`${value.firstName} Welcome back!`);
                    await navigate({to: "/auth/login"})
                    toast(response.message);
                }
            } catch (err) {
                toast.error("Failed to login. Please check your credentials.");
            }
        },
    });
    const firstNameId = useId();
    const lastNameId = useId();
    const emailId = useId();
    const passwordId = useId();
    const termsId = useId();

    return (
        <AuthLayout
            title="Start Your Journey"
            subtitle="Create your account and unlock unlimited entertainment"
        >
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    await form.handleSubmit();
                }}
                className="space-y-5"
            >
                {/* Full Name */}
                <div className="grid grid-cols-2 space-x-2">

                <form.Field name="firstName">
                    {(field) => {
                        const errorMessage = field.state.meta.errors?.[0];
                        const isInvalid = !!errorMessage && field.state.meta.isTouched;

                        return (
                            <div className="space-y-2">
                                <Label
                                    htmlFor={firstNameId}
                                    className="text-gray-300 text-sm font-medium"
                                >
                                    First Name
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"/>
                                    <Input
                                        id={firstNameId}
                                        type="text"
                                        placeholder="John"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={field.handleBlur}
                                        className={`pl-12 h-12 bg-white/5 border ${
                                            isInvalid ? "border-red-500" : "border-white/10"
                                        } text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-purple-500/20 rounded-xl transition-all`}
                                        aria-invalid={isInvalid}
                                    />
                                </div>
                                {isInvalid && (
                                    <p className="text-xs text-red-400 mt-1">
                                        {errorMessage.message}
                                    </p>
                                )}
                            </div>
                        );
                    }}
                </form.Field>
                <form.Field name="lastName">
                    {(field) => {
                        const errorMessage = field.state.meta.errors?.[0];
                        const isInvalid = !!errorMessage && field.state.meta.isTouched;

                        return (
                            <div className="space-y-2">
                                <Label
                                    htmlFor={lastNameId}
                                    className="text-gray-300 text-sm font-medium"
                                >
                                    Last Name
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"/>
                                    <Input
                                        id={lastNameId}
                                        type="text"
                                        placeholder="Doe"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={field.handleBlur}
                                        className={`pl-12 h-12 bg-white/5 border ${
                                            isInvalid ? "border-red-500" : "border-white/10"
                                        } text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-purple-500/20 rounded-xl transition-all`}
                                        required
                                        aria-invalid={isInvalid}
                                    />
                                </div>
                                {isInvalid && (
                                    <p className="text-xs text-red-400 mt-1">
                                        {errorMessage.message}
                                    </p>
                                )}
                            </div>
                        );
                    }}
                </form.Field>
                </div>

                {/* Email */}
                <form.Field name="email">
                    {(field) => {
                        const errorMessage = field.state.meta.errors?.[0];
                        const isInvalid = !!errorMessage && field.state.meta.isTouched;

                        return (
                            <div className="space-y-2">
                                <Label
                                    htmlFor={emailId}
                                    className="text-gray-300 text-sm font-medium"
                                >
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"/>
                                    <Input
                                        id={emailId}
                                        type="email"
                                        placeholder="you@example.com"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={field.handleBlur}
                                        className={`pl-12 h-12 bg-white/5 border ${
                                            isInvalid ? "border-red-500" : "border-white/10"
                                        } text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-purple-500/20 rounded-xl transition-all`}
                                        required
                                        aria-invalid={isInvalid}
                                    />
                                </div>
                                {isInvalid && (
                                    <p className="text-xs text-red-400 mt-1">
                                        {errorMessage.message}
                                    </p>
                                )}
                            </div>
                        );
                    }}
                </form.Field>

                {/* Password */}
                <form.Field name="password">
                    {(field) => {
                        const errorMessage = field.state.meta.errors?.[0];
                        const isInvalid = !!errorMessage && field.state.meta.isTouched;

                        return (
                            <div className="space-y-2">
                                <Label
                                    htmlFor={passwordId}
                                    className="text-gray-300 text-sm font-medium"
                                >
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"/>
                                    <Input
                                        id={passwordId}
                                        type="password"
                                        placeholder="Create a strong password"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={field.handleBlur}
                                        className={`pl-12 h-12 bg-white/5 border ${
                                            isInvalid ? "border-red-500" : "border-white/10"
                                        } text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-purple-500/20 rounded-xl transition-all`}
                                        required
                                        aria-invalid={isInvalid}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Must be at least 8 characters
                                </p>
                                {isInvalid && (
                                    <p className="text-xs text-red-400 mt-1">
                                        {errorMessage.message}
                                    </p>
                                )}
                            </div>
                        );
                    }}
                </form.Field>

                {/* Benefits block (unchanged) */}
                <div
                    className="p-4 rounded-xl bg-linear-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20">
                    <p className="text-white font-medium text-sm mb-3">
                        What you'll get:
                    </p>
                    <div className="space-y-2">
                        {benefits.map((benefit) => (
                            <div
                                key={benefit}
                                className="flex items-center gap-2 text-sm text-gray-300"
                            >
                                <div
                                    className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                                    <Check className="w-3 h-3 text-green-400"/>
                                </div>
                                <span>{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Terms */}
                <form.Field name="agreeToTerms">
                    {(field) => {
                        const errorMessage = field.state.meta.errors?.[0];
                        const isInvalid = !!errorMessage && field.state.meta.isTouched;
                        return (
                            <div className="flex flex-col">
                                <div className="flex items-center">
                                    <Checkbox
                                        id={termsId}
                                        className={`w-4 h-4 mt-0.5 rounded border-white/20 bg-white/5 text-purple-600 focus:ring-purple-500/20 focus:ring-offset-0 ${
                                            isInvalid ? "border-red-500" : ""
                                        }`}
                                        checked={field.state.value}
                                        onCheckedChange={(value) =>
                                            field.handleChange(value as boolean)
                                        }
                                    />

                                    <Label
                                        htmlFor={termsId}
                                        className="ml-2 text-sm text-gray-400 flex gap-1 items-center"
                                    >
                                        I agree to the <TermsOfServiceDialog/> and{" "}
                                        <PrivacyPolicyDialog/>
                                    </Label>
                                </div>
                                {isInvalid && (
                                    <p className="text-xs text-red-400 mt-1">
                                        
                                        {errorMessage.message}
                                    </p>
                                )}
                            </div>
                        );
                    }}
                </form.Field>
                {/* Error message */}
                <form.Subscribe selector={(s) => s.errors}>
                    {(errors) =>
                        (errors.length > 0) && (
                            <motion.div
                                initial={{opacity: 0, y: -10}}
                                animate={{opacity: 1, y: 0}}
                                className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                            >
                                { "Please fix errors before submitting"}
                            </motion.div>
                        )
                    }
                </form.Subscribe>

                {/* Submit */}
                <form.Subscribe selector={(s) => s.isSubmitting}>
                    {(isSubmitting) => (
                        <Button
                            type="submit"
                            disabled={!form.state.values.agreeToTerms ||isSubmitting}
                            className="w-full h-12 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 group"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 animate-spin"/>
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <ArrowRight
                                        className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"/>
                                </>
                            )}
                        </Button>
                    )}
                </form.Subscribe>
            </form>

            {/* Sign in link */}
            <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                    Already have an account?{" "}
                    <Link
                        to="/auth/login"
                        className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                    >
                        Sign in
                    </Link>
                </p>
            </div>

            {/* Trust badge */}
            <div className="mt-6 flex items-center justify-center gap-2 text-gray-500 text-xs">
                <Sparkles className="w-4 h-4"/>
                <span>Free 7-day trial • No credit card required</span>
            </div>
        </AuthLayout>
    );
}
