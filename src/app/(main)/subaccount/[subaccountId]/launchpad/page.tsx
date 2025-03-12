import BlurPage from "@/components/global/blur-page";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SubAccount from "@/models/sub-account.model";
import { CheckCircleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  searchParams: {
    state: string;
    code: string;
  };
  params: { subaccountId: string };
};

const LaunchPad = async ({ params, searchParams }: Props) => {
    const subaccountDetails = await SubAccount.findById(params.subaccountId).lean();
  if (!subaccountDetails) {
    return null;
  }
  const allDetailsExist =
    subaccountDetails.name &&
    subaccountDetails.address &&
    subaccountDetails.subAccountLogo &&
    subaccountDetails.city &&
    subaccountDetails.companyEmail &&
    subaccountDetails.companyPhone &&
    subaccountDetails.country &&
    subaccountDetails.state &&
    subaccountDetails.zipCode;
  //WIP: Wire up stripe
  //WIP: 6:28:08
  return (
    <BlurPage>
      <div className="flex flex-col items-center justify-center">
        <div className="w-full h-full max-w-[800px]">
          <Card className="border-none">
            <CardHeader>
              <CardTitle>Get started!</CardTitle>
              <CardDescription>
                Follow the steps to setup account correctly.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex justify-between items-center w-full h-20 border p-4 rounded-lg">
                <div className="flex items-center gap-4">
                  <Image
                    src={"/appstore.png"}
                    alt="App logo"
                    height={80}
                    width={80}
                    className="rounded-md object-contain"
                  />
                  <p>Save website as a shortcut on your phone</p>
                </div>
                <Button>Start</Button>
              </div>
              <div className="flex justify-between items-center w-full h-20 border p-4 rounded-lg">
                <div className="flex items-center gap-4">
                  <Image
                    src={"/stripelogo.png"}
                    alt="App logo"
                    height={80}
                    width={80}
                    className="rounded-md object-contain"
                  />
                  <p>Connect your Stripe account to accept payments</p>
                </div>
              </div>
              <div className="flex justify-between items-center w-full h-20 border p-4 rounded-lg">
                <div className="flex items-center gap-4">
                    <Image 
                        src={subaccountDetails.subAccountLogo as string}
                        alt="App logo"
                        height={80}
                        width={80}
                        className="rounded-md object-contain"
                    />
                    <p>Fill all your Business details</p>
                </div>
                {allDetailsExist ? (
                    <CheckCircleIcon 
                        size={50}
                        className="text-primary p-2 flex-shrink-0"
                    />
                ) : (
                    <Link
                        className="bg-primary py-2 px-4 rounded-md text-white"
                        href={`/subaccount/${subaccountDetails._id}/settings`}
                    >
                        Start
                    </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </BlurPage>
  );
};

export default LaunchPad;
