import { PropsProvider } from "@/components/props-provider";
import { cn } from "@/lib/utils";
import { Lock, LucideEye, LucideEyeOff, LucideProps } from "lucide-react";
import { ComponentProps, useId, useState } from "react";
import type { Except } from "type-fest";
import { Button } from "../button";
import { Input } from "../input";
import { motion } from "framer-motion";
import { Label } from "../label";
import { Link } from "@tanstack/react-router";

export interface InputPasswordProps
	extends Except<ComponentProps<typeof Input>, "type"> {
	isInvalid: boolean;
	errorMessage: string;
}

function InputPassword(props: InputPasswordProps) {
	const { className, isInvalid, errorMessage, ...rest } = props;

	const [showPassword, setShowPassword] = useState(false);
	const passwordId = useId();

	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<Label
					htmlFor={passwordId}
					className="text-gray-300 text-sm font-medium"
				>
					Password
				</Label>
				<Link
					to="/forgot-password"
					className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
				>
					Forgot?
				</Link>
			</div>

			<div className={cn("relative inline-block w-full", className)}>
				<Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
				<Input
					id={passwordId}
					type={showPassword ? "text" : "password"}
					placeholder="Enter your password"
					className={`pl-12 h-12 bg-white/5 border ${
						isInvalid ? "border-red-500" : "border-white/10"
					} text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-purple-500/20 rounded-xl transition-all`}
					{...rest}
				/>
				<Button
					size="sm"
					type="button"
					variant="ghost"
					onClick={() => setShowPassword((prev) => !prev)}
					aria-label="Toggle password visibility"
					className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
				>
					<PropsProvider<LucideProps> aria-hidden className="size-4">
						{showPassword && !props.disabled ? <LucideEye /> : <LucideEyeOff />}
					</PropsProvider>
				</Button>
			</div>
			{isInvalid && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
				>
					{errorMessage}
				</motion.div>
			)}
		</div>
	);
}

export { InputPassword };
