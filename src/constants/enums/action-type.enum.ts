export const ActionType = {
    CREATE_CONTACT: "CREATE_CONTACT",
} as const;

export type ActionType = keyof typeof  ActionType;


