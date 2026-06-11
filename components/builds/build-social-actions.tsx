"use client";

import { useState, useTransition } from "react";
import { Heart, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toggleBuildLike } from "@/app/builds/actions";

type Props = {
  buildId: string;
  buildTitle: string;
  initialLiked: boolean;
  initialLikeCount: number;
};

export function BuildSocialActions({
  buildId,
  buildTitle,
  initialLiked,
  initialLikeCount,
}: Props) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isPending, startTransition] = useTransition();

  function handleLike() {
    startTransition(async () => {
      const previousLiked = liked;

      setLiked(!previousLiked);
      setLikeCount((count) => count + (previousLiked ? -1 : 1));

      const result = await toggleBuildLike(buildId);

      if (!result.ok) {
        setLiked(previousLiked);
        setLikeCount((count) => count + (previousLiked ? 1 : -1));
        return;
      }
    });
  }

  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      await navigator.share({
        title: buildTitle,
        text: `Check out this Boys of ADV build: ${buildTitle}`,
        url,
      });

      return;
    }

    await navigator.clipboard.writeText(url);
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
      <Button
        type="button"
        onClick={handleLike}
        disabled={isPending}
        className={`h-11 rounded-full px-5 text-xs font-black uppercase tracking-wider ${
          liked
            ? "bg-red-600 text-white hover:bg-red-700"
            : "border border-white/15 bg-black/50 text-white backdrop-blur hover:bg-white/10"
        }`}
      >
        <Heart className={`mr-2 size-4 ${liked ? "fill-current" : ""}`} />
        {likeCount}
      </Button>

      <Button
        type="button"
        onClick={handleShare}
        className="h-11 rounded-full border border-white/15 bg-black/50 px-5 text-xs font-black uppercase tracking-wider text-white backdrop-blur hover:bg-white/10"
      >
        <Share2 className="mr-2 size-4" />
        Share
      </Button>
    </div>
  );
}
