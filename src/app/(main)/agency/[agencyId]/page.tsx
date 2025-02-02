/* 
import Agency from '@/models/agency.model';
import React from 'react';

const Page = async ({ params }: { params: { agencyId: string } }) => {
  // Extract the agencyId from params
  const { agencyId } = params;
  console.log("agency:", agencyId);

  // Validate the agencyId in the database
 
      const agency = await Agency.findOne({ _id: agencyId });
      console.log("agency", agency)

    
  

  // Render conditionally based on the agency existence
  return (
    <div>
      {agency ? (
        <p>{agencyId}</p>
      ) : (
        <p>Agency not found</p>
      )}
    </div>
  );
};

export default Page;
   */


import React from 'react';
import mongoose from 'mongoose';
import Agency from '@/models/agency.model';
import { connectDB } from '@/lib/db';


const Page = async ({ params }: { params: { agencyId: string } }) => {
  const { agencyId } = params;
  console.log('Received agencyId:', agencyId);

  let agency = null;

  try {
    // Connect to the database
    await connectDB();

    // Validate if agencyId is a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(agencyId)) {
      // Fetch the agency from the database
      agency = await Agency.findById(agencyId).lean();
    } else {
      console.log('Invalid ObjectId:', agencyId);
    }
  } catch (error) {
    console.error('Error fetching agency:', error);
  }

  // Render conditionally based on agency existence
  return (
    <div>
      {agency ? (
        <div>
          <h1>Agency Details</h1>
          <p>ID: {agencyId}</p>
          <p>Name: {agency.name}</p>
        </div>
      ) : (
        <p>Agency not found</p>
      )}
    </div>
  );
};

export default Page;
