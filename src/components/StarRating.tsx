import { Star, StarHalf } from 'lucide-react';

interface StarRatingProps {
    rating: number;
    maxRating?: number;
    size?: 'sm' | 'md' | 'lg';
    showValue?: boolean;
}

export default function StarRating({
    rating,
    maxRating = 5,
    size = 'md',
    showValue = false
}: StarRatingProps) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

    const sizeClasses = {
        sm: 'w-3.5 h-3.5',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    };

    const starClass = sizeClasses[size];

    return (
        <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
                {/* Full Stars */}
                {Array.from({ length: fullStars }).map((_, i) => (
                    <Star
                        key={`full-${i}`}
                        className={`${starClass} fill-amber-400 text-amber-400`}
                    />
                ))}

                {/* Half Star */}
                {hasHalfStar && (
                    <div className="relative">
                        <Star className={`${starClass} text-neutral-600`} />
                        <div className="absolute inset-0 overflow-hidden w-1/2">
                            <Star className={`${starClass} fill-amber-400 text-amber-400`} />
                        </div>
                    </div>
                )}

                {/* Empty Stars */}
                {Array.from({ length: emptyStars }).map((_, i) => (
                    <Star
                        key={`empty-${i}`}
                        className={`${starClass} text-neutral-600`}
                    />
                ))}
            </div>

            {/* Rating Value */}
            {showValue && (
                <span className="text-neutral-300 text-sm font-medium ml-1">
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    );
}
