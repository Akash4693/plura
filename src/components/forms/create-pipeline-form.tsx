"use client";

import { useToast } from "@/hooks/use-toast";
import { saveActivityLogsNotification } from "@/lib/actions/notification/save-activity-logs-notification.actions";
import { upsertPipeline } from "@/lib/actions/pipeline/upsert-pipeline-action";
import { Pipeline } from "@/lib/types/pipeline.types";
import { useModal } from "@/providers/modal-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Loading from "../global/loading";

interface CreatePipelineFormProps {
  defaultData?: Pipeline;
  subAccountId: string;
}

const CreatePipelineFormSchema = z.object({
  name: z.string().min(1),
});

const CreatePipelineForm: React.FC<CreatePipelineFormProps> = ({
  defaultData,
  subAccountId,
}) => {

  console.log("default data", defaultData)
  const { toast } = useToast();
  const { data, isOpen, setOpen, setClose } = useModal();
  const router = useRouter();
  const form = useForm<z.infer<typeof CreatePipelineFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(CreatePipelineFormSchema),
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

  const onSubmit = async (values: z.infer<typeof CreatePipelineFormSchema>) => {
    if (!subAccountId) return null;

    console.log("formValues", values);

    console.log("Payload being sent to server:", {
      ...values,
      ...(defaultData?._id && { _id: defaultData._id }),
      subAccountId,  
    });

    try {
      
      const response = await fetch("/api/pipeline/upsert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          ...(defaultData?._id && { _id: defaultData._id }),
          subAccountId,
        }),
      });
      if (!response.ok) throw new Error("Pipeline creation failed");

      const data = await response.json();

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Created a new pipeline | ${data?.name}`,
        subAccountId: subAccountId,
      });

      toast({
        title: "Success",
        description: `Pipeline ${values.name} created successfully.`,
      });
      router.refresh();
    } catch (error) {
      console.log("Pipeline Creation failed: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error creating pipeline.",
      });
    }

    setClose();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Pipeline Details</CardTitle>
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
                  <FormLabel>Pipeline Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="w-20 mt-4"
              disabled={isLoading}
              type="submit"
            >
              {form.formState.isSubmitting ? <Loading /> : "Save"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreatePipelineForm;
