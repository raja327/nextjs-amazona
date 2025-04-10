import { Input } from '@/components/ui/input';
import { APP_NAME } from '@/lib/constants';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { SearchIcon } from 'lucide-react';

const categories = ['men', 'women', 'kids', 'accessories'];
export default async function Search() {
  return (
    <form action="/search" method="GET" className="flex items-stretch h-10">
      <Select name="category">
        <SelectTrigger className="min-h-full dark:border-gray-200 bg-gray-100 text-black border-r rounded-r-none rounded-none ">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="all">All</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="search"
        name="q"
        placeholder={`Search Site ${APP_NAME}`}
        className="flex-1 rounded-none dark:border-gray-200 bg-gray-100 text-black text-base h-full"
      />
      <button
        type="submit"
        className="bg-primary text-primary-foreground rounded-s-none rounded-e-md h-full px-3 py-2"
      >
        <SearchIcon className="w-6 h-6" />
      </button>
    </form>
  );
}
