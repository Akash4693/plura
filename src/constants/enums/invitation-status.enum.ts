export const InvitationStatus = {
    ACCEPTED: "ACCEPTED",
    REVOKED: "REVOKED",
    PENDING: "PENDING",
} as const;

export type InvitationStatus = keyof typeof InvitationStatus;