import { bookGenres } from "@/constant/default-values/BookGenres";

export const getGenreLabel = (value: string): string => {
  const genre = bookGenres.find((g) => g.value === value);
  return genre ? genre.label : value;
};
