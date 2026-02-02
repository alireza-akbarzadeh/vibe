import { motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { DesktopPlayer } from "./desktop-bottom-player";
import { MobilePlayer } from "./mobile-bottom-player";

export function BottomPlayer() {
    const { isMobile } = useMediaQuery();
    return (
        <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-0 left-0 right-0 z-100 bg-black/90 backdrop-blur-xl border-t border-white/5 pb-[env(safe-area-inset-bottom)]"
        >
            {isMobile ? <MobilePlayer /> : <DesktopPlayer />}
        </motion.div>
    );
}