import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CardItemProps } from "@/types/CardItemProps";
import Image from "next/image";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export default function CardItem({
  coverImage,
  title,
  description,
  author,
  genre,
  total,
  available,
  isSelected,
  onSelect,
}: CardItemProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (onSelect) {
      e.preventDefault();
      e.stopPropagation();
      onSelect();
    }
  };

  return (
    <Card
      className={cn(
        "gap-0 overflow-hidden h-full flex flex-col cursor-pointer transition-all duration-300 relative",
        isSelected
          ? "ring-2 ring-primary border-primary bg-primary/5"
          : "hover:border-primary/50",
      )}
      onClick={handleClick}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 z-10 text-primary animate-in zoom-in-50 duration-300">
          <IconCircleCheckFilled size={24} />
        </div>
      )}
      <CardHeader className="h-[120px] p-4">
        <div className="flex gap-4 items-start">
          {coverImage && (
            <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-md">
              <Image
                src={coverImage}
                alt={title || "Book cover"}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold line-clamp-2">
              {title}
            </CardTitle>
            {author && (
              <p className="text-sm text-muted-foreground mt-1">{author}</p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardFooter className="flex flex-col items-start gap-3 pt-3 flex-1">
        <div className="flex flex-wrap gap-2">
          {genre && <Badge variant="outline">{genre}</Badge>}
          {total !== undefined && (
            <Badge variant="outline">Total: {total}</Badge>
          )}
          {available !== undefined && (
            <Badge variant="outline">Available: {available}</Badge>
          )}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
