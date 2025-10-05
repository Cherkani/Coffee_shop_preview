"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/services/store-service"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MapPin, ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface LocationSelectorProps {
  selectedLocations: string[]
  onLocationChange: (locationIds: string[]) => void
  className?: string
}

export function LocationSelector({ selectedLocations, onLocationChange, className }: LocationSelectorProps) {
  const { currentUser, organizations, locations } = useAppStore()
  const [isOpen, setIsOpen] = useState(false)

  // Get user's organization locations
  const userLocations = currentUser?.organizationId 
    ? organizations.find(org => org.id === currentUser.organizationId)?.locations || []
    : []

  const handleLocationToggle = (locationId: string) => {
    const newSelection = selectedLocations.includes(locationId)
      ? selectedLocations.filter(id => id !== locationId)
      : [...selectedLocations, locationId]
    
    onLocationChange(newSelection)
  }

  const handleSelectAll = () => {
    const allLocationIds = userLocations.map(loc => loc.id)
    onLocationChange(allLocationIds)
  }

  const handleSelectNone = () => {
    onLocationChange([])
  }

  const getSelectedLocationNames = () => {
    if (selectedLocations.length === 0) return "No locations selected"
    if (selectedLocations.length === userLocations.length) return "All locations"
    if (selectedLocations.length === 1) {
      const location = userLocations.find(loc => loc.id === selectedLocations[0])
      return location?.name || "Unknown location"
    }
    return `${selectedLocations.length} locations selected`
  }

  // Don't show for non-owners or if user has no locations
  if (currentUser?.role !== "owner" || userLocations.length === 0) {
    return null
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-between min-w-[200px]",
            className
          )}
        >
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{getSelectedLocationNames()}</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Select Locations</h4>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
                className="h-8 px-2"
              >
                All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectNone}
                className="h-8 px-2"
              >
                None
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            {userLocations.map((location) => {
              const isSelected = selectedLocations.includes(location.id)
              return (
                <div
                  key={location.id}
                  className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleLocationToggle(location.id)}
                >
                  <Checkbox
                    checked={isSelected}
                    onChange={() => handleLocationToggle(location.id)}
                    className="pointer-events-none"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium truncate">{location.name}</span>
                      {isSelected && <Check className="h-4 w-4 text-green-600" />}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {location.address}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
          
          {selectedLocations.length > 0 && (
            <div className="pt-2 border-t">
              <div className="flex flex-wrap gap-1">
                {selectedLocations.map((locationId) => {
                  const location = userLocations.find(loc => loc.id === locationId)
                  return (
                    <Badge
                      key={locationId}
                      variant="secondary"
                      className="text-xs"
                    >
                      {location?.name}
                    </Badge>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
