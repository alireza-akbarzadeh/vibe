import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react";
export default function BackButton() {
    return (
        <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300`}
        >
            <Link
                to="/"
                className="absolute top-6 left-6 z-20 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Back</span>
            </Link>

        </motion.div>
    )
}
