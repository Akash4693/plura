// import mongoose, { Schema, Model } from "mongoose";
// import { Role } from "@/constants/enums/role.enum";
// import type { User } from "@/lib/types/user.types";



// // User Schema
// const userSchema: Schema<User> = new Schema({
//     name: { 
//       type: String, 
//       required: [true, "User name is required"],
//     },
//     avatarUrl: { 
//       type: String,
//       required: [true, "Avatar URL is required"],
//     },
//     email: { 
//       type: String, 
//       unique: true, 
//       required: [true, "User email is required"], 
//       match: [
//         /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
//         "Please enter a valid email address",
//       ],
//     },
//     role: {
//       type: String,
//       enum: Object.values(Role),
//       default: Role.SUBACCOUNT_USER,
//     },
//     agencyId: { 
//       type: mongoose.Schema.Types.ObjectId, 
//       ref: "Agency", 
//     },
//     permissions: [
//       { 
//         type: mongoose.Schema.Types.ObjectId, 
//         ref: "Permission", 
//       }
//     ],
//     tickets: [
//       { 
//         type: mongoose.Schema.Types.ObjectId, 
//         ref: "Ticket", 
//     }
//   ],
//     notifications: [
//       { 
//         type: mongoose.Schema.Types.ObjectId, 
//         ref: "Notification", 
//       },
//     ],
//   },
//   { 
//     timestamps: true,  // Automatically manages createdAt and updatedAt fields
//     //JSON: { virtuals: true },
//     toObject: { virtuals: true },
//   });

// userSchema.index({ agencyId: 1 });

// userSchema.virtual('fullName').get(function (this: User) {
//   return this.name;
// });

// // Virtual to calculate the number of associated tickets
// userSchema.virtual('ticketCount').get(function (this: User) {
//   return this.tickets?.length || 0;
// });

// // Virtual to check if the user has an admin role
// userSchema.virtual('isAdmin').get(function (this: User) {
//   return this.role === Role.AGENCY_ADMIN;
// });

// const User: Model<User> = mongoose.models.User || mongoose.model<User>("User", userSchema);
// export default User;


import mongoose, { Schema, Model, Types } from "mongoose";
import { Role } from "@/constants/enums/role.enum";
import type { User } from "@/lib/types/user.types";
import "@/models/permission.model";
import "@/models/ticket.model";
import "@/models/notification.model";
import "@/models/agency.model";
import "@/models/sub-account.model";


const userSchema: Schema<User> = new Schema({
  name: { 
    type: String, 
    required: [true, "User name is required"],
  },
  avatarUrl: { 
    type: String,
    required: [true, "Avatar URL is required"],
  },
  email: { 
    type: String, 
    unique: true, 
    required: [true, "User email is required"], 
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address",
    ],
  },
  role: {
    type: String,
    enum: Object.values(Role),
    default: Role.SUBACCOUNT_USER,
  },
  agencyId: { 
    type: Types.ObjectId, 
    ref: "Agency", 
  },
  permissions: [
    { 
      type: Types.ObjectId, 
      ref: "Permission", 
    }
  ],
  tickets: [
    { 
      type: Types.ObjectId, 
      ref: "Ticket", 
    }
  ],
  notifications: [
    { 
      type: Types.ObjectId, 
      ref: "Notification", 
    },
  ],
  subAccounts: [
    {
      type: Types.ObjectId,
      ref: "SubAccount",  // Referencing the SubAccount model
    }
  ],
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
userSchema.index({ agencyId: 1 });
userSchema.index({ email: 1 });

// Virtuals
userSchema.virtual('fullName').get(function () {
  return this.name;
});

userSchema.virtual('ticketCount').get(function () {
  return this.tickets?.length || 0;
});

userSchema.virtual('isAdmin').get(function () {
  return this.role === Role.AGENCY_ADMIN;
});

const User: Model<User> = mongoose.models.User || mongoose.model<User>("User", userSchema);

export default User;
