export default function Footer() {
    const year = new Intl.DateTimeFormat("id", {
        timeZone: "Asia/Tokyo",
        year: "numeric",
    }).format(new Date());
    return (
        <div className="px-4 pb-4">
            <div className="pt-4 border-t border-gray-100">
                <p className="text-center text-xs text-gray-400">
                    &copy; {year} InvenTrack. All rights reserved.
                </p>
            </div>
        </div>
    );
}