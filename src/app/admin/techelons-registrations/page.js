"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Download, Trash2, RefreshCw, Eye, Filter } from "lucide-react";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TechelonsRegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showFlushDialog, setShowFlushDialog] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  // Fetch registrations
  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/techelons-registrations");

      if (!response.ok) {
        throw new Error("Failed to fetch registrations");
      }

      const data = await response.json();
      setRegistrations(data.registrations || []);
    } catch (error) {
      console.error("Error fetching registrations:", error);
      toast.error("Failed to load registrations");
    } finally {
      setLoading(false);
    }
  };

  // Get unique event IDs for filter
  const eventIds = useMemo(() =>
    ["all", ...new Set(registrations.map(reg => reg.eventId))],
    [registrations]
  );

  // Filter registrations based on active filter
  const filteredRegistrations = useMemo(() =>
    activeFilter === "all"
      ? registrations
      : registrations.filter(reg => reg.eventId === activeFilter),
    [activeFilter, registrations]
  );

  // Initial fetch
  useEffect(() => {
    fetchRegistrations();
  }, []);

  // Delete a registration
  const deleteRegistration = async (id) => {
    try {
      const response = await fetch(`/api/admin/techelons-registrations?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete registration");
      }

      toast.success("Registration deleted successfully");
      fetchRegistrations();
    } catch (error) {
      console.error("Error deleting registration:", error);
      toast.error("Failed to delete registration");
    } finally {
      setShowDeleteDialog(false);
    }
  };

  // Flush all registrations
  const flushAllRegistrations = async () => {
    try {
      const response = await fetch("/api/admin/techelons-registrations/flush", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to flush registrations");
      }

      const data = await response.json();
      toast.success(`${data.count} registrations deleted successfully`);
      fetchRegistrations();
    } catch (error) {
      console.error("Error flushing registrations:", error);
      toast.error("Failed to flush registrations");
    } finally {
      setShowFlushDialog(false);
    }
  };

  // Download registrations as CSV
  const downloadCSV = () => {
    window.open("/api/admin/techelons-registrations/export", "_blank");
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Mobile-friendly display for team members
  const TeamMemberMobileCard = ({ member, index }) => (
    <div className="mb-3 rounded-md border p-3 last:mb-0">
      <h4 className="font-medium">Member {index + 1}</h4>
      <div className="mt-2 space-y-1 text-sm">
        <p><strong>Name:</strong> {member.name}</p>
        <p><strong>Email:</strong> {member.email}</p>
        <p><strong>Phone:</strong> {member.phone}</p>
        <p><strong>College:</strong> {member.college}</p>
      </div>
    </div>
  );

  return (
    <div className="w-full px-2 py-2 sm:container sm:mx-auto sm:py-4 md:px-4 md:py-6">
      <div className="mb-4 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold md:text-2xl lg:text-3xl">Techelons Registrations</h1>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={fetchRegistrations}
            disabled={loading}
            size="sm"
            className="text-xs sm:text-sm"
          >
            <RefreshCw className={`mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={downloadCSV}
            size="sm"
            className="text-xs sm:text-sm"
          >
            <Download className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
            Export
          </Button>
          <Button
            variant="destructive"
            onClick={() => setShowFlushDialog(true)}
            size="sm"
            className="text-xs sm:text-sm"
          >
            <Trash2 className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
            Flush
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="p-3 pb-1 sm:p-6 sm:pb-2">
          <CardTitle className="text-lg sm:text-xl">Registration Data</CardTitle>
          <CardDescription>
            Total: {registrations.length} {activeFilter !== "all" && `(Filtered: ${filteredRegistrations.length})`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className="mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filter by Event:</span>
              <Select value={activeFilter} onValueChange={setActiveFilter}>
                <SelectTrigger className="w-48 max-w-full">
                  <SelectValue placeholder="Select event" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {eventIds.map(eventId => (
                      <SelectItem key={eventId} value={eventId}>
                        {eventId === "all" ? "All Events" : eventId}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {activeFilter !== "all" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveFilter("all")}
                  className="h-8 px-2 text-xs"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex h-40 items-center justify-center sm:h-64">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground sm:h-8 sm:w-8" />
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center text-muted-foreground sm:h-64">
              <AlertCircle className="mb-2 h-6 w-6 sm:h-8 sm:w-8" />
              <p>No registrations found</p>
            </div>
          ) : (
            <>
              {/* Mobile version: Cards */}
              <div className="sm:hidden">
                <div className="space-y-3">
                  {filteredRegistrations.map((registration) => (
                    <div key={registration._id} className="rounded-md border p-3">
                      <div className="flex items-start justify-between">
                        <Badge variant="outline" className="text-xs">{registration.eventId}</Badge>
                        <div className="flex">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => {
                              setSelectedRegistration(registration);
                              setShowDetailsDialog(true);
                            }}
                            aria-label="View details"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-destructive"
                            onClick={() => {
                              setSelectedRegistration(registration);
                              setShowDeleteDialog(true);
                            }}
                            aria-label="Delete registration"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2 space-y-1 text-xs">
                        <p><strong>Name:</strong> {registration.mainParticipant.name}</p>
                        <p><strong>Email:</strong> {registration.mainParticipant.email}</p>
                        <p><strong>Phone:</strong> {registration.mainParticipant.phone}</p>
                        <p><strong>Date:</strong> {new Date(registration.registrationDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop version: Table */}
              <div className="hidden overflow-x-auto sm:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">Event</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead className="hidden lg:table-cell">College</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="w-24 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRegistrations.map((registration) => (
                      <TableRow key={registration._id}>
                        <TableCell>
                          <Badge variant="outline">{registration.eventId}</Badge>
                        </TableCell>
                        <TableCell className="max-w-[120px] truncate" title={registration.mainParticipant.name}>
                          {registration.mainParticipant.name}
                        </TableCell>
                        <TableCell className="max-w-[150px] truncate" title={registration.mainParticipant.email}>
                          {registration.mainParticipant.email}
                        </TableCell>
                        <TableCell>
                          {registration.mainParticipant.phone}
                        </TableCell>
                        <TableCell className="hidden max-w-[120px] truncate lg:table-cell" title={registration.mainParticipant.college}>
                          {registration.mainParticipant.college}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {formatDate(registration.registrationDate)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedRegistration(registration);
                                setShowDetailsDialog(true);
                              }}
                              aria-label="View details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => {
                                setSelectedRegistration(registration);
                                setShowDeleteDialog(true);
                              }}
                              aria-label="Delete registration"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="sm:max-w-md max-w-[95vw] p-4 sm:p-6 overflow-hidden">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base sm:text-lg">Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-sm sm:text-base">
              Are you sure you want to delete this registration? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {selectedRegistration && (
            <div className="py-2 sm:py-4">
              <div className="space-y-1 text-sm sm:space-y-2 sm:text-base">
                <p><strong>Event:</strong> {selectedRegistration.eventName}</p>
                <p><strong>Name:</strong> {selectedRegistration.mainParticipant.name}</p>
                <p><strong>Email:</strong> {selectedRegistration.mainParticipant.email}</p>
              </div>
            </div>
          )}
          <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
            <AlertDialogCancel className="mt-0 text-sm sm:text-base">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedRegistration && deleteRegistration(selectedRegistration._id)}
              className="bg-destructive text-sm hover:bg-destructive/90 sm:text-base"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Flush Confirmation Alert Dialog */}
      <AlertDialog open={showFlushDialog} onOpenChange={setShowFlushDialog}>
        <AlertDialogContent className="sm:max-w-md max-w-[95vw] p-4 sm:p-6 overflow-hidden">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base sm:text-lg">Confirm Flush All Registrations</AlertDialogTitle>
            <AlertDialogDescription className="text-sm sm:text-base">
              Are you sure you want to delete ALL registrations? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-2 sm:py-4">
            <p className="text-sm font-semibold text-destructive sm:text-base">
              This will permanently delete all {registrations.length} registrations.
            </p>
          </div>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
            <AlertDialogCancel className="mt-0 text-sm sm:text-base">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={flushAllRegistrations}
              className="bg-destructive text-sm hover:bg-destructive/90 sm:text-base"
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Registration Details Dialog */}
      <AlertDialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <AlertDialogContent className="sm:max-w-3xl max-w-[95vw] w-auto h-auto max-h-[90vh] p-4 sm:p-6 overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base sm:text-lg">Registration Details</AlertDialogTitle>
          </AlertDialogHeader>
          {selectedRegistration && (
            <div className="space-y-4 text-sm sm:space-y-6 sm:text-base">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="mb-1 text-base font-semibold sm:mb-2 sm:text-lg">Event Information</h3>
                  <div className="space-y-1 sm:space-y-2">
                    <p><strong>Event ID:</strong> {selectedRegistration.eventId}</p>
                    <p><strong>Event Name:</strong> {selectedRegistration.eventName}</p>
                    <p><strong>Registration Date:</strong> {formatDate(selectedRegistration.registrationDate)}</p>
                    <p><strong>Team Event:</strong> {selectedRegistration.isTeamEvent ? 'Yes' : 'No'}</p>
                    {selectedRegistration.isTeamEvent && selectedRegistration.teamName && (
                      <p><strong>Team Name:</strong> {selectedRegistration.teamName}</p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="mb-1 text-base font-semibold sm:mb-2 sm:text-lg">Main Participant</h3>
                  <div className="space-y-1 sm:space-y-2">
                    <p><strong>Name:</strong> {selectedRegistration.mainParticipant.name}</p>
                    <p className="break-words"><strong>Email:</strong> {selectedRegistration.mainParticipant.email}</p>
                    <p><strong>Phone:</strong> {selectedRegistration.mainParticipant.phone}</p>
                    <p><strong>College:</strong> {selectedRegistration.mainParticipant.college}</p>
                    {selectedRegistration.mainParticipant.otherCollege && (
                      <p><strong>Other College:</strong> {selectedRegistration.mainParticipant.otherCollege}</p>
                    )}
                  </div>
                </div>
              </div>

              {selectedRegistration.teamMembers?.length > 0 && (
                <div>
                  <h3 className="mb-1 text-base font-semibold sm:mb-2 sm:text-lg">Team Members</h3>

                  {/* Mobile view - Card style layout */}
                  <div className="sm:hidden">
                    {selectedRegistration.teamMembers.map((member, index) => (
                      <TeamMemberMobileCard key={index} member={member} index={index} />
                    ))}
                  </div>

                  {/* Desktop view - Table */}
                  <div className="hidden sm:block">
                    <div className="w-full">
                      <Table className="table-fixed">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-1/4">Name</TableHead>
                            <TableHead className="w-1/3">Email</TableHead>
                            <TableHead className="w-1/6">Phone</TableHead>
                            <TableHead className="w-1/4">College</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedRegistration.teamMembers.map((member, index) => (
                            <TableRow key={index}>
                              <TableCell className="truncate">{member.name}</TableCell>
                              <TableCell className="break-words">{member.email}</TableCell>
                              <TableCell className="truncate">{member.phone}</TableCell>
                              <TableCell className="truncate">{member.college}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              )}

              {selectedRegistration.query && (
                <div>
                  <h3 className="mb-1 text-base font-semibold sm:mb-2 sm:text-lg">Query</h3>
                  <p className="break-words">{selectedRegistration.query}</p>
                </div>
              )}

              {selectedRegistration.collegeIdUrl && (
                <div>
                  <h3 className="mb-1 text-base font-semibold sm:mb-2 sm:text-lg">College ID</h3>
                  <div className="rounded-md border p-2">
                    <a
                      href={selectedRegistration.collegeIdUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:underline"
                    >
                      <span>View College ID</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel className="w-full text-sm sm:w-auto sm:text-base">Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}