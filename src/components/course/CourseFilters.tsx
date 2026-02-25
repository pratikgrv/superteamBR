"use client";

import { Filter, Search, X } from "lucide-react";
import { memo } from "react";
import type { CourseDifficulty } from "@/lib/data/courses";

// In a real app with shadcn, you'd use select, popovers, etc.
// For the MVP, we are building simple tailwind native controls.

export interface CourseFilterState {
  search: string;
  difficulty: CourseDifficulty | "All";
  topic: string | "All";
}

interface CourseFiltersProps {
  filters: CourseFilterState;
  onFilterChange: (filters: CourseFilterState) => void;
  availableTopics: string[];
}

export const CourseFilters = memo(function CourseFilters({
  filters,
  onFilterChange,
  availableTopics,
}: CourseFiltersProps) {
  const updateFilter = (key: keyof CourseFilterState, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({ search: "", difficulty: "All", topic: "All" });
  };

  const hasActiveFilters =
    filters.difficulty !== "All" ||
    filters.topic !== "All" ||
    filters.search !== "";

  return (
    <div className="flex flex-col gap-4 p-4 bg-muted/30 rounded-xl border border-border">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search courses..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>

        {/* Topic Filter */}
        <div className="w-full md:w-48">
          <select
            value={filters.topic}
            onChange={(e) => updateFilter("topic", e.target.value)}
            className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all appearance-none cursor-pointer"
          >
            <option value="All">All Topics</option>
            {availableTopics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Filter */}
        <div className="w-full md:w-48">
          <select
            value={filters.difficulty}
            onChange={(e) => updateFilter("difficulty", e.target.value)}
            className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all appearance-none cursor-pointer"
          >
            <option value="All">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center justify-center px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors"
          >
            <X className="w-4 h-4 mr-1.5" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
});
