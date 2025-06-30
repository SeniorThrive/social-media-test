import { useState } from "react";
import { Comment } from "./CommentSection";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Textarea } from "./ui/Textarea";
import { Typography } from "./ui/Typography";
import { ReportModal } from "./ReportModal";

interface Props {
  comment: Comment & {
    children?: Comment[];
  };
  postId: number;
}

const createReply = async (
  replyContent: string,
  postId: number,
  parentCommentId: number,
  userId?: string,
  author?: string
) => {
  if (!userId || !author) {
    throw new Error("You must be logged in to reply.");
  }

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    content: replyContent,
    parent_comment_id: parentCommentId,
    user_id: userId,
    author: author,
  });

  if (error) throw new Error(error.message);
};

export const CommentItem = ({ comment, postId }: Props) => {
  const [showReply, setShowReply] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (replyContent: string) =>
      createReply(
        replyContent,
        postId,
        comment.id,
        user?.id,
        user?.user_metadata?.user_name
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      setReplyText("");
      setShowReply(false);
    },
  });

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText) return;
    mutate(replyText);
  };

  return (
    <>
      <div className="pl-4 border-l border-gray-200">
        <Card className="mb-2 group">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Typography variant="caption" className="font-bold text-blue-600">
                {comment.author}
              </Typography>
              <Typography variant="caption" className="text-gray-500">
                {new Date(comment.created_at).toLocaleString()}
              </Typography>
            </div>
            
            {/* Report Button */}
            {user && (
              <button
                onClick={() => setShowReportModal(true)}
                className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                title="Report this comment"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </button>
            )}
          </div>
          
          <Typography variant="body" className="text-gray-900 mb-2">
            {comment.content}
          </Typography>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowReply((prev) => !prev)}
          >
            {showReply ? "Cancel" : "Reply"}
          </Button>
        </Card>

        {showReply && user && (
          <form onSubmit={handleReplySubmit} className="mb-2">
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              rows={2}
              className="mb-2"
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isPending}
            >
              {isPending ? "Posting..." : "Post Reply"}
            </Button>
            {isError && (
              <Typography variant="caption" className="text-red-600 mt-2">
                Error posting reply.
              </Typography>
            )}
          </form>
        )}

        {comment.children && comment.children.length > 0 && (
          <div>
            <button
              onClick={() => setIsCollapsed((prev) => !prev)}
              className="text-blue-600 hover:text-blue-800 mb-2 flex items-center space-x-1"
              title={isCollapsed ? "Hide Replies" : "Show Replies"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
              <Typography variant="caption">
                {comment.children.length} {comment.children.length === 1 ? 'reply' : 'replies'}
              </Typography>
            </button>

            {!isCollapsed && (
              <div className="space-y-2">
                {comment.children.map((child, key) => (
                  <CommentItem key={key} comment={child} postId={postId} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        itemId={comment.id}
        itemType="comment"
        itemTitle={comment.content.substring(0, 50) + (comment.content.length > 50 ? '...' : '')}
      />
    </>
  );
};