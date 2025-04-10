/*  "use server";

import { SubscriptionPlan } from "@/constants/enums/subscription-plan.enum";
import { Agency as AgencyType } from "@/lib/types/agency.types";
import Agency from "@/models/agency.model";
import { getDefaultSidebarOptions } from '@/lib/utils/sidebar-options';
import { connectDB } from "@/lib/db";

export const upsertAgency = async (
  agency: Partial<AgencyType>,
  price?: SubscriptionPlan
) => {

  await connectDB();  
  if (!agency.companyEmail) return null;

  const sidebarOptions = getDefaultSidebarOptions(agency.id || "")

  try {
    const agencyDetails = await Agency.findByIdAndUpdate(
      agency.id,
      {
        $set: {
          ...agency,
          connectAccountId: agency.connectAccountId || "",
          goal: agency.goal || 5,
        },
        $setOnInsert: {
          users: [{ email: agency.companyEmail }], // Ensures users field on insert
          sidebarOption: sidebarOptions, // Ensure correct field name
        },
      },
      {
        new: true, // Return updated document
        upsert: true, // Create if not exists
        runValidators: true, // Apply schema validation
      }
    );

    return agencyDetails;
  } catch (error) {
    console.log("Error upserting agency:", error);
    throw new Error("Failed to upsert agency"); 
  }
};
 
 */

/* "use server";

import { connectDB } from '@/lib/db'; // Your DB connection logic
import Agency from '@/models/agency.model'; // Your agency model
import User from '@/models/user.model'; // Import user model for email-to-ID resolution
import { Agency as AgencyType } from '@/lib/types/agency.types'; // Your agency type definition
import { SubscriptionPlan } from '@/constants/enums/subscription-plan.enum'; // Your Plan enum, if necessary

export const upsertAgency = async (agency: Partial<AgencyType>, price?: SubscriptionPlan) => {
  if (!agency.companyEmail) return null;

  try {
    await connectDB(); // Ensure database connection

    // Resolve email to ObjectId for the users array
    const user = await User.findOne({ email: agency.companyEmail }).exec();
    if (!user) {
      throw new Error(`User with email ${agency.companyEmail} not found`);
    }

    // Construct Sidebar options
    const sidebarOptions = [
      { name: 'Dashboard', icon: 'category', link: `/agency/${agency._id}` },
      { name: 'Launchpad', icon: 'clipboardIcon', link: `/agency/${agency._id}/launchpad` },
      { name: 'Billing', icon: 'payment', link: `/agency/${agency._id}/billing` },
      { name: 'Settings', icon: 'settings', link: `/agency/${agency._id}/settings` },
      { name: 'Sub Accounts', icon: 'person', link: `/agency/${agency._id}/all-subaccounts` },
      { name: 'Team', icon: 'shield', link: `/agency/${agency._id}/team` },
    ];

    // Upsert agency logic
    const agencyDetails = await Agency.findOneAndUpdate(
      { _id: agency._id }, // Find by agency ID
      {
        $set: {
          ...agency,
          companyEmail: agency.companyEmail,
          name: agency.name,
        
          users: [user._id], // Use ObjectId for the user
          SidebarOption: sidebarOptions,
          // Add other fields to update here
        },
      },
      {
        upsert: true, // Create if not exists, otherwise update
        new: true, // Return the updated document
      }
    ).lean()
    .exec();
    console.log("agencyDetails:", agencyDetails)
    return agencyDetails;
  } catch (error) {
    console.error('Error during upsertAgency:', error);
    throw new Error('Unable to upsert agency.'); // Throw custom error for clarity
  }
};
 */


"use server";

import { connectDB } from '@/lib/db'; // Database connection logic
import Agency from '@/models/agency.model'; // Agency model
import User from '@/models/user.model'; // User model for resolving emails to ObjectId
import { Agency as AgencyType } from '@/lib/types/agency.types'; // Agency type definition
import { SubscriptionPlan } from '@/constants/enums/subscription-plan.enum'; // Plan enum
import mongoose from 'mongoose';
import { getDefaultAgencySidebarOptions } from '@/lib/utils/sidebar-options';
import AgencySidebarOption from '@/models/agency-sidebar-option.model';

export const upsertAgency = async (agency: Partial<AgencyType>, price?: SubscriptionPlan) => {
  if (!agency.companyEmail) return null;

  try {
    await connectDB(); // Ensure database connection

    // Resolve email to ObjectId for the users array
    const user = await User.findOne({ email: agency.companyEmail }).exec();
    if (!user) {
      throw new Error(`User with email ${agency.companyEmail} not found`);
    }

    
    const agencyId = agency._id || new mongoose.Types.ObjectId();

    
    const sidebarOptions = getDefaultAgencySidebarOptions(agencyId.toString()).map(option => ({
          ...option,
          agencyId, // Ensure agencyId is added here
        }));

    console.log("Agency sidebarOptions:", sidebarOptions);

    const sidebarOptionIds = await AgencySidebarOption.insertMany(sidebarOptions)
    .then(options => options.map(option => option._id)); 

    console.log("Agency sidebar Option IDs:", sidebarOptionIds);

    // Upsert agency logic
    const agencyDetails = await Agency.findOneAndUpdate(
      { _id: agencyId }, // Use existing ID or new one
      {
        $set: {
          ...agency,
          _id: agencyId, // Ensure `_id` is always set
          companyEmail: agency.companyEmail,
          name: agency.name,
          users: [user._id], // Use ObjectId for the user
          sidebarOption: sidebarOptionIds,
          // Add other fields to update here
        },
      },
      {
        upsert: true, // Create if not exists, otherwise update
        new: true, // Return the updated document
      }
    )
      .lean()
      .exec();

      if (agencyDetails) {
        await User.findOneAndUpdate(
          { email: agency.companyEmail },
          { $set: { agencyId: agencyDetails._id } },
          { new: true }
        ).lean().exec();
        console.log(`User ${user.email} updated with agencyId ${agencyDetails._id}`);
      }

    console.log('Agency details:', agencyDetails);
    return  { ...agencyDetails, agencyId: agencyDetails._id.toString() };
  } catch (error) {
    console.error('Error during upsertAgency:', error);
    throw new Error('Unable to upsert agency.'); // Throw custom error for clarity
  }
};


