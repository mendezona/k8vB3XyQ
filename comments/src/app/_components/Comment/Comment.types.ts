import { z } from "zod";

export interface CommentObjectInterface {
  commentId: string;
  author: string;
  commentText: string;
  createdAt: string;
  nestedComments?: CommentObject[];
  nestedComment?: boolean;
}

export const CommentObjectSchema: z.ZodType<CommentObjectInterface> = z.lazy(
  () =>
    z.object({
      commentId: z.string(),
      author: z.string(),
      commentText: z.string(),
      createdAt: z.string(),
      nestedComments: z.array(CommentObjectSchema).optional(),
      nestedComment: z.boolean().optional(),
    }),
);

export type CommentObject = z.infer<typeof CommentObjectSchema>;
