"use client";

import { MessageSquare, Star } from "lucide-react";
import type { Review } from "@/lib/data/courses";

interface ReviewSectionProps {
  reviews: Review[];
}

export function ReviewSection({ reviews }: ReviewSectionProps) {
  if (reviews.length === 0) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6">
          Student Reviews
        </h2>
        <div className="flex flex-col items-center justify-center p-8 bg-muted/20 border border-dashed rounded-xl text-center">
          <MessageSquare className="w-10 h-10 text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground font-medium">No reviews yet.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Be the first to leave a review after completing this course!
          </p>
        </div>
      </div>
    );
  }

  const averageRating = (
    reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length
  ).toFixed(1);

  return (
    <div className="mt-12">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Student Reviews</h2>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full font-semibold">
          <Star className="w-4 h-4 fill-current" />
          {averageRating}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="p-5 border border-border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                  {review.userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{review.userName}</h4>
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${star <= review.rating ? "text-yellow-400 fill-current" : "text-muted-foreground/30"}`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              &quot;{review.comment}&quot;
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
