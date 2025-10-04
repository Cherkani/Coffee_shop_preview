"use client"

import { useState, useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { getAllUsers } from "@/lib/services"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, User, UserCog } from "lucide-react"
import type { User as UserType } from "@/lib/types"

const roleColors = {
  superuser: "bg-purple-500",
  owner: "bg-blue-500",
  admin: "bg-green-500",
  cashier: "bg-orange-500",
}

export function Header() {
  const { currentUser, currentOrganization, currentLocation, organizations, setCurrentUser, signOut } =
    useAppStore()
  
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true)
        const allUsers = await getAllUsers()
        setUsers(allUsers)
      } catch (error) {
        console.error("Failed to load users:", error)
        setUsers([])
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  if (!currentUser) return null

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <Badge className={`${roleColors[currentUser.role]} text-white`}>{currentUser.role.toUpperCase()}</Badge>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <UserCog className="h-3 w-3" />
              Switch Role
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Demo: Switch User Role</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {loading ? (
              <DropdownMenuItem disabled>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse" />
                  <span>Loading users...</span>
                </div>
              </DropdownMenuItem>
            ) : (
              users.map((user) => (
                <DropdownMenuItem
                  key={user.id}
                  onClick={() => setCurrentUser(user)}
                  className={currentUser.id === user.id ? "bg-secondary" : ""}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${roleColors[user.role]}`} />
                    <span>{user.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {user.role}
                    </Badge>
                  </div>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {currentOrganization && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Org:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1">
                  {currentOrganization.name}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Organizations</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {organizations.map((org) => (
                  <DropdownMenuItem key={org.id}>{org.name}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {currentLocation && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Location:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1">
                  {currentLocation.name}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Locations</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {currentOrganization?.locations.map((location) => (
                  <DropdownMenuItem key={location.id}>{location.name}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <User className="h-4 w-4" />
              {currentUser.name}
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="text-red-600">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
