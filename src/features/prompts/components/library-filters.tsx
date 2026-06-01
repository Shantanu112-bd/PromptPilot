"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, FilterX } from "lucide-react";
import { type GetPromptsInput } from "@/features/prompts/server/get-prompts";

type LibraryFiltersProps = {
  filters: Partial<GetPromptsInput>;
  onFilterChange: (filters: Partial<GetPromptsInput>) => void;
  tools?: { id: string; name: string }[];
  categories?: { id: string; name: string }[];
  collections?: { id: string; name: string }[];
};

export function LibraryFilters({ filters, onFilterChange, tools = [], categories = [], collections = [] }: LibraryFiltersProps) {
  
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, query: e.target.value, page: 1 });
  };

  const handleSelectChange = (key: keyof GetPromptsInput, value: string) => {
    onFilterChange({ ...filters, [key]: value === "all" ? undefined : value, page: 1 });
  };

  const clearFilters = () => {
    onFilterChange({
      query: "",
      categoryId: undefined,
      toolId: undefined,
      modelId: undefined,
      collectionId: undefined,
      sortBy: "createdAt",
      sortOrder: "desc",
      page: 1,
      favoritesOnly: false
    });
  };

  const hasActiveFilters = !!filters.query || !!filters.categoryId || !!filters.toolId || !!filters.collectionId || filters.favoritesOnly;

  return (
    <div className="flex flex-col gap-4 p-4 bg-card rounded-lg border shadow-sm">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search prompts by title, description, or content..." 
          className="pl-9"
          value={filters.query || ""}
          onChange={handleTextChange}
        />
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
        <Select value={filters.categoryId || "all"} onValueChange={(val) => handleSelectChange("categoryId", val)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.toolId || "all"} onValueChange={(val) => handleSelectChange("toolId", val)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Tool" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tools</SelectItem>
            {tools.map(t => (
              <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.collectionId || "all"} onValueChange={(val) => handleSelectChange("collectionId", val)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Collection" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Collections</SelectItem>
            {collections.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.sortBy || "createdAt"} onValueChange={(val) => handleSelectChange("sortBy", val)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Date Created</SelectItem>
            <SelectItem value="updatedAt">Last Updated</SelectItem>
            <SelectItem value="usage">Most Used</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          variant={filters.favoritesOnly ? "default" : "outline"}
          onClick={() => onFilterChange({ ...filters, favoritesOnly: !filters.favoritesOnly, page: 1 })}
          className="ml-auto"
        >
          Favorites {filters.favoritesOnly ? "On" : "Off"}
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" size="icon" onClick={clearFilters} title="Clear filters">
            <FilterX className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
