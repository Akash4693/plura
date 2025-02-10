"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { NumberInput } from "@tremor/react";
import { zodResolver } from "@hookform/resolvers/zod";
import Agency from "@/models/agency.model";
import {Agency as AgencyType} from "@/lib/types/agency.types";
import { deleteAgency } from "@/lib/actions/agency/delete-agency.actions";
import { updateAgencyDetails } from "@/lib/actions/agency/update-agency-details.actions";
import { Role } from "@/constants/enums/role.enum";
import { initUser } from "@/lib/actions/user/init-user.actions";
import { upsertAgency } from "@/lib/actions/agency/upsert-agency.actions";

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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import FileUpload from "@/components/global/file-upload";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { saveActivityLogsNotification } from "@/lib/actions/notification/save-activity-logs-notification.actions";
import { Button } from "@/components/ui/button";
import Loading from "@/components/global/loading";



type Props = {
  data?: Partial<Agency>;
};

const FormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Agency name must be at least 2 characters." }),
  companyEmail: z
    .string()
    .email({ message: "Invalid email address." })
    .min(5, { message: "Company email must be at least 5 characters." }),
  companyPhone: z.string().min(1, { message: "Company phone is required." }),
  whiteLabel: z.boolean(),
  address: z.string().min(1, { message: "Address is required." }),
  city: z.string().min(1, { message: "City is required." }),
  zipCode: z.string().min(1, { message: "Zip code is required." }),
  country: z.string().min(1, { message: "Country is required." }),
  state: z.string().min(1, { message: "State is required." }),
  agencyLogo: z.string().min(1, { message: "Agency logo is required." }),
});

const AgencyDetails = ({ data }: Props) => {
  const { toast } = useToast();
  const router = useRouter();
  const [deletingAgency, setDeletingAgency] = useState(false);
  const prevDataRef = useRef(data);

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: data?.name || "",
      companyEmail: data?.companyEmail || "",
      companyPhone: data?.companyPhone || "",
      whiteLabel: data?.whiteLabel || false,
      address: data?.address || "",
      city: data?.city || "",
      zipCode: data?.zipCode || "",
      state: data?.state || "",
      country: data?.country || "",
      agencyLogo: data?.agencyLogo || "",
    },
  });
  // const formRef = useRef(form);
  // const formRef = useRef(form);


  useEffect(() => {
    if (data && JSON.stringify(data) !== JSON.stringify(prevDataRef.current)) {
      form.reset(data);
       
      prevDataRef.current = data; 
    }
  }, [data, form]); /// Make sure to watch `data` and `form`

 
  
  const isLoading = form.formState.isSubmitting;
 // 

  /*  useEffect(() => {
    formRef.current = form; // Always keep ref updated with the latest `form`
  }, [form]);

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data, form]); */

  /* const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      let newUserData;
      let stripeCustomerId;

      if (!data?.id) {
        const stripeCustomerData = {
          email: values.companyEmail,
          name: values.name,
          shipping: {
            address: {
              city: values.city,
              country: values.country,
              state: values.state,
              postal_code: values.zipCode,
              line1: values.address,
            },
            name: values.name,
          },
          address: {
            city: values.city,
            country: values.country,
            state: values.state,
            postal_code: values.zipCode,
            line1: values.address,
          },
        };

         const stripeResponse = await fetch("/api/stripe/create-customer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(stripeCustomerData),
        }); 

        const stripeData: { customerId: string } = await stripeResponse.json();
        stripeCustomerId = stripeData.customerId;  
      }

      newUserData = await initUser({ role: Role.AGENCY_OWNER });
      
      if (!data?.customerId) return;
      
      const agencyResponse = await upsertAgency({
        id: data?.id ? data.id : stripeCustomerId,
        customerId: data?.customerId || stripeCustomerId || "" || undefined,
        address: values.address,
        agencyLogo: values.agencyLogo,
        city: values.city,
        companyPhone: values.companyPhone,
        country: values.country,
        name: values.name,
        state: values.state,
        whiteLabel: values.whiteLabel,
        zipCode: values.zipCode,
        companyEmail: values.companyEmail,
        connectAccountId: "",
        goal: 5,
      });
      
      toast({
        variant: "success",
        title: "Agency created successfully",
      });

      if (data?.id) return router.refresh();
      if (agencyResponse) {
        return router.refresh();
      }
    } catch (error) {
      
      toast({
        variant: "destructive",
        title: "Agency creation failed",
        description: "Unable to create agency.",
      });
    }
  }; */

//Todo
 /*  const handleSubmit = async (values: z.infer<typeof FormSchema>) => { 
    try {
      
      let custId: string | undefined;
  
      // Check if a customer ID is needed
      if (!data?.id) {
        
        const bodyData = {
          email: values.companyEmail,
          name: values.name,
          shipping: {
            address: {
              city: values.city,
              country: values.country,
              line1: values.address,
              postal_code: values.zipCode,
              state: values.zipCode,
            },
            name: values.name,
          },
          address: {
            city: values.city,
            country: values.country,
            line1: values.address,
            postal_code: values.zipCode,
            state: values.zipCode,
          },
        };
  
        // Create Stripe customer (if necessary)
        /* const customerResponse = await fetch('/api/stripe/create-customer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bodyData),
        });
        const customerData: { customerId: string } = await customerResponse.json();
        custId = customerData.customerId; 
      } 
      
      // Prepare the agency data
      const agencyData = {
        customerId: data?.customerId || custId || '',
        address: values.address,
        agencyLogo: values.agencyLogo,
        city: values.city,
        companyPhone: values.companyPhone,
        country: values.country,
        name: values.name,
        state: values.state,
        whiteLabel: values.whiteLabel,
        zipCode: values.zipCode,
        companyEmail: values.companyEmail,
        connectAccountId: '', // Placeholder, adjust based on your needs
        goal: 5,
      };
  
      
  
      // Make API request to create/update the agency
      const response = await fetch('/api/create-agency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...agencyData, companyEmail: values.companyEmail }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || 'Failed to create or update the agency');
      }
  
      
  
      toast({
        title: 'Created Agency',
      });
  
     return router.refresh(); // Refresh the page after agency is created/updated
  
    } catch (error) {
      
      toast({
        variant: 'destructive',
        title: 'Oops!',
        description: 'Could not create your agency',
      });
    }
  };
  
 */

  /* Todo:Code of handleSubmit below try {
          // Send request to your backend to create a Stripe customer
          const customerResponse = await fetch('/api/stripe/create-customer', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyData),
          });
  
          if (!customerResponse.ok) {
            throw new Error('Failed to create Stripe customer');
          }
  
          const customerData: { customerId: string } = await customerResponse.json();
          custId = customerData.customerId;
  
        } catch (stripeError) {
          
          toast({
            variant: 'destructive',
            title: 'Stripe Error',
            description: 'Unable to create a Stripe customer. Please try again later.',
          });
          return;
        }*/

  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
   
    try {
      let newUserData;
      let custId;

      console.log("Payload before sending: ", {
        address: values.address,
        agencyLogo: values.agencyLogo,
        city: values.city,
        companyEmail: values.companyEmail,
        companyPhone: values.companyPhone,
        connectAccountId: "", // Or use a dynamic value if available
        country: values.country,
        goal: 5, // or use values.goal if dynamic
        name: values.name,
        state: values.state,
        whiteLabel: values.whiteLabel,
        zipCode: values.zipCode
      });
  
      // If no existing customer data, create a Stripe customer
      if (!data?.id) {
        const bodyData = {
          email: values.companyEmail,
          name: values.name,
          shipping: {
            address: {
              city: values.city,
              country: values.country,
              line1: values.address,
              postal_code: values.zipCode,
              state: values.state,
            },
            name: values.name,
          },
          address: {
            city: values.city,
            country: values.country,
            line1: values.address,
            postal_code: values.zipCode,
            state: values.state,
          },
        };
  
        
      } 
  
      // Initialize user if necessary
      try {
        newUserData = await initUser({ role: 'AGENCY_OWNER' });
        
      } catch (initError) {
        
        toast({
          variant: 'destructive',
          title: 'Initialization Error',
          description: 'Could not initialize the user. Please try again.',
        });
        return;
      }
  
      
      // Ensure customer ID is available
    // WIP if (!data?.customerId && !custId) 
      if (!data && !custId) {
        
        toast({
          variant: 'destructive',
          title: 'Missing Data',
          description: 'Customer ID is required to proceed.',
        });
        return;
      }  
  
      // Upsert agency data into MongoDB
      try {
        
        const response = await fetch('/api/agency', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: data?.id,
            address: values.address,
            agencyLogo: values.agencyLogo,
            city: values.city,
            companyPhone: values.companyPhone,
            country: values.country,
            name: values.name,
            state: values.state,
            whiteLabel: values.whiteLabel,
            zipCode: values.zipCode,
            companyEmail: values.companyEmail,
            connectAccountId: '',
            goal: 5,
          }),
        });
  
        const result = await response.json();

        console.log(`[API] POST /api/agency - Status: ${response.status}, Response:`, result);

        console.groupCollapsed(
          `%c[API Response] %cPOST /api/agency %c(Status: ${response.status} ${response.ok ? '✅' : '❌'})`,
          "color: #0d6efd; font-weight: bold;",
          "color: #6c757d;",
          `color: ${response.ok ? '#22c55e' : '#dc3545'}; font-weight: bold;`
        );
        
        console.log(`%cRequest Payload:`, "color: #0dcaf0; font-weight: bold;", {
          id: data?.id,
          address: values.address,
          agencyLogo: values.agencyLogo,
          city: values.city,
          companyPhone: values.companyPhone,
          country: values.country,
          name: values.name,
          state: values.state,
          whiteLabel: values.whiteLabel,
          zipCode: values.zipCode,
          companyEmail: values.companyEmail,
          connectAccountId: '',
          goal: 5,
        });
        
        console.log(`%cResponse Data:`, "color: #20c997; font-weight: bold;", result);
        
        console.groupEnd();
        
  
        if (response.ok) {
          
          toast({
            title: 'Created Agency',
          });
            console.log("Result id", result._id);
            console.log("Result agency", result.agencyId);
            if (result?.agencyId) {
              
              return router.refresh();
              
            }
  
        } else {
          
          toast({
            variant: 'destructive',
            title: 'Database Error',
            description: 'Could not save the agency details. Please try again.',
          });

        // router.refresh();
        
      }
      } catch (dbError) {
        
        toast({
          variant: 'destructive',
          title: 'Database Error',
          description: 'Could not save the agency data. Please try again.',
        });
        return;
      }
    } catch (error) {
      
      toast({
        variant: 'destructive',
        title: 'Oops!',
        description: 'An unexpected error occurred. Please try again.',
      });
    }
  };
  
  

  const handleDeleteAgency = async () => {
    if (!data?.id) return;
    setDeletingAgency(true);
    //Todo: discontinue the subscription
    try {
      const response = await deleteAgency(data.id);
      if (response) {
         // Log the deleted agency details
      } else {
        
      }
      toast({
        title: "Deleted Agency",
        description: "Deleted your agency and all sub accounts",
      });
      router.refresh();
    } catch (error) {
      
      toast({
        variant: "destructive",
        title: "Oops!",
        description:
          "We encountered an issue and could not delete your agency. Please try again later.",
      });
    }
    setDeletingAgency(false);
  };

  return (
    <AlertDialog>
      <Card>
        <CardHeader>
          <CardTitle>Launch Your Agency, Lead the Market.</CardTitle>
          <CardDescription>
            Effortlessly set up and manage every detail in Settings —built for
            growth, optimized for impact.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                disabled={isLoading}
                control={form.control}
                name="agencyLogo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agency Logo</FormLabel>
                    <FormControl>
                      <FileUpload
                        apiEndpoint="agencyLogo"
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex md:flex-row gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Agency Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your Agency Name"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="companyEmail"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Agency Email</FormLabel>
                      <FormControl>
                        <Input readOnly placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex md:flex-row gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="companyPhone"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Agency Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                disabled={isLoading}
                control={form.control}
                name="whiteLabel"
                render={({ field }) => {
                  return (
                    <FormItem className="flex-1">
                      <div>
                        <FormLabel>WhiteLabel Agency</FormLabel>
                        <FormDescription>
                          Turning on Whitelabel mode will show your agency logo
                          to all sub accounts by default. You can overwrite this
                          functionality through sub account settings.
                        </FormDescription>
                      </div>

                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 st..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex md:flex-row gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>ZipCode</FormLabel>
                      <FormControl>
                        <Input placeholder="ZipCode" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                disabled={isLoading}
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {data?.id && (
                <div className="flex flex-col gap-2">
                  <FormLabel>Create a Goal</FormLabel>
                  <FormDescription>
                    ✨ Set Your Agency’s Vision. In the fast-paced digital
                    world, your goals drive growth —set ambitious targets and
                    scale with purpose.
                  </FormDescription>
                  <NumberInput
                    defaultValue={data?.goal}
                    min={1}
                    className="bg-background !border !border-input"
                    placeholder="Sub Account Goal"
                  />
                  {/*  <NumberInput
                    defaultValue={data?.goal}
                    onValueChange={async (value) => {
                      if (!data?.id) return;
                      await updateAgencyDetails(data.id, { goal: value });
                      await saveActivityLogsNotification({
                        agencyId: data.id,
                        description: `Updated the agency goal to | ${value} Sub Account`,
                        subAccountId: undefined,
                      });
                      router.refresh();
                    }}
                    min={1}
                    className="bg-background !border !border-input"
                    placeholder="Sub Account Goal"
                  /> */}
                </div>
              )}
              <Button type="submit" disabled={isLoading} >
                {isLoading ? <Loading /> : "Save Agency information"}
              </Button>
            </form>
          </Form>

          {data?.id && (
            <div className="flex flex-row  justify-between items-center rounded-lg border border-destructive gap-4 mt-4">
              <div>
                <div>Danger Zone</div>
              </div>
              <div className="text-muted-foreground">
                Deleting your agency is a permanent action. This will remove all
                sub-accounts and their associated data, including access to
                funnels, contacts, and other resources. Proceed with caution.
              </div>
              <AlertDialogTrigger
                disabled={isLoading || deletingAgency}
                className="text-red-600 p-2 text-center mt-2 rounded-md hover:bg-red-600 hover:text-white whitespace-nowrap"
              >
                {deletingAgency ? "Deleting Agency" : "Delete Agency"}
              </AlertDialogTrigger>
            </div>
          )}
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-left">
                Are you sure
              </AlertDialogTitle>
              <AlertDialogDescription>
              This Agency and all data related to the sub
              account will be deleted permanently.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex items-center">
              <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={deletingAgency}
                className="bg-destructive hover:bg-destructive"
                onClick={handleDeleteAgency}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default AgencyDetails;
