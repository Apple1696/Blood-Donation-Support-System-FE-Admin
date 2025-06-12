"use client"

import React from "react"
import { DonationTable } from "@/components/donation-table"
import ViewDonationDialog from "@/components/dialog/ViewDonationDialog"
import UpdateStatusDialog from "@/components/dialog/UpdateStatusDialog"

export default function Donation() {
  const [viewOpen, setViewOpen] = React.useState(false)
  const [updateOpen, setUpdateOpen] = React.useState(false)
  const [selectedId] = React.useState("")

  return (
    <div className="p-6">
      <DonationTable />
      <ViewDonationDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        donationId={selectedId}
      />
      <UpdateStatusDialog
        open={updateOpen}
        onOpenChange={setUpdateOpen}
        donationId={selectedId}
      />
    </div>
  )
}