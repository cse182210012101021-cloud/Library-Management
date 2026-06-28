import { BookGenre } from "../enum/BookGenre";

export const bookGenres = [
  { label: "Fiction", value: BookGenre.FICTION },
  { label: "Non-Fiction", value: BookGenre.NON_FICTION },
  { label: "Mystery", value: BookGenre.MYSTERY },
  { label: "Romance", value: BookGenre.ROMANCE },
  { label: "Science Fiction", value: BookGenre.SCIENCE_FICTION },
  { label: "Fantasy", value: BookGenre.FANTASY },
  { label: "Biography", value: BookGenre.BIOGRAPHY },
  { label: "Self-Help", value: BookGenre.SELF_HELP },
  { label: "History", value: BookGenre.HISTORY },
  { label: "Horror", value: BookGenre.HORROR },
  { label: "CSE", value: BookGenre.CSE },
  { label: "EEE", value: BookGenre.EEE },
  { label: "Civil", value: BookGenre.CIVIL },
  { label: "Law", value: BookGenre.LAW },
  { label: "Math", value: BookGenre.MATH },
  { label: "Literature", value: BookGenre.LITERATURE },
  { label: "Others", value: BookGenre.OTHERS },
];

export const demoData = {
  title: "Book Name",
  description: "Author Name",
  message:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis odio itaque porro cupiditate mollitia deleniti saepe, eveniet tenetur earum! Exercitationem cum, dolores atque labore nisi id quia obcaecati temporibus excepturi!",
  total: 10,
  available: 6,
};
