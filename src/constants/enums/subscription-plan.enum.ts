export const SubscriptionPlan = {
    Basic: "price_1OYxkqFj9oKEERu1NbKUxXxN",
    Unlimited: "price_1OYxkqFj9oKEERu1KfJGWxgN",
} as const;

export type SubscriptionPlan = keyof typeof SubscriptionPlan;