// Organization and location name mappings for display purposes
export const organizationNames = {
  "1": "Brew & Bean Coffee Co.",
  "2": "Morning Grind Coffee",
} as const

export const locationNames = {
  "1": "Downtown Location",
  "2": "Mall Location", 
  "3": "Main Street",
  "4": "Riverside",
} as const

// Role display constants
export const roleColors = {
  superuser: "bg-purple-500",
  owner: "bg-blue-500",
  admin: "bg-green-500",
  cashier: "bg-orange-500",
} as const

export const roleDescriptions = {
  superuser: "Platform-level access to all organizations, billing, and global metrics",
  owner: "Organization-wide control with multi-location management and full reporting",
  admin: "Location-level management with inventory control and staff supervision",
  cashier: "POS interface with lite reporting and kitchen display operations",
} as const
