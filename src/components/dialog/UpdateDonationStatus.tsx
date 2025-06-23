"use client"

import { useForm } from "react-hook-form"
import { useEffect } from "react"
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
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useGetDonationRequestById, useUpdateDonationStatus } from "@/services/donations"

interface UpdateDonationRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  donationId: string
}

const formSchema = z.object({
  status: z.enum(["completed", "rejected"], { required_error: "Status is required" }),
  appointmentDate: z.string().optional(),
  note: z.string().optional(),
})

export default function UpdateDonationRequestDialog({
  open,
  onOpenChange,
  donationId,
}: UpdateDonationRequestDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "completed",
      appointmentDate: "",
      note: "",
    },
  })

  const { data: donationData } = useGetDonationRequestById(donationId)
  const { mutate } = useUpdateDonationStatus()

  useEffect(() => {
    if (donationData) {
      form.reset({
        status: "completed",
        appointmentDate: donationData.appointmentDate,
        note: "",
      })
    }
  }, [donationData, form])

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate(
      { id: donationId, statusData: values },
      {
        onSuccess: () => {
          toast.success("Status updated successfully")
          onOpenChange(false)
          window.location.reload()
        },
        onError: () => {
          toast.error("Failed to update status")
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Donation Request Status</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <select {...field} className="w-full p-2 border rounded">
                      <option value="completed">Completed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Appointment Date - read-only display */}
            <FormItem>
              <FormLabel>Appointment Date</FormLabel>
              <div className="p-2 border rounded bg-gray-100 text-sm">
                {donationData?.appointmentDate
                  ? new Date(donationData.appointmentDate).toLocaleDateString()
                  : "N/A"}
              </div>
            </FormItem>

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Update Status</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
