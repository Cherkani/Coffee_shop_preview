"use client"

import { useAppStore } from "@/lib/services/store-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Play, Square, Calendar } from "lucide-react"
import { useState } from "react"

const timeEntries = [
  {
    id: "1",
    employee: "Mike Cashier",
    date: "2024-03-18",
    clockIn: "7:00 AM",
    clockOut: "3:00 PM",
    totalHours: 8,
    status: "completed",
  },
  {
    id: "2",
    employee: "Lisa Cashier",
    date: "2024-03-18",
    clockIn: "2:00 PM",
    clockOut: "10:00 PM",
    totalHours: 8,
    status: "completed",
  },
  {
    id: "3",
    employee: "David Barista",
    date: "2024-03-19",
    clockIn: "7:00 AM",
    clockOut: null,
    totalHours: 0,
    status: "active",
  },
]

export default function TimeClockPage() {
  const { currentUser } = useAppStore()
  const [isClockedIn, setIsClockedIn] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every second
  useState(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  })

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Please sign in to access the time clock.</p>
      </div>
    )
  }

  const handleClockInOut = () => {
    setIsClockedIn(!isClockedIn)
  }

  const isAdmin = currentUser.role === "admin" || currentUser.role === "owner"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Time Clock</h1>
        <p className="text-muted-foreground">Track work hours and manage time entries</p>
      </div>

      {/* Current Time & Clock In/Out */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Current Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="text-4xl font-mono font-bold">{currentTime.toLocaleTimeString()}</div>
            <div className="text-lg text-muted-foreground">
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="flex justify-center gap-4">
              <Button
                size="lg"
                onClick={handleClockInOut}
                className={isClockedIn ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
              >
                {isClockedIn ? (
                  <>
                    <Square className="h-5 w-5 mr-2" />
                    Clock Out
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Clock In
                  </>
                )}
              </Button>
            </div>
            {isClockedIn && (
              <div className="text-sm text-muted-foreground">Clocked in since 7:00 AM (2 hours 15 minutes)</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Time Entries */}
      <Card>
        <CardHeader>
          <CardTitle>{isAdmin ? "All Time Entries" : "My Time Entries"}</CardTitle>
          <CardDescription>
            {isAdmin ? "View and manage all employee time entries" : "Your recent time clock entries"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timeEntries
              .filter((entry) => isAdmin || entry.employee === currentUser.name)
              .map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    {isAdmin && (
                      <div>
                        <div className="font-medium">{entry.employee}</div>
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{entry.date}</div>
                      <div className="text-sm text-muted-foreground">
                        {entry.clockIn} - {entry.clockOut || "Active"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-medium">
                        {entry.status === "active" ? "In Progress" : `${entry.totalHours}h`}
                      </div>
                      <Badge variant={entry.status === "active" ? "default" : "secondary"}>{entry.status}</Badge>
                    </div>
                    {isAdmin && (
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            This Week Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold">32.5</div>
              <div className="text-sm text-muted-foreground">Hours Worked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">5</div>
              <div className="text-sm text-muted-foreground">Days Worked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">2.5</div>
              <div className="text-sm text-muted-foreground">Overtime Hours</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
