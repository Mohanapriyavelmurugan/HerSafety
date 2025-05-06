"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Bell, LogOut, Eye, AlertTriangle, CheckCircle2, Clock, FileText } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

// Mock incident data
const mockIncidents = [
  {
    id: "INC-123456",
    date: "2023-05-15",
    time: "14:30",
    location: "Central Park, New York",
    type: "Harassment",
    status: "In Progress",
    reporter: "Jane Doe",
    description: "Verbal harassment while walking through the park.",
    evidence: true,
  },
  {
    id: "INC-789012",
    date: "2023-05-14",
    time: "09:15",
    location: "Main Street, Boston",
    type: "Stalking",
    status: "New",
    reporter: "Emily Johnson",
    description: "Being followed by the same person for several days.",
    evidence: false,
  },
  {
    id: "INC-345678",
    date: "2023-05-10",
    time: "18:45",
    location: "Downtown, Chicago",
    type: "Assault",
    status: "In Progress",
    reporter: "Sarah Williams",
    description: "Physical assault while leaving work.",
    evidence: true,
  },
  {
    id: "INC-901234",
    date: "2023-05-08",
    time: "22:10",
    location: "Subway Station, New York",
    type: "Harassment",
    status: "Resolved",
    reporter: "Maria Garcia",
    description: "Harassment on the subway platform.",
    evidence: false,
  },
  {
    id: "INC-567890",
    date: "2023-05-05",
    time: "16:30",
    location: "Shopping Mall, Los Angeles",
    type: "Stalking",
    status: "In Progress",
    reporter: "Lisa Chen",
    description: "Being followed around the mall by an unknown person.",
    evidence: true,
  },
]

export default function AdminDashboardPage() {
  const [incidents, setIncidents] = useState(mockIncidents)
  const [selectedIncident, setSelectedIncident] = useState<(typeof mockIncidents)[0] | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  const filteredIncidents = incidents.filter((incident) => {
    // Apply status filter
    if (statusFilter !== "all" && incident.status !== statusFilter) {
      return false
    }

    // Apply search filter (case insensitive)
    if (
      searchQuery &&
      !incident.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !incident.location.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !incident.reporter.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    return true
  })

  const updateIncidentStatus = (id: string, newStatus: string) => {
    setIncidents(incidents.map((incident) => (incident.id === id ? { ...incident, status: newStatus } : incident)))

    toast({
      title: "Status updated",
      description: `Case ${id} status changed to ${newStatus}`,
    })
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "New":
        return "bg-blue-500"
      case "In Progress":
        return "bg-yellow-500"
      case "Resolved":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case "New":
        return <Clock className="h-4 w-4" />
      case "In Progress":
        return <FileText className="h-4 w-4" />
      case "Resolved":
        return <CheckCircle2 className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Link href="/admin-login">
            <Button variant="outline" className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{incidents.length}</div>
            <p className="text-xs text-muted-foreground">+2 from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Cases</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {incidents.filter((i) => i.status === "New" || i.status === "In Progress").length}
            </div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Cases</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{incidents.filter((i) => i.status === "Resolved").length}</div>
            <p className="text-xs text-muted-foreground">Successfully handled</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setStatusFilter("all")}>
              All Cases
            </TabsTrigger>
            <TabsTrigger value="new" onClick={() => setStatusFilter("New")}>
              New
            </TabsTrigger>
            <TabsTrigger value="in-progress" onClick={() => setStatusFilter("In Progress")}>
              In Progress
            </TabsTrigger>
            <TabsTrigger value="resolved" onClick={() => setStatusFilter("Resolved")}>
              Resolved
            </TabsTrigger>
          </TabsList>

          <div className="flex w-full sm:w-auto gap-2">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search cases..."
                className="w-full sm:w-[250px] pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="m-0">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Case ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Reporter</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIncidents.length > 0 ? (
                    filteredIncidents.map((incident) => (
                      <TableRow key={incident.id}>
                        <TableCell className="font-medium">{incident.id}</TableCell>
                        <TableCell>{incident.date}</TableCell>
                        <TableCell>{incident.location}</TableCell>
                        <TableCell>{incident.type}</TableCell>
                        <TableCell>{incident.reporter}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(incident.status)}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(incident.status)}
                              {incident.status}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => setSelectedIncident(incident)}
                                >
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View details</span>
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[600px]">
                                {selectedIncident && (
                                  <>
                                    <DialogHeader>
                                      <DialogTitle className="flex items-center justify-between">
                                        <span>Case Details: {selectedIncident.id}</span>
                                        <Badge className={getStatusColor(selectedIncident.status)}>
                                          {selectedIncident.status}
                                        </Badge>
                                      </DialogTitle>
                                      <DialogDescription>
                                        Reported on {selectedIncident.date} at {selectedIncident.time}
                                      </DialogDescription>
                                    </DialogHeader>

                                    <div className="grid gap-4 py-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <h3 className="text-sm font-medium mb-1">Reporter</h3>
                                          <p className="text-sm">{selectedIncident.reporter}</p>
                                        </div>
                                        <div>
                                          <h3 className="text-sm font-medium mb-1">Incident Type</h3>
                                          <p className="text-sm">{selectedIncident.type}</p>
                                        </div>
                                      </div>

                                      <div>
                                        <h3 className="text-sm font-medium mb-1">Location</h3>
                                        <p className="text-sm">{selectedIncident.location}</p>
                                      </div>

                                      <div>
                                        <h3 className="text-sm font-medium mb-1">Description</h3>
                                        <p className="text-sm">{selectedIncident.description}</p>
                                      </div>

                                      <div>
                                        <h3 className="text-sm font-medium mb-1">Evidence</h3>
                                        <p className="text-sm">
                                          {selectedIncident.evidence
                                            ? "Evidence files attached"
                                            : "No evidence files attached"}
                                        </p>
                                      </div>

                                      <div>
                                        <h3 className="text-sm font-medium mb-1">Update Status</h3>
                                        <Select
                                          defaultValue={selectedIncident.status}
                                          onValueChange={(value) => {
                                            updateIncidentStatus(selectedIncident.id, value)
                                            setSelectedIncident({ ...selectedIncident, status: value })
                                          }}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="New">New</SelectItem>
                                            <SelectItem value="In Progress">In Progress</SelectItem>
                                            <SelectItem value="Resolved">Resolved</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>

                                    <DialogFooter>
                                      <Button type="submit">Save Changes</Button>
                                    </DialogFooter>
                                  </>
                                )}
                              </DialogContent>
                            </Dialog>

                            <Select
                              defaultValue={incident.status}
                              onValueChange={(value) => updateIncidentStatus(incident.id, value)}
                            >
                              <SelectTrigger className="h-8 w-[130px]">
                                <SelectValue placeholder="Update status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="New">New</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Resolved">Resolved</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No incidents found matching your filters
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new" className="m-0">
          <Card>
            <CardContent className="p-4 text-center">
              {filteredIncidents.length > 0 ? (
                <Table>{/* Same table structure as above */}</Table>
              ) : (
                <p>No new cases found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="in-progress" className="m-0">
          <Card>
            <CardContent className="p-4 text-center">
              {filteredIncidents.length > 0 ? (
                <Table>{/* Same table structure as above */}</Table>
              ) : (
                <p>No in-progress cases found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resolved" className="m-0">
          <Card>
            <CardContent className="p-4 text-center">
              {filteredIncidents.length > 0 ? (
                <Table>{/* Same table structure as above */}</Table>
              ) : (
                <p>No resolved cases found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
