"use client"

import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User as UserIcon, Building2, MapPin, Users, Crown, Settings, ShoppingCart } from "lucide-react"
import { organizationNames, locationNames, roleColors, roleDescriptions } from "@/lib/mock-data"
import { getAllUsers, getSuperUser, getUsersGroupedByOrganization } from "@/lib/services"
import type { User, UserRole } from "@/lib/types"

const roleIcons = {
  superuser: UserIcon,
  owner: Crown,
  admin: Settings,
  cashier: ShoppingCart,
}

export function LoginScreen() {
  const { signIn } = useAppStore()
  
  // Get all users for login screen (no filtering)
  const users = getAllUsers()
  const superuser = getSuperUser()
  const groupedByOrg = getUsersGroupedByOrganization()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">CoffeeShop POS</h1>
          <p className="text-muted-foreground">Select a user to sign in and explore their interface</p>
        </div>

        <div className="space-y-8">
          {/* Super Admin Section */}
          {superuser && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-purple-100">
                  <UserIcon className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-semibold">Platform Administration</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card
                  className="hover:shadow-lg transition-shadow cursor-pointer border-purple-200"
                  onClick={() => signIn(superuser)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-purple-100">
                          <UserIcon className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{superuser.name}</CardTitle>
                          <CardDescription>{superuser.email}</CardDescription>
                        </div>
                      </div>
                      <Badge className="bg-purple-500 text-white">SUPERUSER</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{roleDescriptions.superuser}</p>
                    <Button className="w-full" onClick={() => signIn(superuser)}>
                      Sign in as {superuser.name}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Organizations Section */}
          {Object.entries(groupedByOrg).map(([orgId, orgUsers]) => (
            <div key={orgId}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold">{organizationNames[orgId as keyof typeof organizationNames]}</h2>
                <Badge variant="outline" className="ml-auto">
                  {orgUsers.length} users
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {orgUsers.map((user) => {
                  const RoleIcon = roleIcons[user.role as keyof typeof roleIcons]
                  return (
                    <Card
                      key={user.id}
                      className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => signIn(user)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-secondary">
                              <RoleIcon className="h-5 w-5" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{user.name}</CardTitle>
                              <CardDescription>{user.email}</CardDescription>
                            </div>
                          </div>
                          <Badge className={`${roleColors[user.role as keyof typeof roleColors]} text-white`}>
                            {user.role.toUpperCase()}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">{roleDescriptions[user.role as keyof typeof roleDescriptions]}</p>

                        <div className="space-y-2">
                          {user.locationId && (
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{locationNames[user.locationId as keyof typeof locationNames]}</span>
                            </div>
                          )}
                        </div>

                        <Button className="w-full mt-4" onClick={() => signIn(user)}>
                          Sign in as {user.name}
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
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
