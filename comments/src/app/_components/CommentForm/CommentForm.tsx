import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { type z } from "zod";
import { LOCAL_STORAGE_ALL_COMMENTS_KEY } from "~/app/app.constants";
import { Button } from "~/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import addNewComment from "../Comment/Comment.helpers";
import { CommentFormSchema } from "../Comment/Comment.types";
import { type CommentFormProps } from "./CommentForm.types";

export default function CommentForm({
  onCancelFunction,
}: CommentFormProps): JSX.Element {
  const queryClient = useQueryClient();

  const updateAllCommentsData = useMutation({
    mutationFn: async (data: z.infer<typeof CommentFormSchema>) => {
      await addNewComment(data, queryClient);
      await queryClient.invalidateQueries({
        queryKey: [LOCAL_STORAGE_ALL_COMMENTS_KEY],
      });
    },
  });

  const form = useForm<z.infer<typeof CommentFormSchema>>({
    resolver: zodResolver(CommentFormSchema),
    defaultValues: {
      author: "",
      commentText: "",
    },
  });

  const onSubmit = (data: z.infer<typeof CommentFormSchema>) => {
    updateAllCommentsData.mutate(data, {
      onSuccess: () => {
        form.reset();
      },
      onError: (error) => {
        console.error("Error updating comments:", error);
      },
    });
  };

  const onCancel = () => {
    onCancelFunction?.();
    form.reset();
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="min-w-full">
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Write your name here"
                  className="mb-2 min-w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="commentText"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Write your comment here"
                  className="min-w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mb-2 mt-2 flex w-full justify-end gap-2">
          <Button
            className="max-w-min"
            type="button"
            variant="outline"
            onClick={() => onCancel()}
          >
            Cancel
          </Button>
          <Button type="submit" className="max-w-min">
            Submit
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}