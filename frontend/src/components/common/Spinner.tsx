import { Package } from "lucide-react";

interface SpinnerProps {
    text?: string;
    size?: number;
    color?: string;
    fullScreen?: boolean;
}

export default function Spinner({
    text = "Memuat...",
    size = 64,
    color = "text-slate-800",
    fullScreen = false,
}: SpinnerProps) {
    const spinner = (
        <div className="flex flex-col items-center justify-center gap-4">
            <div
                className="relative"
                style={{ width: size, height: size }}
            >
                <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                <div
                    className={`absolute inset-0 rounded-full border-4 border-transparent border-t-current animate-spin ${color}`}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Package
                        className={color}
                        size={Math.round(size * 0.38)}
                    />
                </div>
            </div>
            {text && (
                <p className="text-sm text-slate-500">{text}</p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                {spinner}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center p-8">
            {spinner}
        </div>
    );
}