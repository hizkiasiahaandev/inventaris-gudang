import { Info } from "lucide-react";

export function ErrorMessage({ message }: { message?: string }) {
    if (!message) return null;

    return (
        <p role="alert" className="flex items-center whitespace-nowrap gap-1 text-xs text-destructive">
            <Info size={13} />
            {message}
        </p>
    );
}