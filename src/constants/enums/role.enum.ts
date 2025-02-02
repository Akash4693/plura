export const Role = {
    AGENCY_OWNER: "AGENCY_OWNER",
    AGENCY_ADMIN: "AGENCY_ADMIN",
    SUBACCOUNT_USER: "SUBACCOUNT_USER",
    SUBACCOUNT_GUEST: "SUBACCOUNT_GUEST",
  } as const;

export type Role = keyof typeof Role;  