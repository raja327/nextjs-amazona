import { Star } from 'lucide-react';

export function Rating({
  rating = 0,
  size = 6,
}: {
  rating: number;
  size?: number;
}) {
  const fullStars = Math.floor(rating);
  const partialStars = rating % 1;
  const emptyStars = 5 - Math.ceil(rating);
  return (
    <div className="flex items-center" aria-label={`${rating} out of 5 stars`}>
      {[...Array(fullStars)].map((_, i) => (
        <Star
          className={`w-${size} h-${size} fill-primary text-primary`}
          key={`full-${i}`}
          size={size}
        />
      ))}
      {partialStars > 0 && (
        <div className="relative">
          <Star className={`w-${size} h-${size} text-primary`} />
          <div
            className="absolute top-0 left-0 overflow-hidden"
            style={{ width: `${partialStars * 100}%` }}
          >
            <Star className={`w-${size} h-${size} text-primary fill-primary`} />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star
          className={`w-${size} h-${size} text-primary`}
          key={`empty-${i}`}
          size={size}
        />
      ))}
    </div>
  );
}
