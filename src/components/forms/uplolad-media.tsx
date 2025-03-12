"use client"

import React from 'react'
import { z } from 'zod'
import { useToast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { createMedia } from '@/lib/actions/media/create-media.action'
import { saveActivityLogsNotification } from '@/lib/actions/notification/save-activity-logs-notification.actions'
import { Input } from '../ui/input'
import FileUpload from '../global/file-upload'
import { Button } from '../ui/button'
import { useModal } from '@/providers/modal-provider'

type Props = {
    subaccountId: string
}

const formSchema = z.object({
  link: z.string().min(1, { message: "Media File is required" }),
  name: z.string().min(1, { message: "Name is required" }),

})
const UploadMediaForm = ({ subaccountId }: Props) => {
  const { toast } = useToast()
  const { setClose } = useModal()
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      link: "",
      name: "",
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await createMedia(subaccountId, values)
      await saveActivityLogsNotification({
              agencyId: undefined,
              description: `Uploaded a media file | ${response?.name}`,
              subAccountId: subaccountId,
            });
            toast({
              title: "Success",
              description: `Uploaded media ${response?.name} successfully.`,
            });
            setClose()
            router.refresh()

          } catch (error) {
            console.log("Error uploading media: ", error);
            toast({
              variant: "destructive",
              title: "Error",
              description: "Error uploading media.",
            });
            
          }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Media Information</CardTitle>
        <CardDescription>
          Please enter the details for your file
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField 
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>File Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your File name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField 
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormLabel>Media File</FormLabel>
                  <FormControl>
                    <FileUpload 
                      apiEndpoint="subaccountLogo"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="mt-4"
            >
              Upload Media
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default UploadMediaForm