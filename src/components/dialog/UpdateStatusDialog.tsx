"use client"

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
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import DonationService from "@/services/donations"

interface UpdateStatusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  donationId: string
}

const formSchema = z.object({
  status: z.enum(["pending", "completed", "failed"], { required_error: "Status is required" }),
  appointmentDate: z.string().optional(),
  note: z.string().optional(),
})

export default function UpdateStatusDialog({ open, onOpenChange, donationId }: UpdateStatusDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "pending",
      appointmentDate: "",
      note: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await DonationService.updateDonationRequestStatus(donationId, values)
      toast.success("Status updated successfully")
      onOpenChange(false)
      window.location.reload()
    } catch (error) {
      toast.error("Failed to update status")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Donation Status</DialogTitle>
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
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                    </select>
                  </FormControl>
                  <FormMessage />
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
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
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