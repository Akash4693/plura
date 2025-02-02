import { Icon } from "@/constants/enums/icon.enum";
import { AgencySidebarOption } from "../types/agency-sidebar-option.types";
import { SubAccountSidebarOption } from "../types/sub-account-sidebar-option.types";

// Using Pick to make sure only name, icon, and link are used from the AgencySidebarOption and SubAccountSidebarOption types
type SidebarOptionWithoutMongooseProps = Pick<AgencySidebarOption, "name" | "icon" | "link"> | Pick<SubAccountSidebarOption, "name" | "icon" | "link">;

// Agency sidebar options
export const getDefaultAgencySidebarOptions = (agencyId: string): SidebarOptionWithoutMongooseProps[] => [
  {
    name: "Dashboard",
    icon: Icon.category,
    link: `/agency/${agencyId}`,
  },
  {
    name: "Launchpad",
    icon: Icon.clipboardIcon,
    link: `/agency/${agencyId}/launchpad`,
  },
  {
    name: "Billing",
    icon: Icon.payment,
    link: `/agency/${agencyId}/billing`,
  },
  {
    name: "Settings",
    icon: Icon.settings,
    link: `/agency/${agencyId}/settings`,
  },
  {
    name: "Sub Accounts",
    icon: Icon.person,
    link: `/agency/${agencyId}/all-subaccounts`,
  },
  {
    name: "Team",
    icon: Icon.shield,
    link: `/agency/${agencyId}/team`,
  },
];

// Sub-account sidebar options
export const getDefaultSubAccountSidebarOptions = (subAccountId: string): SidebarOptionWithoutMongooseProps[] => [
  {
    name: 'Launchpad',
    icon: Icon.clipboardIcon,
    link: `/subaccount/${subAccountId}/launchpad`,
  },
  {
    name: 'Settings',
    icon: Icon.settings,
    link: `/subaccount/${subAccountId}/settings`,
  },
  {
    name: 'Funnels',
    icon: Icon.pipelines,
    link: `/subaccount/${subAccountId}/funnels`,
  },
  {
    name: 'Media',
    icon: Icon.database,
    link: `/subaccount/${subAccountId}/media`,
  },
  {
    name: 'Automations',
    icon: Icon.chip,
    link: `/subaccount/${subAccountId}/automations`,
  },
  {
    name: 'Pipelines',
    icon: Icon.flag,
    link: `/subaccount/${subAccountId}/pipelines`,
  },
  {
    name: 'Contacts',
    icon: Icon.person,
    link: `/subaccount/${subAccountId}/contacts`,
  },
  {
    name: 'Dashboard',
    icon: Icon.category,
    link: `/subaccount/${subAccountId}`,
  },
];
