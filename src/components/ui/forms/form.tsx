import type {
	DeepKeys,
	DeepValue,
	FieldApi,
	FormOptions,
	ReactFormExtendedApi,
} from "@tanstack/react-form";
import {
	useField as useFieldApi,
	useForm as useTanStackForm,
} from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-adapter";
import type { ChangeEvent, ComponentProps, FC, ReactNode } from "react";
import type { Except } from "type-fest";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { AsChildProps } from "@/components/ui/slot";
import { Slot } from "@/components/ui/slot";
import { cn, createContextFactory } from "@/lib/utils";

/** * Type Fix: TanStack Form v1+ often hides Validator in internal types
 * or expects a specific shape. We define a compatible interface here.
 */
export interface Validator<TData, TError = unknown> {
	validate?: (params: { value: TData }) => TError | Promise<TError>;
	asyncValidate?: (params: { value: TData }) => TError | Promise<TError>;
}

// --- Component Interfaces ---

interface FieldLabelProps extends ComponentProps<typeof Label> {}
interface FieldDetailProps extends ComponentProps<"p">, AsChildProps {}
interface FieldMessageProps extends ComponentProps<"p">, AsChildProps {}
interface FieldContainerProps extends ComponentProps<"div"> {
	label?: string;
	detail?: string;
	message?: string;
	disableController?: boolean;
}
interface FieldControllerProps extends ComponentProps<typeof Slot> {}

interface FieldApiExtended<
	TParentData,
	TName extends DeepKeys<TParentData>,
	TFieldValidator extends Validator<DeepValue<TParentData, TName>, unknown>,
	TFormValidator extends Validator<TParentData, unknown>,
	TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> extends FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData> {
	Label: FC<FieldLabelProps>;
	Detail: FC<FieldDetailProps>;
	Message: FC<FieldMessageProps>;
	Container: FC<FieldContainerProps>;
	Controller: FC<FieldControllerProps>;
	handleChangeExtended: (value: any) => void;
}

type FieldComponent<
	TParentData,
	TFormValidator extends Validator<TParentData, unknown>,
> = <
	TName extends DeepKeys<TParentData>,
	TFieldValidator extends Validator<DeepValue<TParentData, TName>, unknown>,
	TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
>({
	render,
	...fieldOptions
}: Except<any, "form"> & {
	render: (
		fieldApi: FieldApiExtended<
			TParentData,
			TName,
			TFieldValidator,
			TFormValidator,
			TData
		>,
	) => ReactNode;
}) => ReactNode;

type AnyFieldApi = FieldApi<any, any, any, any, any>;

type FormExtended<TFormData> = ReactFormExtendedApi<TFormData, any> & {
	Root: FC<ComponentProps<"form">>;
	Field: FieldComponent<TFormData, any>;
	Submit: FC<ComponentProps<typeof Button>>;
};

const [FieldContextProvider, useFieldContext] =
	createContextFactory<AnyFieldApi>();

// --- Main Hooks & Components ---

export function useForm<
	TFormSchema extends z.ZodType,
	TFormData = z.infer<TFormSchema>,
>(
	schema: TFormSchema,
	options?: Except<FormOptions<TFormData, any>, "validatorAdapter">,
): FormExtended<TFormData> {
	const form = useTanStackForm({
		validatorAdapter: zodValidator({
			transformErrors: (errors) =>
				errors.map((e) => (typeof e === "string" ? e : e.message))[0],
		}),
		validators: {
			onChange: schema,
		},
		...options,
	});

	const FormRoot = ({ className, ...props }: ComponentProps<"form">) => (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className={cn("w-full space-y-6 lg:max-w-sm", className)}
			{...props}
		/>
	);

	const FormField: FieldComponent<TFormData, any> = (props: any) => (
		<form.Field
			{...props}
			children={(field) => (
				<FieldContextProvider value={field as any}>
					{props.render(
						Object.assign(field, {
							Label: FieldLabel,
							Detail: FieldDetail,
							Message: FieldMessage,
							Container: FieldContainer,
							Controller: FieldController,
							handleChangeExtended: handleChangeExtended(field as any),
						}),
					)}
				</FieldContextProvider>
			)}
		/>
	);

	const FormSubmit = ({
		className,
		...props
	}: ComponentProps<typeof Button>) => (
		<form.Subscribe
			selector={(state) => [state.canSubmit, state.isSubmitting]}
			children={([canSubmit, isSubmitting]) => (
				<Button
					type="submit"
					disabled={!canSubmit || isSubmitting}
					className={cn("w-full", className)}
					{...props}
				/>
			)}
		/>
	);

	return {
		...form,
		Root: FormRoot,
		Field: FormField,
		Submit: FormSubmit,
	} as FormExtended<TFormData>;
}

/**
 * Custom hook to consume Field Context with Reactivity
 */
function useField() {
	const fieldContext = useFieldContext();
	// This is the critical fix for state updates:
	const fieldState = fieldContext.useStore((state) => state);

	return {
		...fieldContext,
		state: fieldState,
		...fieldState.meta,
		hasErrors: fieldState.meta.errors.length > 0,
	};
}

function FieldLabel({ className, children, ...props }: FieldLabelProps) {
	const field = useField();
	if (!children) return null;

	return (
		<Label
			htmlFor={field.name.toString()}
			className={cn(
				"font-semibold",
				field.isTouched && field.hasErrors && "text-destructive",
				className,
			)}
			{...props}
		>
			{children}
		</Label>
	);
}

function FieldDetail({
	asChild,
	className,
	children,
	...props
}: FieldDetailProps) {
	const Comp = asChild ? Slot : "p";
	if (!children) return null;

	return (
		<Comp className={cn("text-sm text-muted-foreground", className)} {...props}>
			{children}
		</Comp>
	);
}

function FieldMessage({
	asChild,
	className,
	children,
	...props
}: FieldMessageProps) {
	const field = useField();
	const Comp = asChild ? Slot : "p";

	const error =
		field.isTouched && field.hasErrors ? field.state.meta.errors[0] : null;
	if (!children && !error) return null;

	return (
		<Comp
			className={cn(
				"text-sm",
				field.isTouched && field.hasErrors
					? "font-medium text-destructive"
					: "text-muted-foreground",
				className,
			)}
			{...props}
		>
			{error || children}
		</Comp>
	);
}

function FieldContainer({
	label,
	detail,
	message,
	disableController,
	className,
	children,
	...props
}: FieldContainerProps) {
	return (
		<div className={cn("space-y-2", className)} {...props}>
			<FieldLabel>{label}</FieldLabel>
			<FieldDetail>{detail}</FieldDetail>
			{disableController ? (
				children
			) : (
				<FieldController>{children}</FieldController>
			)}
			<FieldMessage>{message}</FieldMessage>
		</div>
	);
}

function FieldController({ children, ...props }: FieldControllerProps) {
	const field = useField();

	return (
		<Slot
			id={field.name.toString()}
			name={field.name.toString()}
			value={field.state.value ?? ""}
			onBlur={field.handleBlur}
			onChange={handleChangeExtended(field as any)}
			{...props}
		>
			{children}
		</Slot>
	);
}

// --- Utils ---

function handleChangeExtended(field: AnyFieldApi) {
	return (value: any) => {
		const isOptional =
			field.form.options.defaultValues?.[field.name as keyof any] === undefined;

		let finalValue = value;
		if (isInputChangeEvent(value)) {
			const {
				type,
				valueAsNumber,
				valueAsDate,
				checked,
				files,
				value: stringValue,
			} = value.target;
			switch (type) {
				case "number":
				case "range":
					finalValue = valueAsNumber;
					break;
				case "date":
					finalValue = valueAsDate;
					break;
				case "checkbox":
					finalValue = checked;
					break;
				case "file":
					finalValue = files;
					break;
				default:
					finalValue = stringValue;
			}
		}

		const isEmpty =
			finalValue === "" || finalValue === null || finalValue === undefined;
		field.handleChange(isOptional && isEmpty ? undefined : finalValue);
	};
}

function isInputChangeEvent(
	value: any,
): value is ChangeEvent<HTMLInputElement> {
	return value?.target instanceof HTMLInputElement;
}
