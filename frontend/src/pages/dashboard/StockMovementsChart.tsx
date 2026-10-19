"use client";

import type { MovementChart } from "@/types/dashboard.types";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

interface Props {
    data: MovementChart[];
}

function DarkTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg bg-gray-900 px-3 py-2 shadow-xl">
            <p className="mb-1 text-[11px] font-semibold text-gray-300">{label}</p>
            {payload.map((p: any) => (
                <div key={p.dataKey} className="flex items-center gap-2 text-xs">
                    <span
                        className="size-2 rounded-full"
                        style={{ backgroundColor: p.color }}
                    />
                    <span className="text-gray-400">{p.name}:</span>
                    <span className="font-semibold text-white">{p.value}</span>
                </div>
            ))}
        </div>
    );
}

export default function StockMovementsChart({ data }: Props) {
    return (
        <div className="h-64  w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />

                    <Tooltip content={<DarkTooltip />} cursor={{ stroke: "#e5e7eb", strokeDasharray: "4 4" }} />

                    <Legend
                        verticalAlign="top"
                        align="right"
                        height={30}
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ fontSize: "12px", color: "#4b5563" }}
                    />

                    <Line
                        type="natural"
                        dataKey="stockIn"
                        name="Stock In"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ r: 3, fill: "#fff", stroke: "#3b82f6", strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: "#3b82f6", stroke: "#fff", strokeWidth: 3 }}
                    />
                    <Line
                        type="natural"
                        dataKey="stockOut"
                        name="Stock Out"
                        stroke="#f43f5e"
                        strokeWidth={3}
                        dot={{ r: 3, fill: "#fff", stroke: "#f43f5e", strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: "#f43f5e", stroke: "#fff", strokeWidth: 3 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}