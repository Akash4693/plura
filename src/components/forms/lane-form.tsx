"use client";

import { useToast } from "@/hooks/use-toast";
import { saveActivityLogsNotification } from "@/lib/actions/notification/save-activity-logs-notification.actions";
import { getPipelineDetails } from "@/lib/actions/pipeline/get-pipeline-details.action";
import { Lane } from "@/lib/types/lane.types";
import { useModal } from "@/providers/modal-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { upsertLane } from "@/lib/actions/lane/upsert-lane-action";
import { Button } from "../ui/button";
import Loading from "../global/loading";

interface CreateLaneFormProps {
  defaultData?: Partial<Lane>;
  pipelineId: string;
}

const LaneForm: React.FC<CreateLaneFormProps> = ({
  defaultData,
  pipelineId,
}) => {
  const { setClose } = useModal();
  const { toast } = useToast();
  const router = useRouter();

  const LaneFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
  });

  const form = useForm<z.infer<typeof LaneFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(LaneFormSchema),
    defaultValues: {
      name: defaultData?.name || "",
    },
  });

  useEffect(() => {
    if (defaultData) {
      form.reset({
        name: defaultData.name || "",
      });
    }
  }, [defaultData, form]);

  const isLoading = form.formState.isLoading;

  const onSubmit = async (values: z.infer<typeof LaneFormSchema>) => {
    if (!pipelineId) return;
    try {
      const response = await fetch("/api/lane/upsert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          _id: defaultData?._id,
          pipelineId,
          order: defaultData?.order,
        }),
      });

      if (!response.ok) throw new Error("Lane creation failed");

      const data = await response.json();

      const pipelineDetails = await getPipelineDetails(pipelineId);
      if (!pipelineDetails) return;

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Updated ${data?.name} lane`,
        subAccountId: pipelineDetails?.subAccountId.toString(),
      });

      toast({
        title: `Lane ${defaultData ? "Updated" : "Created"} Successfully`,
        description: `The lane "${data?.name}" has been ${
          defaultData ? "updated" : "created"
        } successfully.`,
      });

      router.refresh();
    } catch (error) {
      console.error("Error creating/updating lane", error);
      toast({
        variant: "destructive",
        title: "Error creating/updating lane",
        description: "Failed to Save Lane details.",
      });
    }

    setClose();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Lane Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              disabled={isLoading}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lane name</FormLabel>
                  <FormControl>
                    <Input placeholder="Lane name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-28 mt-4" disabled={isLoading} type="submit">
              {form.formState.isSubmitting ? <Loading /> : "Save"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LaneForm;
