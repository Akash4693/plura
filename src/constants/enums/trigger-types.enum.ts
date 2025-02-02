export const TriggerTypes = {
    CONTACT_FORM: "CONTACT_FORM",
} as const;

export type TriggerTypes = keyof typeof TriggerTypes;
  