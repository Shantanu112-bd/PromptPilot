import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

type SearchBoxProps = {
  name?: string;
  placeholder?: string;
  defaultValue?: string;
};

export function SearchBox({ name = "q", placeholder = "Search...", defaultValue }: SearchBoxProps) {
  return (
    <form className="relative w-full sm:max-w-sm">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <Input
        type="search"
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="pl-9"
        aria-label={placeholder}
      />
    </form>
  );
}
