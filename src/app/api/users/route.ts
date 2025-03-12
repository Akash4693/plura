/* import { connectDB } from "@/lib/db";
import User from "@/models/user.model";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export const GET = async (req: Request) => {
  try {
    await connectDB();

    // Extract agencyId from query params
    const { searchParams } = new URL(req.url);
    const agencyId = searchParams.get("agencyId");

    if (!agencyId) {
      return NextResponse.json(
        { error: "Missing agencyId parameter" },
        { status: 400 }
      );
    }

    const teamMembers = await User.find({
      agencyId: new Types.ObjectId(agencyId),
    })
      .populate({
        path: "agencyId",
        model: "Agency",
        populate: { path: "subAccounts", model: "SubAccount" },
        options: { lean: true },
      })
      .populate({
        path: "permissions",
        model: "Permission",
        populate: { path: "subAccount", model: "SubAccount" },
        options: { lean: true },
      })
      .lean();

      console.log("Backend Response:", teamMembers);

    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
 */

"use server";

import { NextResponse } from "next/server";
import { getUsersWithAgencySubAccountPermissionsSidebarOptions } from "@/services/user.service";
import { PopulatedUser } from "@/lib/types/user.types";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const agencyId = searchParams.get("agencyId");

    console.log("route:", agencyId);

    if (!agencyId) {
      return NextResponse.json({ error: "Missing agencyId" }, { status: 400 });
    }

    const users = await getUsersWithAgencySubAccountPermissionsSidebarOptions(
      agencyId
    );

    if (!users) {
      return NextResponse.json({ error: "No users found" }, { status: 404 });
    }

    const usersArray: PopulatedUser[] = users
      ? Array.isArray(users)
        ? users
        : [users]
      : [];

    console.log("api request:", usersArray);
    return NextResponse.json(usersArray);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
