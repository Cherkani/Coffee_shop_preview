"use client"

import { useAppStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Plus, Users } from "lucide-react"

const scheduleData = [
  {
    day: "Monday",
    date: "Mar 18",
    shifts: [
      { employee: "Jane Manager", role: "Admin", time: "6:00 AM - 2:00 PM", status: "confirmed" },
      { employee: "Mike Cashier", role: "Cashier", time: "7:00 AM - 3:00 PM", status: "confirmed" },
      { employee: "Lisa Cashier", role: "Cashier", time: "2:00 PM - 10:00 PM", status: "pending" },
    ],
  },
  {
    day: "Tuesday",
    date: "Mar 19",
    shifts: [
      { employee: "Jane Manager", role: "Admin", time: "6:00 AM - 2:00 PM", status: "confirmed" },
      { employee: "David Barista", role: "Cashier", time: "7:00 AM - 3:00 PM", status: "confirmed" },
      { employee: "Mike Cashier", role: "Cashier", time: "2:00 PM - 10:00 PM", status: "confirmed" },
    ],
  },
  {
    day: "Wednesday",
    date: "Mar 20",
    shifts: [
      { employee: "Jane Manager", role: "Admin", time: "6:00 AM - 2:00 PM", status: "confirmed" },
      { employee: "Lisa Cashier", role: "Cashier", time: "7:00 AM - 3:00 PM", status: "pending" },
      { employee: "David Barista", role: "Cashier", time: "2:00 PM - 10:00 PM", status: "confirmed" },
    ],
  },
]

export default function SchedulingPage() {
  const { currentUser } = useAppStore()

  if (!currentUser || (currentUser.role !== "owner" && currentUser.role !== "admin")) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Access denied. Scheduling is only available to owners and admins.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Staff Scheduling</h1>
          <p className="text-muted-foreground">Manage employee schedules and shifts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            View Calendar
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Shift
          </Button>
        </div>
      </div>

      {/* Schedule Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shifts</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff Coverage</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95%</div>
            <p className="text-xs text-muted-foreground">Shifts covered</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Need approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Schedule */}
      <div className="space-y-4">
        {scheduleData.map((day) => (
          <Card key={day.day}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  {day.day}, {day.date}
                </span>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Shift
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {day.shifts.map((shift, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="font-medium">{shift.employee}</div>
                        <div className="text-sm text-muted-foreground">{shift.role}</div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4" />
                        {shift.time}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={shift.status === "confirmed" ? "default" : "secondary"}>{shift.status}</Badge>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
