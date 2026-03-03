"use client";

import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CourseDifficulty } from "@/services/models/types";

// Common categories and durations for the platform
const CATEGORIES = ["DeFi", "NFTs", "Core", "Gaming", "Security"];
const DURATIONS = ["< 2h", "2h - 5h", "> 5h"];
const DIFFICULTIES: CourseDifficulty[] = ["Beginner", "Intermediate", "Advanced"];

interface CourseFiltersProps {
  filters: {
    search: string;
    difficulty: string[];
    duration: string[];
    category: string[];
  };
  setFilter: (key: string, value: string | string[]) => void;
  clearFilters: () => void;
}

export function CourseFilters({ filters, setFilter, clearFilters }: CourseFiltersProps) {
  const handleCheckboxChange = (key: string, value: string, checked: boolean) => {
    const currentList = filters[key as keyof typeof filters] as string[];
    let newList;
    if (checked) {
      newList = [...currentList, value];
    } else {
      newList = currentList.filter(item => item !== value);
    }
    setFilter(key, newList);
  };

  const hasActiveFilters = filters.search || filters.difficulty.length || filters.duration.length || filters.category.length;

  return (
    <div className="w-full space-y-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search courses..." 
          className="pl-9 h-11 bg-background"
          value={filters.search}
          onChange={(e) => setFilter("search", e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between mt-4 mb-2">
        <div className="flex items-center gap-2 font-semibold">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs text-muted-foreground hover:text-foreground">
            <X className="mr-1 h-3 w-3" /> Clear All
          </Button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={["difficulty", "category", "duration"]} className="w-full">
        {/* Difficulty */}
        <AccordionItem value="difficulty" className="border-b-0">
          <AccordionTrigger className="py-2 hover:no-underline font-medium text-sm">
            Difficulty
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <div className="flex flex-col gap-3">
              {DIFFICULTIES.map(diff => (
                <div key={diff} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`diff-${diff}`} 
                    checked={filters.difficulty.includes(diff)}
                    onCheckedChange={(c) => handleCheckboxChange('difficulty', diff, c as boolean)}
                  />
                  <label htmlFor={`diff-${diff}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {diff}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Category */}
        <AccordionItem value="category" className="border-b-0">
          <AccordionTrigger className="py-2 hover:no-underline font-medium text-sm border-t mt-2">
            Category
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <div className="flex flex-col gap-3">
              {CATEGORIES.map(cat => (
                <div key={cat} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`cat-${cat}`}
                    checked={filters.category.includes(cat)}
                    onCheckedChange={(c) => handleCheckboxChange('category', cat, c as boolean)}
                  />
                  <label htmlFor={`cat-${cat}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {cat}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Duration */}
        <AccordionItem value="duration" className="border-b-0">
          <AccordionTrigger className="py-2 hover:no-underline font-medium text-sm border-t mt-2">
            Duration
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <div className="flex flex-col gap-3">
              {DURATIONS.map(dur => (
                <div key={dur} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`dur-${dur}`}
                    checked={filters.duration.includes(dur)}
                    onCheckedChange={(c) => handleCheckboxChange('duration', dur, c as boolean)}
                  />
                  <label htmlFor={`dur-${dur}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {dur}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
