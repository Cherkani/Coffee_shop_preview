"use client"

import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Building2, MapPin } from "lucide-react"

const roleColors = {
  superuser: "bg-purple-500",
  owner: "bg-blue-500",
  admin: "bg-green-500",
  cashier: "bg-orange-500",
}

const roleDescriptions = {
  superuser: "Platform-level access to all organizations, billing, and global metrics",
  owner: "Organization-wide control with multi-location management and full reporting",
  admin: "Location-level management with inventory control and staff supervision",
  cashier: "POS interface with lite reporting and kitchen display operations",
}

export function LoginScreen() {
  const { users, signIn } = useAppStore()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">CoffeeShop POS</h1>
          <p className="text-muted-foreground">Select a user to sign in and explore their interface</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {users.map((user) => (
            <Card
              key={user.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => signIn(user)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-secondary">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                      <CardDescription>{user.email}</CardDescription>
                    </div>
                  </div>
                  <Badge className={`${roleColors[user.role]} text-white`}>{user.role.toUpperCase()}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{roleDescriptions[user.role]}</p>

                <div className="space-y-2">
                  {user.organizationId && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>Brew & Bean Coffee Co.</span>
                    </div>
                  )}
                  {user.locationId && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>Downtown Location</span>
                    </div>
                  )}
                </div>

                <Button className="w-full mt-4" onClick={() => signIn(user)}>
                  Sign in as {user.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            This is a demo system. Each user has different permissions and interface access.
          </p>
        </div>
      </div>
    </div>
  )
}
