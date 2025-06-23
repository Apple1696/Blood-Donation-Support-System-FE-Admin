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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { useUpdateCampaign } from "../../services/campaign"

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  banner: z.string().url("Invalid URL format"),
  location: z.string().min(1, "Location is required"),
  limitDonation: z.number().min(1, "Limit donation must be at least 1"),
  status: z.enum(["active", "not_started", "ended"], {
    errorMap: () => ({ message: "Status must be Active, Not Started, or Ended" }),
  }),
})

interface EditCampaignDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  campaign: {
    id: string
    name: string
    description?: string
    startDate: string
    endDate?: string
    banner: string
    location: string
    limitDonation: number
    status: string
  }
}

export function EditCampaignDialog({ open, onOpenChange, campaign }: EditCampaignDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: campaign.name,
      description: campaign.description || "",
      startDate: campaign.startDate.split('T')[0],
      endDate: campaign.endDate?.split('T')[0] || "",
      banner: campaign.banner,
      location: campaign.location,
      limitDonation: campaign.limitDonation,
      status: (["active", "not_started", "ended"].includes(campaign.status) ? campaign.status : undefined) as "active" | "not_started" | "ended" | undefined,
    },
  })

  const updateMutation = useUpdateCampaign()

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateMutation.mutateAsync({ id: campaign.id, payload: values })
      toast.success("Campaign updated successfully")
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to update campaign")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Campaign</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="not_started">Not Started</SelectItem>
                      <SelectItem value="ended">Ended</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="banner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banner URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="limitDonation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Limit Donation</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="col-span-2">Update Campaign</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}