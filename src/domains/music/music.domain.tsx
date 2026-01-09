import { useState } from "react";
import { SearchHeader } from "../movies/components";

export function MusicDomain() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div>
            <SearchHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            MusicDomain
        </div>
    )
}
