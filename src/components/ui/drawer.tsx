import type { ComponentProps } from 'react'
import { Drawer as DrawerPrimitive } from 'vaul'
import { cn } from '@/lib/utils'



function Drawer({ shouldScaleBackground = true, ...props }: ComponentProps<typeof DrawerPrimitive.Root>) {
    return (
        <DrawerPrimitive.Root
            shouldScaleBackground={shouldScaleBackground}
            {...props}
        />
    )
}

const DrawerTrigger = DrawerPrimitive.Trigger

const DrawerPortal = DrawerPrimitive.Portal

const DrawerClose = DrawerPrimitive.Close

function DrawerOverlay({ className, ...props }: ComponentProps<typeof DrawerPrimitive.Overlay>) {
    return (
        <DrawerPrimitive.Overlay
            className={cn('fixed inset-0 z-50 bg-black/80', className)}
            {...props}
        />
    )
}

function DrawerContent({ className, ...props }: ComponentProps<typeof DrawerPrimitive.Content>) {
    return (
        <DrawerPortal>
            <DrawerOverlay />
            <DrawerPrimitive.Content
                aria-describedby={undefined}
                className={cn(
                    'fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background',
                    className,
                )}
                {...props}
            />
        </DrawerPortal>
    )
}

function DrawerHeader({ className, ...props }: ComponentProps<'div'>) {
    return (
        <div
            className={cn('grid gap-1.5 p-4 text-center sm:text-left', className)}
            {...props}
        />
    )
}

function DrawerFooter({ className, ...props }: ComponentProps<'div'>) {
    return (
        <div
            className={cn('flex flex-col gap-2 p-4', className)}
            {...props}
        />
    )
}

function DrawerTitle({ className, ...props }: ComponentProps<typeof DrawerPrimitive.Title>) {
    return (
        <DrawerPrimitive.Title
            className={cn(
                'text-lg font-semibold leading-none tracking-tight',
                className,
            )}
            {...props}
        />
    )
}

function DrawerDescription({ className, ...props }: ComponentProps<typeof DrawerPrimitive.Description>) {
    return (
        <DrawerPrimitive.Description
            className={cn('text-sm text-muted-foreground', className)}
            {...props}
        />
    )
}

export {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerPortal,
    DrawerTitle,
    DrawerTrigger,
}


