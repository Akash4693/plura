/* "use server";

import { connectDB } from '@/lib/db'; // Database connection logic
import SubAccount from '@/models/sub-account.model'; // SubAccount model
import User from '@/models/user.model'; // User model for resolving emails to ObjectId
import { SubAccount as SubAccountType } from '@/lib/types/sub-account.types'; // SubAccount type definition
import mongoose from 'mongoose';
import { getDefaultSubAccountSidebarOptions } from '@/lib/utils/sidebar-options'; // Utility function for sidebar options
import { Role } from '@/constants/enums/role.enum';
import Permission from '@/models/permission.model';

export const upsertSubAccount = async (subAccount: Partial<SubAccountType>) => {
  if (!subAccount.companyEmail) return null;

 

  try {
    await connectDB(); // Ensure database connection

    // Find the agency owner
    const agencyOwner = await User.findOne({
      agencyId: subAccount.agencyId,
      role: Role.AGENCY_OWNER,
    }).exec();

    if (!agencyOwner) {
      throw new Error(`🔴 Error: Could not find agency owner for subAccount with ID: ${subAccount._id}.`);
    }

    // Generate a new _id if not provided
    const subAccountId = subAccount._id || new mongoose.Types.ObjectId();
    const permissionId = new mongoose.Types.ObjectId();
    const sidebarOptions = getDefaultSubAccountSidebarOptions(subAccountId.toString());

    
    // Upsert SubAccount
    const response = await SubAccount.findOneAndUpdate(
      { _id: subAccountId },
      {
        $set: {
          ...subAccount,
          _id: subAccountId,
          companyEmail: subAccount.companyEmail,
        },
        $setOnInsert: {
          permissions: [{
            _id: permissionId,
            access: true,
            email: agencyOwner.email,
          }],
          pipeline: [{ name: 'Lead Cycle' }],
          sidebarOption: sidebarOptions,
        },
      },
      {
        upsert: true,
        new: true,
      }
    ).lean().exec();

    if (!response) throw new Error('SubAccount upsert failed.');

    console.log('SubAccount details:', response);
    return { ...response, subAccountId: response._id.toString() };
  } catch (error) {
    console.error('Error during upsertSubAccount:', error);
    throw new Error('Unable to upsert subAccount.');
  }
};

 */



/* "use server";

import { connectDB } from '@/lib/db'; // Database connection logic
import SubAccount from '@/models/sub-account.model'; // SubAccount model
import User from '@/models/user.model'; // User model for resolving emails to ObjectId
import { SubAccount as SubAccountType } from '@/lib/types/sub-account.types'; // SubAccount type definition
import mongoose from 'mongoose';
import { getDefaultSubAccountSidebarOptions } from '@/lib/utils/sidebar-options'; // Utility function for sidebar options
import { Role } from '@/constants/enums/role.enum';
import Permission from '@/models/permission.model';
import SubAccountSidebarOption from '@/models/sub-account-sidebar-option.model';
import Agency from '@/models/agency.model';

export const upsertSubAccount = async (subAccount: Partial<SubAccountType>) => {
  if (!subAccount.companyEmail) return null;

  try {
    await connectDB(); // Ensure database connection

    // Find the agency owner
    const agencyOwner = await User.findOne({
      agencyId: subAccount.agencyId,
      role: Role.AGENCY_OWNER,
    }).exec();

    if (!agencyOwner) {
      throw new Error(`🔴 Error: Could not find agency owner for subAccount with ID: ${subAccount._id}.`);
    }

    // Generate a new _id if not provided
    const subAccountId = subAccount._id || new mongoose.Types.ObjectId();

    const sidebarOptions = getDefaultSubAccountSidebarOptions(subAccountId.toString()).map(option => ({
      ...option,
      subAccountId, // Ensure subAccountId is added here
    }));
 

    const sidebarOptionIds = await SubAccountSidebarOption.insertMany(sidebarOptions)
    .then(options => options.map(option => option._id)); 


    // Check if a Permission document already exists for the agency owner
    let permission = await Permission.findOne({ email: agencyOwner.email }).exec();

    // If no existing permission, create a new one
    if (!permission) {
      permission = await Permission.create({
        access: true,
        email: agencyOwner.email,
        user: agencyOwner._id,  // Ensure user reference is included
        subAccountId: subAccountId,
      });

      console.log('New permission created:', permission); // Add this for debugging
    }


    const placeholderPipelineId = new mongoose.Types.ObjectId();  // Temporary placeholder
    const pipelineData = [{ _id: placeholderPipelineId, name: 'Lead Cycle' }];

    // Upsert SubAccount
    const response = await SubAccount.findOneAndUpdate(
      { _id: subAccountId },
      {
        $set: {
          ...subAccount,
          _id: subAccountId,
          companyEmail: subAccount.companyEmail,
          user: agencyOwner._id,  // Correct user reference
        },
        $setOnInsert: {
          permissions: [permission._id], // Store reference instead of embedding
          pipeline: pipelineData,
          sidebarOption: sidebarOptionIds,
        },
      },
      {
        upsert: true,
        new: true,
      }
    ).lean().exec();
    

    if (!response) throw new Error('SubAccount upsert failed.');

    console.log("upsert SubAccount Response:", response)


    const populatedResponse = await SubAccount.findById(response._id)
      .populate('sidebarOption')  // Populate the 'sidebarOption' field
      .exec();

    if (!populatedResponse) {
      throw new Error('Error populating sidebar options.');
    }

   
    const agency = await Agency.findById(subAccount.agencyId);
    if (agency) {
      // Update the agency with the new subAccount reference
      const updatedAgency = await Agency.findByIdAndUpdate(
        subAccount.agencyId,
        { $addToSet: { subAccounts: populatedResponse._id } },
        { new: true }
      )
      .populate("subAccounts")  // Populate the subAccounts field
      .lean()
      .exec();

      console.log("Updated Agency with populated subAccounts:", updatedAgency);

      // Update the agency owner with the new subAccount reference
      const updatedUser = await User.findOneAndUpdate(
        { _id: agencyOwner._id },
        { $addToSet: { subAccounts: populatedResponse._id } },
        
        { new: true }
      )
      .populate("subAccounts")
      .lean()
      .exec();

      console.log("Updated User with populated subAccounts:", updatedUser);
      
    } else {
      throw new Error(`Agency with ID ${subAccount.agencyId} not found.`);
    }

    console.log('SubAccount details with populated sidebar options:', populatedResponse);
    return { ...populatedResponse.toObject(), subAccountId: populatedResponse._id.toString() };
  } catch (error) {
    console.error('Error during upsertSubAccount:', error);
    throw new Error('Unable to upsert subAccount.');
  }
};
 */

"use server";

import { connectDB } from '@/lib/db'; // Database connection logic
import SubAccount from '@/models/sub-account.model'; // SubAccount model
import User from '@/models/user.model'; // User model for resolving emails to ObjectId
import { SubAccount as SubAccountType } from '@/lib/types/sub-account.types'; // SubAccount type definition
import mongoose from 'mongoose';
import { getDefaultSubAccountSidebarOptions } from '@/lib/utils/sidebar-options'; // Utility function for sidebar options
import { Role } from '@/constants/enums/role.enum';
import Permission from '@/models/permission.model';
import SubAccountSidebarOption from '@/models/sub-account-sidebar-option.model';
import Agency from '@/models/agency.model';

export const upsertSubAccount = async (subAccount: Partial<SubAccountType>) => {
  if (!subAccount.companyEmail) return null;

  try {
    await connectDB(); // Ensure database connection

    // Find the agency owner
    const agencyOwner = await User.findOne({
      agencyId: subAccount.agencyId,
      role: Role.AGENCY_OWNER,
    }).exec();

    if (!agencyOwner) {
      throw new Error(`🔴 Error: Could not find agency owner for subAccount with ID: ${subAccount._id}.`);
    }

    // Generate a new _id if not provided
    const subAccountId = subAccount._id || new mongoose.Types.ObjectId();

    const sidebarOptions = getDefaultSubAccountSidebarOptions(subAccountId.toString()).map(option => ({
      ...option,
      subAccountId, // Ensure subAccountId is added here
    }));

    const sidebarOptionIds = await SubAccountSidebarOption.insertMany(sidebarOptions)
      .then(options => options.map(option => option._id));

    // Check if a Permission document already exists for the agency owner
    let permission = await Permission.findOne({ email: agencyOwner.email, subAccountId }).exec();

    // If no existing permission, create a new one
    if (!permission) {
      permission = await Permission.create({
        access: true,
        email: agencyOwner.email,
        user: agencyOwner._id, // Ensure user reference is included
        subAccountId,
      });

      console.log('New permission created:', permission);
    }

    // ✅ Update the user's permissions array
    const updatedUser = await User.findByIdAndUpdate(
      agencyOwner._id,
      { $addToSet: { permissions: permission._id } }, // Add permission reference
      { new: true }
    )
    .populate("permissions") // Populate permissions for debugging
    .lean()
    .exec();

    console.log("Updated User with permissions:", updatedUser);

    const placeholderPipelineId = new mongoose.Types.ObjectId(); // Temporary placeholder
    const pipelineData = [{ _id: placeholderPipelineId, name: 'Lead Cycle' }];

    // Upsert SubAccount
    const response = await SubAccount.findOneAndUpdate(
      { _id: subAccountId },
      {
        $set: {
          ...subAccount,
          _id: subAccountId,
          companyEmail: subAccount.companyEmail,
          user: agencyOwner._id, // Correct user reference
        },
        $setOnInsert: {
          permissions: [permission._id], // Store reference instead of embedding
          pipeline: pipelineData,
          sidebarOption: sidebarOptionIds,
        },
      },
      {
        upsert: true,
        new: true,
      }
    ).lean().exec();

    if (!response) throw new Error('SubAccount upsert failed.');

    console.log("Upsert SubAccount Response:", response);

    const populatedResponse = await SubAccount.findById(response._id)
      .populate('sidebarOption') // Populate the 'sidebarOption' field
      .exec();

    if (!populatedResponse) {
      throw new Error('Error populating sidebar options.');
    }

    const agency = await Agency.findById(subAccount.agencyId);
    if (agency) {
      // Update the agency with the new subAccount reference
      const updatedAgency = await Agency.findByIdAndUpdate(
        subAccount.agencyId,
        { $addToSet: { subAccounts: populatedResponse._id } },
        { new: true }
      )
      .populate("subAccounts") // Populate the subAccounts field
      .lean()
      .exec();

      console.log("Updated Agency with populated subAccounts:", updatedAgency);

      // Update the agency owner with the new subAccount reference
      const updatedUserWithSubAccount = await User.findOneAndUpdate(
        { _id: agencyOwner._id },
        { $addToSet: { subAccounts: populatedResponse._id } },
        { new: true }
      )
      .populate("subAccounts")
      .lean()
      .exec();

      console.log("Updated User with populated subAccounts:", updatedUserWithSubAccount);
    } else {
      throw new Error(`Agency with ID ${subAccount.agencyId} not found.`);
    }

    console.log('SubAccount details with populated sidebar options:', populatedResponse);
    return { ...populatedResponse.toObject(), subAccountId: populatedResponse._id.toString() };
  } catch (error) {
    console.error('Error during upsertSubAccount:', error);
    throw new Error('Unable to upsert subAccount.');
  }
};
