import { Layers, Play, SquareSquare } from 'lucide-react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '../ui/accordion'
import { Button } from '../ui/button'
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from '../ui/sheet'

const DATA = [
    {
        season: 1,
        episodes: [1, 2, 3, 4, 5],
    },
    {
        season: 2,
        episodes: [1, 2, 3],
    },
]

export function MoreEpisode() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Layers />
                </Button>
            </SheetTrigger>

            {/* Sheet from RIGHT */}
            <SheetContent side="right" className="w-90 sm:w-105">
                <SheetTitle className="mb-4 text-lg font-semibold">
                    Episodes
                </SheetTitle>

                <Accordion type="single" collapsible className="space-y-2">
                    {DATA.map((season) => (
                        <AccordionItem
                            key={season.season}
                            value={`season-${season.season}`}
                            className="border rounded-lg px-2"
                        >
                            <AccordionTrigger className="text-left">
                                Season {season.season}
                            </AccordionTrigger>

                            <AccordionContent>
                                <div className="space-y-2 py-2">
                                    {season.episodes.map((ep) => (
                                        <Button
                                            key={ep}
                                            variant="ghost"
                                            className="w-full justify-between"
                                        >
                                            <span>Episode {ep}</span>
                                            <Play className="h-4 w-4 opacity-60" />
                                        </Button>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </SheetContent>
        </Sheet>
    )
}
