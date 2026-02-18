import { useStore } from '@tanstack/react-store'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, Check, ExternalLink, MessageSquare, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { actions, dashboardStore } from '@/domains/dashboard/store/dashboard.store'
import { cn } from '@/lib/utils'

export function NotificationCenter() {
    const notifications = useStore(dashboardStore, (state) => state.notifications)
    const messages = useStore(dashboardStore, (state) => state.messages)
    const isOpen = useStore(dashboardStore, (state) => state.notificationOpen)

    const unreadNotifs = notifications.filter(n => !n.read).length
    const unreadMsgs = messages.filter(m => m.unread).length
    const totalUnread = unreadNotifs + unreadMsgs

    return (
        <Popover open={isOpen} onOpenChange={actions.setNotificationOpen}>
            <PopoverTrigger asChild>
                <Button size="icon" variant="ghost" className="h-12 w-12 rounded-full bg-linear-to-r from-primary to-secondary relative hover:bg-muted group">
                    <motion.div
                        animate={totalUnread > 0 ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
                        transition={{ repeat: totalUnread > 0 ? Infinity : 0, repeatDelay: 4, duration: 0.5 }}
                    >
                        <Bell className={cn("h-5 w-5 transition-colors", totalUnread > 0 ? "text-primary" : "text-muted-foreground")} />
                    </motion.div>
                    {totalUnread > 0 && (
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary ring-2 ring-background animate-pulse" />
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-80 sm:w-96 p-0 rounded-2xl overflow-hidden shadow-2xl border-border/50 bg-card/95 backdrop-blur-xl z-50">
                <Tabs defaultValue="alerts" className="w-full">
                    <div className="flex items-center justify-between p-4 border-b bg-muted/30">
                        <TabsList className="grid grid-cols-2 w-44 h-8 bg-background/50 border border-border/40">
                            <TabsTrigger value="alerts" className="text-[10px] font-bold uppercase tracking-tight">
                                Alerts {unreadNotifs > 0 && `(${unreadNotifs})`}
                            </TabsTrigger>
                            <TabsTrigger value="messages" className="text-[10px] font-bold uppercase tracking-tight">
                                Messages {unreadMsgs > 0 && `(${unreadMsgs})`}
                            </TabsTrigger>
                        </TabsList>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => actions.markAllRead()}
                            className="h-8 px-2 text-[10px] font-bold uppercase tracking-tighter opacity-70 hover:opacity-100 hover:text-primary transition-all active:scale-90"
                        >
                            Clear All
                        </Button>
                    </div>

                    <TabsContent value="alerts" className="m-0 focus-visible:outline-none">
                        <ScrollArea className="h-[400px]">
                            <div className="flex flex-col">
                                <AnimatePresence mode="popLayout">
                                    {notifications.length > 0 ? (
                                        notifications.map((n, i) => (
                                            <NotificationItem key={n.id} n={n} i={i} />
                                        ))
                                    ) : (
                                        <EmptyStateContainer key="empty-alerts">
                                            <EmptyState icon={<Bell className="h-8 w-8" />} text="No new notifications" />
                                        </EmptyStateContainer>
                                    )}
                                </AnimatePresence>
                            </div>
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="messages" className="m-0 focus-visible:outline-none">
                        <ScrollArea className="h-[400px]">
                            <div className="flex flex-col">
                                <AnimatePresence mode="popLayout">
                                    {messages.length > 0 ? (
                                        messages.map((m, i) => (
                                            <MessageItem key={m.id} m={m} i={i} />
                                        ))
                                    ) : (
                                        <EmptyStateContainer key="empty-msgs">
                                            <EmptyState icon={<MessageSquare className="h-8 w-8" />} text="No new messages" />
                                        </EmptyStateContainer>
                                    )}
                                </AnimatePresence>
                            </div>
                        </ScrollArea>
                    </TabsContent>

                    <div className="p-2 bg-muted/20 border-t">
                        <Button variant="outline" className="w-full h-9 text-[10px] font-bold uppercase tracking-widest gap-2 rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm">
                            Management Console <ExternalLink className="h-3 w-3" />
                        </Button>
                    </div>
                </Tabs>
            </PopoverContent>
        </Popover>
    )
}

/* --- Sub-Components for Cleanliness & Animations --- */

function NotificationItem({ n, i }: { n: any, i: number }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{
                opacity: 0,
                x: -50,
                filter: "blur(4px)",
                transition: { duration: 0.2, delay: i * 0.03 }
            }}
            onClick={() => actions.markAsRead(n.id)}
            className={cn(
                "p-4 border-b border-border/40 hover:bg-muted/50 transition-colors cursor-pointer relative group",
                !n.read && "bg-primary/5"
            )}
        >
            <div className="flex justify-between items-start mb-1">
                <h5 className="text-sm font-semibold pr-4">{n.title}</h5>
                <span className="text-[10px] text-muted-foreground font-medium">{n.time}</span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{n.description}</p>
            <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0">
                <Button variant="secondary" size="sm" className="h-6 px-2 text-[10px] font-bold rounded-md">
                    <Check className="h-3 w-3 mr-1" /> Resolve
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-3 w-3" />
                </Button>
            </div>
        </motion.div>
    )
}

function MessageItem({ m, i }: { m: any, i: number }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: 50, filter: "blur(4px)", transition: { delay: i * 0.03 } }}
            onClick={() => actions.markMessageRead(m.id)}
            className="p-4 border-b border-border/40 hover:bg-muted/50 transition-colors cursor-pointer flex items-center gap-3 group"
        >
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 text-primary">
                <span className="text-xs font-bold uppercase">{m.user[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                    <p className="text-sm font-semibold truncate">{m.user}</p>
                    <span className="text-[10px] text-muted-foreground">{m.time}</span>
                </div>
                <p className={cn("text-xs truncate", m.unread ? "text-foreground font-medium" : "text-muted-foreground")}>
                    {m.preview}
                </p>
            </div>
            {m.unread && <div className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.6)]" />}
        </motion.div>
    )
}

function EmptyStateContainer({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 100, delay: 0.2 }}
            className="py-20"
        >
            {children}
        </motion.div>
    )
}

function EmptyState({ icon, text }: { icon: React.ReactNode, text: string }) {
    return (
        <div className="flex flex-col items-center justify-center px-4 text-center opacity-40">
            <div className="mb-3 p-4 rounded-full bg-muted/20">{icon}</div>
            <p className="text-[10px] font-bold uppercase tracking-widest">{text}</p>
        </div>
    )
}