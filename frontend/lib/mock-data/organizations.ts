import type { Organization } from "../types"

export const mockOrganizations: Organization[] = [
  {
    id: "1",
    name: "Brew & Bean Coffee Co.",
    ownerId: "2",
    subscriptionPlan: "pro",
    status: "active",
    createdAt: new Date("2023-01-15"),
    monthlyRevenue: 15750,
    locations: [
      { id: "1", name: "Downtown Location", address: "123 Main St, Downtown", organizationId: "1" },
      { id: "2", name: "Mall Location", address: "456 Shopping Center, Westside Mall", organizationId: "1" },
      { id: "3", name: "University Campus", address: "789 College Ave, Campus Center", organizationId: "1" },
      { id: "4", name: "Airport Terminal", address: "321 Airport Blvd, Terminal B", organizationId: "1" },
    ],
  },
  {
    id: "2",
    name: "Morning Grind Coffee",
    ownerId: "9",
    subscriptionPlan: "basic",
    status: "active",
    createdAt: new Date("2023-03-20"),
    monthlyRevenue: 8500,
    locations: [
      { id: "5", name: "Main Street", address: "789 Main St, City Center", organizationId: "2" },
      { id: "6", name: "Riverside", address: "456 River Ave, Riverside District", organizationId: "2" },
    ],
  },
  {
    id: "3",
    name: "Coffee Corner",
    ownerId: "10",
    subscriptionPlan: "enterprise",
    status: "trial",
    createdAt: new Date("2023-06-10"),
    monthlyRevenue: 12300,
    locations: [
      { id: "7", name: "Business District", address: "654 Corporate Blvd, Financial District", organizationId: "3" },
      { id: "8", name: "Tech Hub", address: "987 Innovation Way, Tech Park", organizationId: "3" },
      { id: "9", name: "Suburban Mall", address: "321 Suburban Plaza, West End", organizationId: "3" },
    ],
  },
  {
    id: "4",
    name: "Artisan Roasters",
    ownerId: "11",
    subscriptionPlan: "pro",
    status: "active",
    createdAt: new Date("2023-08-05"),
    monthlyRevenue: 9800,
    locations: [
      { id: "10", name: "Roastery & Cafe", address: "123 Artisan St, Arts District", organizationId: "4" },
      { id: "11", name: "Farmers Market", address: "456 Market Square, Old Town", organizationId: "4" },
    ],
  },
]
