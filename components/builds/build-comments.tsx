"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { Heart, Loader2, MessageCircle, Reply, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  createBuildComment,
  deleteBuildComment,
  toggleBuildCommentLike,
  type BuildCommentThreadItem,
} from "@/app/builds/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { USER_STATUSES } from "@/lib/constants/user";

type CurrentUserSummary = {
  id: string;
  role: string;
  status: string;
} | null;

type BuildCommentsProps = {
  buildId: string;
  comments: BuildCommentThreadItem[];
  totalCount: number;
  currentUser: CurrentUserSummary;
};

function getAuthorName(author: BuildCommentThreadItem["author"]) {
  const fullName = [author.firstName, author.lastName].filter(Boolean).join(" ");

  return author.codename || author.nickname || fullName || "Boys of ADV Rider";
}

function getInitials(author: BuildCommentThreadItem["author"]) {
  const name = getAuthorName(author);

  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatCommentDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

export function BuildComments({
  buildId,
  comments,
  totalCount,
  currentUser,
}: BuildCommentsProps) {
  const canInteract = currentUser?.status === USER_STATUSES.APPROVED;

  return (
    <section id="comments" className="mt-12 scroll-mt-24">
      <div className="mb-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-red-600/40" />
        <div className="flex items-center gap-2 text-red-500">
          <MessageCircle className="size-4" />
          <p className="text-xs font-black uppercase tracking-[0.25em]">
            Rider Comments
          </p>
          <span className="rounded-full border border-red-600/40 bg-red-600/15 px-2 py-0.5 text-xs font-black text-white">
            {totalCount}
          </span>
        </div>
        <div className="h-px flex-1 bg-red-600/40" />
      </div>

      <div className="mx-auto max-w-3xl">
        {canInteract ? (
          <CommentComposer buildId={buildId} />
        ) : (
          <div className="rounded-lg border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-black uppercase tracking-widest text-white">
              Sign in as an approved member to join the discussion.
            </p>
            <p className="mt-2 text-sm leading-6 text-white/55">
              Guests can read comments and like counts only.
            </p>
          </div>
        )}

        <div className="mt-6 grid gap-4">
          {comments.length === 0 ? (
            <div className="rounded-lg border border-dashed border-white/15 bg-black/40 p-8 text-center">
              <MessageCircle className="mx-auto size-8 text-white/30" />
              <p className="mt-4 text-sm font-black uppercase tracking-widest text-white">
                No comments yet.
              </p>
              <p className="mt-2 text-sm text-white/50">
                Be the first rider to react to this build.
              </p>
            </div>
          ) : (
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                buildId={buildId}
                comment={comment}
                canInteract={canInteract}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function CommentComposer({
  buildId,
  parentId,
  onDone,
}: {
  buildId: string;
  parentId?: string;
  onDone?: () => void;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [body, setBody] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      const result = await createBuildComment({
        buildId,
        parentId,
        body,
      });

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      setBody("");
      formRef.current?.reset();
      onDone?.();
      toast.success(result.message);
      router.refresh();
    });
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="rounded-lg border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/20"
    >
      <Textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        disabled={isPending}
        maxLength={1000}
        placeholder={parentId ? "Write a reply..." : "React to this build..."}
        className="min-h-24 rounded-lg border-white/10 bg-black/70 px-4 py-3 text-sm text-white placeholder:text-white/35 focus-visible:border-red-600 focus-visible:ring-red-600/25"
      />

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/35">
          {body.length}/1000
        </p>

        <Button
          type="submit"
          disabled={isPending || body.trim().length === 0}
          className="h-11 rounded-full bg-red-600 px-5 text-xs font-black uppercase tracking-wider text-white hover:bg-red-700"
        >
          {isPending ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Send className="mr-2 size-4" />
          )}
          {parentId ? "Reply" : "Post Comment"}
        </Button>
      </div>
    </form>
  );
}

function CommentItem({
  buildId,
  comment,
  canInteract,
  isReply = false,
}: {
  buildId: string;
  comment: BuildCommentThreadItem;
  canInteract: boolean;
  isReply?: boolean;
}) {
  const router = useRouter();
  const [showReplyComposer, setShowReplyComposer] = useState(false);
  const [isLiked, setIsLiked] = useState(comment.isLikedByMe);
  const [likeCount, setLikeCount] = useState(comment.likeCount);
  const [pendingAction, startTransition] = useTransition();
  const authorName = getAuthorName(comment.author);
  const isDeleted = Boolean(comment.deletedAt);

  function handleLike() {
    if (!canInteract || !comment.canLike || isDeleted) return;

    startTransition(async () => {
      const previousLiked = isLiked;
      const previousCount = likeCount;

      setIsLiked(!previousLiked);
      setLikeCount((count) => count + (previousLiked ? -1 : 1));

      const result = await toggleBuildCommentLike(comment.id);

      if (!result.ok) {
        setIsLiked(previousLiked);
        setLikeCount(previousCount);
        toast.error(result.message);
        return;
      }

      setIsLiked(result.liked);
      setLikeCount(result.likeCount);
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteBuildComment(comment.id);

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.refresh();
    });
  }

  return (
    <article
      className={`rounded-lg border border-white/10 bg-black/70 p-4 ${
        isReply ? "ml-5 sm:ml-10" : ""
      }`}
    >
      <div className="flex gap-3">
        <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/10">
          {!isDeleted && comment.author.avatarUrl ? (
            <Image
              src={comment.author.avatarUrl}
              alt={authorName}
              fill
              sizes="40px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs font-black text-white/60">
              {isDeleted ? "BOA" : getInitials(comment.author)}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="break-words text-sm font-black uppercase text-white">
              {isDeleted ? "Deleted comment" : authorName}
            </p>
            <span className="text-xs font-semibold uppercase tracking-widest text-white/35">
              {formatCommentDate(comment.createdAt)}
            </span>
          </div>

          {isDeleted ? (
            <p className="mt-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm italic text-white/45">
              This comment was deleted.
            </p>
          ) : (
            <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-white/70">
              {comment.body}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={!canInteract || !comment.canLike || pendingAction}
              aria-label={isLiked ? "Unlike comment" : "Like comment"}
              className={`h-9 rounded-full px-3 text-xs font-black uppercase tracking-wider ${
                isLiked
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Heart className={`mr-1.5 size-4 ${isLiked ? "fill-current" : ""}`} />
              {likeCount}
            </Button>

            {!isReply && canInteract && comment.canReply ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={pendingAction}
                onClick={() => setShowReplyComposer((value) => !value)}
                className="h-9 rounded-full px-3 text-xs font-black uppercase tracking-wider text-white/60 hover:bg-white/10 hover:text-white"
              >
                <Reply className="mr-1.5 size-4" />
                Reply
              </Button>
            ) : null}

            {comment.canDelete ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={pendingAction}
                    className="h-9 rounded-full px-3 text-xs font-black uppercase tracking-wider text-white/45 hover:bg-red-600/15 hover:text-red-400"
                  >
                    <Trash2 className="mr-1.5 size-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="border border-white/10 bg-neutral-950 text-white">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete comment?</AlertDialogTitle>
                    <AlertDialogDescription className="text-white/55">
                      This hides the comment from the discussion. Replies on a
                      deleted top-level comment remain visible.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="border-white/10 bg-black/50">
                    <AlertDialogCancel className="border-white/10 bg-black text-white hover:bg-white/10">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : null}
          </div>

          {showReplyComposer ? (
            <div className="mt-4">
              <CommentComposer
                buildId={buildId}
                parentId={comment.id}
                onDone={() => setShowReplyComposer(false)}
              />
            </div>
          ) : null}
        </div>
      </div>

      {comment.replies.length > 0 ? (
        <div className="mt-4 grid gap-3 border-l border-white/10 pl-3 sm:pl-5">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              buildId={buildId}
              comment={reply}
              canInteract={canInteract}
              isReply
            />
          ))}
        </div>
      ) : null}
    </article>
  );
}
