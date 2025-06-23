"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useGetDonationRequestById } from "@/services/donations"

interface ViewDonationDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  donationId: string
}

export default function ViewDonationDetail({ open, onOpenChange, donationId }: ViewDonationDetailProps) {
  const { data, isLoading, error } = useGetDonationRequestById(donationId)

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      case "completed":
        return "bg-green-100 text-green-700"
      case "rejected":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Donation Request Details</DialogTitle>
          </DialogHeader>
          <div>Loading...</div>
        </DialogContent>
      </Dialog>
    )
  }

  if (error || !data) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Donation Request Details</DialogTitle>
          </DialogHeader>
          <div>Error: {error?.message || "Failed to load donation request details"}</div>
        </DialogContent>
      </Dialog>
    )
  }

  const donation = data

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Donation Request Details</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Campaign</label>
              <p className="text-sm text-gray-900">{donation.campaign?.name || "Unknown"}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <p className="text-sm text-gray-900">{donation.campaign?.description || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Start Date</label>
              <p className="text-sm text-gray-900">
                {donation.campaign?.startDate ? new Date(donation.campaign.startDate).toLocaleDateString() : "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">End Date</label>
              <p className="text-sm text-gray-900">
                {donation.campaign?.endDate ? new Date(donation.campaign.endDate).toLocaleDateString() : "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <p className="text-sm text-gray-900">
                <Badge className={getStatusColor(donation.currentStatus)}>
                  {donation.currentStatus}
                </Badge>
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Appointment Date</label>
              <p className="text-sm text-gray-900">
                {donation.appointmentDate ? new Date(donation.appointmentDate).toLocaleDateString() : "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Created At</label>
              <p className="text-sm text-gray-900">
                {new Date(donation.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Donor</label>
              <p className="text-sm text-gray-900">
                {donation.donor?.firstName || "Unknown"} {donation.donor?.lastName || ""}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Blood Type</label>
              <p className="text-sm text-gray-900">
                {donation.donor?.bloodType?.group || "N/A"}{donation.donor?.bloodType?.rh || ""}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <p className="text-sm text-gray-900">{donation.donor?.phone || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Location</label>
              <p className="text-sm text-gray-900">{donation.campaign?.location || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Ward</label>
              <p className="text-sm text-gray-900">{donation.donor?.wardName || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium">District</label>
              <p className="text-sm text-gray-900">{donation.donor?.districtName || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Province</label>
              <p className="text-sm text-gray-900">{donation.donor?.provinceName || "N/A"}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}