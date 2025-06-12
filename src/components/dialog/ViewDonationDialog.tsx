"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import DonationService from "@/services/donations"

interface ViewDonationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  donationId: string
}

const formSchema = z.object({
  id: z.string(),
  donorFirstName: z.string(),
  donorLastName: z.string(),
  campaignName: z.string(),
  amount: z.number(),
  note: z.string(),
  appointmentDate: z.string(),
  currentStatus: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export default function ViewDonationDialog({ open, onOpenChange, donationId }: ViewDonationDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      donorFirstName: "",
      donorLastName: "",
      campaignName: "",
      amount: 0,
      note: "",
      appointmentDate: "",
      currentStatus: "",
      createdAt: "",
      updatedAt: "",
    },
  })

  React.useEffect(() => {
    async function fetchDonation() {
      try {
        const data = await DonationService.getDonationRequestById(donationId)
        form.reset({
          id: data.id,
          donorFirstName: data.donor.firstName,
          donorLastName: data.donor.lastName,
          campaignName: data.campaign.name,
          amount: data.amount,
          note: data.note,
          appointmentDate: data.appointmentDate,
          currentStatus: data.currentStatus,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        })
      } catch (error) {
        toast.error("Failed to fetch donation details")
      }
    }
    if (open && donationId) fetchDonation()
  }, [open, donationId, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>View Donation Details</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="donorFirstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Donor First Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="donorLastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Donor Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="campaignName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input {...field} disabled type="number" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Textarea {...field} disabled />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="appointmentDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Appointment Date</FormLabel>
                  <FormControl>
                    <Input {...field} disabled type="date" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="createdAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Created At</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="updatedAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Updated At</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="button" onClick={() => onOpenChange(false)}>Close</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}