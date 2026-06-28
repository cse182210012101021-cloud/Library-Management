export interface CardItemProps {
  coverImage?: string;
  title?: string;
  author: string;
  description?: string;
  genre?: string;
  total?: number;
  available?: number;
  bookDescription?: string;
  isSelected?: boolean;
  onSelect?: () => void;
}
