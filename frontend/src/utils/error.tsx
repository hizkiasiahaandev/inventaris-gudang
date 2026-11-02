import { Info } from "lucide-react";

type ErrorMessageProps = {
    message?: string
}

export function ErrorMessage({ message }: ErrorMessageProps) {
    if (!message) return null;

    return (
        <p role="alert" className="flex items-center whitespace-nowrap gap-1 text-xs text-destructive">
            <Info size={13} />
            {message}
        </p>
    );
}