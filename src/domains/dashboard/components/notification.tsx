import { Bell, Check, ExternalLink, MessageSquare, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

// Mock Data - In production, this would come from your API/Query
const notifications = [
    { id: 1, title: 'New System Update', description: 'v2.4.0 is now live.', time: '2m ago', read: false, type: 'system' },
    { id: 2, title: 'Server Warning', description: 'High CPU usage detected on Node-01.', time: '15m ago', read: false, type: 'alert' },
]

const messages = [
    { id: 1, user: 'John Doe', preview: 'Hey, I can\'t access the movie library...', time: '1h ago', unread: true },
    { id: 2, user: 'Sarah Smith', preview: 'The subscription payment failed.', time: '3h ago', unread: false },
]

export default function NotificationCenter() {
    const unreadCount = notifications.filter(n => !n.read).length + messages.filter(m => m.unread).length

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl relative hover:bg-muted">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary ring-2 ring-background animate-pulse" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 sm:w-96 p-0 rounded-xl overflow-hidden shadow-2xl border-border/50">
                <Tabs defaultValue="alerts" className="w-full">
                    <div className="flex items-center justify-between p-4 border-b bg-muted/30">
                        <TabsList className="grid grid-cols-2 w-40 h-8 bg-background/50">
                            <TabsTrigger value="alerts" className="text-xs">Alerts</TabsTrigger>
                            <TabsTrigger value="messages" className="text-xs">Messages</TabsTrigger>
                        </TabsList>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-[10px] font-bold uppercase tracking-tighter opacity-70 hover:opacity-100">
                            Mark all as read
                        </Button>
                    </div>

                    <TabsContent value="alerts" className="m-0">
                        <ScrollArea className="h-[350px]">
                            {notifications.length > 0 ? (
                                <div className="flex flex-col">
                                    {notifications.map((n) => (
                                        <div key={n.id} className={cn(
                                            "p-4 border-b border-border/40 hover:bg-muted/50 transition-colors cursor-pointer relative group",
                                            !n.read && "bg-primary/5"
                                        )}>
                                            <div className="flex justify-between items-start mb-1">
                                                <h5 className="text-sm font-semibold pr-4">{n.title}</h5>
                                                <span className="text-[10px] text-muted-foreground whitespace-nowrap">{n.time}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground line-clamp-2">{n.description}</p>
                                            <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md"><Check className="h-3 w-3" /></Button>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md text-destructive"><Trash2 className="h-3 w-3" /></Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState icon={<Bell className="h-8 w-8" />} text="No new notifications" />
                            )}
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="messages" className="m-0">
                        <ScrollArea className="h-[350px]">
                            {messages.length > 0 ? (
                                <div className="flex flex-col">
                                    {messages.map((m) => (
                                        <div key={m.id} className="p-4 border-b border-border/40 hover:bg-muted/50 transition-colors cursor-pointer flex items-center gap-3 group">
                                            <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0 border border-border/50">
                                                <span className="text-xs font-bold uppercase">{m.user[0]}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center mb-0.5">
                                                    <p className="text-sm font-semibold truncate">{m.user}</p>
                                                    <span className="text-[10px] text-muted-foreground">{m.time}</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground truncate">{m.preview}</p>
                                            </div>
                                            {m.unread && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState icon={<MessageSquare className="h-8 w-8" />} text="No new messages" />
                            )}
                        </ScrollArea>
                    </TabsContent>

                    <div className="p-2 bg-muted/20 border-t">
                        <Button variant="outline" className="w-full h-8 text-xs font-medium gap-2 rounded-lg">
                            View All Activity <ExternalLink className="h-3 w-3" />
                        </Button>
                    </div>
                </Tabs>
            </PopoverContent>
        </Popover>
    )
}

function EmptyState({ icon, text }: { icon: React.ReactNode, text: string }) {
    return (
        <div className="flex flex-col items-center justify-center h-full py-12 px-4 text-center opacity-40">
            {icon}
            <p className="mt-2 text-sm font-medium">{text}</p>
        </div>
    )
}