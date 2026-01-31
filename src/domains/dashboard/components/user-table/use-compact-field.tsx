import type { DeepKeys } from "@tanstack/react-form";
import type { CompactFieldProps } from "./compact-field";

/**
 * Helper hook to create properly typed CompactField props
 * This ensures type inference works correctly for the 'name' prop and options
 */
export function useCompactField<TFormData extends Record<string, unknown>>() {
    return {
        /**
         * Create CompactField props with proper type inference
         * @example
         * const fieldProps = useCompactField<MyFormData>();
         * <CompactField {...fieldProps.create({ form, name: "country", label: "Region" })} />
         */
        create: <TName extends DeepKeys<TFormData>, TOptions extends readonly string[] = readonly string[]>(
            props: CompactFieldProps<TFormData, TName, TOptions>
        ) => props,
    };
}

/**
 * Alternative: Create a typed CompactField component for a specific form
 * @example
 * const TypedField = createTypedCompactField<MyFormData>();
 * <TypedField form={form} name="country" label="Region" />
 */
export function createTypedCompactField<TFormData extends Record<string, unknown>>() {
    return function TypedCompactField<TName extends DeepKeys<TFormData>, TOptions extends readonly string[] = readonly string[]>(
        props: CompactFieldProps<TFormData, TName, TOptions>
    ) {
        const { CompactField } = require("./compact-field");
        return <CompactField {...props} />;
    };
}
