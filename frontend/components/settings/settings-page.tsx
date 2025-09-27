"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeCustomizer } from "./theme-customizer"
import { UserPreferencesPanel } from "./user-preferences-panel"
import { Settings, Palette, User } from "lucide-react"

interface SettingsPageProps {
  userId: string
}

export function SettingsPage({ userId }: SettingsPageProps) {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="theme" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="theme" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Theme & Appearance
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            User Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="theme" className="mt-6">
          <ThemeCustomizer />
        </TabsContent>

        <TabsContent value="preferences" className="mt-6">
          <UserPreferencesPanel userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
