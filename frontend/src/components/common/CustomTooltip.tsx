import type { ReactElement, ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface CustomTooltipProps {
    content: ReactNode;
    children: ReactElement;
};

export default function CustomTooltip({
    content,
    children,
}: CustomTooltipProps) {
    return (
        <Tooltip>
            <TooltipTrigger render={children} />
            <TooltipContent>
                {content}
            </TooltipContent>
        </Tooltip>
    );
};

