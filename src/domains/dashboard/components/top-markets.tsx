import { motion } from "framer-motion";

export function TopMarkets() {
    const markets = [
        { name: 'United States', value: 100 },
        { name: 'United Kingdom', value: 80 },
        { name: 'Germany', value: 60 },
        { name: 'Japan', value: 40 }
    ];

    // Animation variants for the container to stagger the bars
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <div className="rounded-3xl border border-border/40 bg-card/30 p-6 backdrop-blur-xl">
            <h3 className="mb-6 font-bold tracking-tight text-foreground">Top Markets</h3>
            <motion.div
                className="space-y-5"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                {markets.map((loc) => (
                    <motion.div
                        key={loc.name}
                        variants={itemVariants}
                        className="flex flex-col gap-2"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                {loc.name}
                            </span>
                            <span className="text-xs font-mono font-bold text-primary">
                                {loc.value}%
                            </span>
                        </div>

                        <div className="relative h-2 w-full bg-muted/30 rounded-full overflow-hidden">
                            {/* Animated Inner Bar */}
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${loc.value}%` }}
                                transition={{
                                    type: "spring",
                                    bounce: 0.2,
                                    duration: 1.5,
                                    delay: 0.3
                                }}
                                viewport={{ once: true }}
                                className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full"
                            />
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}