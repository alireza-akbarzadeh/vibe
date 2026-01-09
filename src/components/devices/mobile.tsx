export function MobileDevice() {
    return (
        <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-3xl p-1 shadow-xl">
            <div className="aspect-9/19 rounded-2xl overflow-hidden bg-black">
                <img
                    src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=400&fit=crop"
                    alt="Mobile view"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent">
                    <div className="absolute bottom-2 left-2 right-2">
                        <div className="h-1 w-full bg-white/20 rounded-full">
                            <div className="h-full w-1/3 bg-green-400 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
