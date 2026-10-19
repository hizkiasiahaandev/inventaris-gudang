import Spinner from "@/components/common/Spinner";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search } from "lucide-react";

export default function ManageItems() {

    const items = [
        { label: "All", value: "all" },
        { label: "Active", value: "active" },
        { label: "Nonactive", value: "nonactive" }
    ];


    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between md:items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-800">
                        Manage Items
                    </h2>
                    <p className="text-sm text-slate-500">
                        Manage all inventory items
                    </p>
                </div>
                <button
                    className="inline-flex transition-all duration-100 items-center gap-2 px-4 bg-slate-800 rounded-lg shadow-sm hover:shadow-xl text-sm text-white focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 font-medium shadow-slate-600/15 border-slate-300/50 border py-2"
                >
                    <Plus size={14} />
                    Add Item
                </button>
            </div>

            <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-b border-slate-200">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <Input
                            type="text"
                            placeholder="Search Sku or name..."
                            className="w-full pl-9 py-5 border shadow-sm border-slate-200"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600 font-medium">Status:</span>
                        <Select items={items}>
                            <SelectTrigger className="w-full border border-slate-200 shadow-sm sm:max-w-52">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent className="max-w-full">
                                <SelectGroup>
                                    <SelectLabel>Status</SelectLabel>
                                    {items.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-white font-semibold">
                            <tr className="bg-slate-800">
                                <th className="whitespace-nowrap px-3 py-2.5">SKU</th>
                                <th className="whitespace-nowrap px-3 py-2.5">Name</th>
                                <th className="whitespace-nowrap px-3 py-2.5">Description</th>
                                <th className="whitespace-nowrap px-3 py-2.5">Stock</th>
                                <th className="whitespace-nowrap px-3 py-2.5">Minimum Stock</th>
                                <th className="whitespace-nowrap px-3 py-2.5">Unit</th>
                                <th className="whitespace-nowrap px-3 py-2.5">Purchase Price</th>
                                <th className="whitespace-nowrap px-3 py-2.5">Status</th>
                                <th className="whitespace-nowrap px-3 py-2.5">Category</th>
                                <th className="whitespace-nowrap px-3 py-2.5">Supplier</th>
                                <th className="whitespace-nowrap px-3 py-2.5">Created At</th>
                                <th className="whitespace-nowrap px-3 py-2.5">Updated At</th>
                                <th className="whitespace-nowrap px-3 py-2.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan={13} className="px-3 py-6">
                                    <Spinner text="Loading data" size={66} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}