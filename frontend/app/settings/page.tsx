"use client"

import { SettingsPage } from "@/components/settings/settings-page"
import { useAppStore } from "@/lib/store"

export default function Settings() {
  const { currentUser } = useAppStore()

  if (!currentUser) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Settings</h1>
        <div className="bg-card rounded-lg border border-border p-6">
          <p className="text-muted-foreground">Please log in to access settings.</p>
        </div>
      </div>
    )
  }

  return <SettingsPage userId={currentUser.id} />
}
