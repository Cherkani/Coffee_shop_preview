import type { Organization } from "../types"

export const mockOrganizations: Organization[] = [
  {
    id: "1",
    name: "Brew & Bean Coffee Co.",
    ownerId: "2",
    adminId: "3",
    subscriptionPlan: "pro",
    status: "active",
    createdAt: new Date("2023-01-15"),
    monthlyRevenue: 15750,
    locations: [
      { id: "1", name: "Downtown Location", address: "123 Main St, Downtown", organizationId: "1" },
      { id: "2", name: "Mall Location", address: "456 Shopping Center, Westside Mall", organizationId: "1" },
    ],
  },
  {
    id: "2",
    name: "Morning Grind Coffee",
    ownerId: "7",
    adminId: "8",
    subscriptionPlan: "basic",
    status: "active",
    createdAt: new Date("2023-03-20"),
    monthlyRevenue: 8500,
    locations: [
      { id: "3", name: "Main Street", address: "789 Main St, City Center", organizationId: "2" },
      { id: "4", name: "Riverside", address: "456 River Ave, Riverside District", organizationId: "2" },
    ],
  },
]
