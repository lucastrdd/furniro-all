import React from "react";
import { useSearchParams } from "react-router-dom";
import clsx from "clsx";
import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";

type FilterBarProps = {
    totalResults: number;
    currentPage: number;
    currentLimit: number;
};

const FilterBar = ({
    totalResults,
    currentPage,
    currentLimit,
}: FilterBarProps) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newSort = event.target.value;

        if (newSort) {
            searchParams.set("sort", newSort);
        } else {
            searchParams.delete("sort");
        }

        searchParams.set("page", "1");
        setSearchParams(searchParams);
    };

    const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newLimit = event.target.value;

        if (newLimit && Number(newLimit) > 0) {
            searchParams.set("limit", newLimit);
        } else {
            searchParams.delete("limit");
        }

        searchParams.set("page", "1");
        setSearchParams(searchParams);
    };

    const currentSort = searchParams.get("sort") || "";
    const startResult =
        totalResults === 0 ? 0 : (currentPage - 1) * currentLimit + 1;
    const endResult = Math.min(currentPage * currentLimit, totalResults);

    return (
        <div className="flex w-full flex-col items-center justify-between gap-4 bg-[#F9F1E7] px-4 py-6 lg:flex-row lg:px-12">
            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start lg:gap-6">
                <div className="flex cursor-pointer items-center gap-2 transition-opacity hover:opacity-80">
                    <SlidersHorizontal
                        size={19}
                        color="black"
                        strokeWidth={2}
                    />
                    <span className="font-poppins text-base font-normal">
                        Filter
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <LayoutGrid
                        size={16}
                        color="black"
                        className="cursor-pointer transition-opacity hover:opacity-80"
                    />

                    <List
                        size={16}
                        color="black"
                        className="cursor-pointer transition-opacity hover:opacity-80"
                    />
                </div>

                <div className="mx-2 hidden h-9 w-px bg-[#9F9F9F] lg:block" />

                <p className="font-poppins text-base font-normal text-black">
                    Showing {startResult}–{endResult} of {totalResults} results
                </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-6">
                <div className="flex items-center gap-4">
                    <label
                        htmlFor="limit"
                        className="font-poppins text-base font-normal text-black">
                        Show
                    </label>

                    <input
                        id="limit"
                        type="number"
                        min="1"
                        value={currentLimit}
                        onChange={handleLimitChange}
                        className={clsx(
                            "h-14 w-14 bg-white text-center text-[#9F9F9F]",
                            "border-none font-poppins text-base outline-none",
                            "focus:ring-1 focus:ring-gray-300",
                        )}
                    />
                </div>

                <div className="flex items-center gap-4">
                    <label
                        htmlFor="sort"
                        className="font-poppins text-base font-normal text-black">
                        Sort by
                    </label>

                    <select
                        id="sort"
                        value={currentSort}
                        onChange={handleSortChange}
                        className={clsx(
                            "h-14 max-w-full cursor-pointer bg-white px-4 text-[#9F9F9F]",
                            "border-none font-poppins text-base outline-none",
                            "focus:ring-1 focus:ring-gray-300",
                        )}>
                        <option value="">Default</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
