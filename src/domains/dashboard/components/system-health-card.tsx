import { motion } from 'framer-motion';

export function SystemHealthCard() {
    const systems = [
        { name: "API Gateway", status: "online" },
        { name: "Media Transcoder", status: "online" },
        { name: "Auth Service", status: "degraded" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-border/40 bg-primary/[0.03] p-6 border-dashed backdrop-blur-md"
        >
            <h4 className="text-sm font-bold mb-4 uppercase tracking-widest text-muted-foreground">System Health</h4>
            <div className="space-y-4">
                {systems.map((sys) => (
                    <div key={sys.name} className="flex items-center justify-between">
                        <span className="text-xs font-medium text-foreground/70">{sys.name}</span>
                        <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold uppercase ${sys.status === 'online' ? 'text-emerald-500' : 'text-amber-500'
                                }`}>
                                {sys.status}
                            </span>
                            <div className={`size-2 rounded-full ${sys.status === 'online' ? 'bg-emerald-500' : 'bg-amber-500'
                                } ${sys.status === 'online' ? 'animate-pulse' : ''}`} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-border/20">
                <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                    <span>Uptime (24h)</span>
                    <span className="font-mono">99.98%</span>
                </div>
            </div>
        </motion.div>
    );
}