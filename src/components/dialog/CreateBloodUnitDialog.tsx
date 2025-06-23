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
import { useCreateBloodUnit } from "../../services/inventory"
import { toast } from "sonner"

const formSchema = z.object({
  bloodGroup: z.string().min(1, { message: "Blood group is required" }),
  bloodRh: z.string().min(1, { message: "Blood Rh is required" }),
  bloodVolume: z.number().min(1, { message: "Blood volume must be greater than 0" }),
  remainingVolume: z.number().min(0, { message: "Remaining volume must be at least 0" }),
  expiredDate: z.string().min(1, { message: "Expired date is required" }),
  status: z.enum(["available", "used", "expired", "damaged"], { required_error: "Status is required" }),
});

interface CreateBloodUnitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberId: string;
  memberName: string;
}

export default function CreateBloodUnitDialog({ open, onOpenChange, memberId, memberName }: CreateBloodUnitDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bloodGroup: "",
      bloodRh: "",
      bloodVolume: 0,
      remainingVolume: 0,
      expiredDate: "",
      status: "available",
    },
  });

  const { mutate } = useCreateBloodUnit();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate(
      {
        memberId,
        bloodGroup: values.bloodGroup,
        bloodRh: values.bloodRh,
        bloodVolume: values.bloodVolume,
        remainingVolume: values.remainingVolume,
        expiredDate: values.expiredDate,
        status: values.status,
      },
      {
        onSuccess: () => {
          toast.success("Blood unit created successfully");
          onOpenChange(false);
          form.reset();
        },
        onError: () => {
          toast.error("Failed to create blood unit");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Blood Unit</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="bloodGroup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blood Group</FormLabel>
                  <FormControl>
                    <input {...field} className="w-full p-2 border rounded" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bloodRh"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blood Rh</FormLabel>
                  <FormControl>
                    <input {...field} className="w-full p-2 border rounded" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bloodVolume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blood Volume (ml)</FormLabel>
                  <FormControl>
                    <input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      className="w-full p-2 border rounded"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="remainingVolume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remaining Volume (ml)</FormLabel>
                  <FormControl>
                    <input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      className="w-full p-2 border rounded"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expiredDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expired Date</FormLabel>
                  <FormControl>
                    <input type="date" {...field} className="w-full p-2 border rounded" />
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
                  <FormControl>
                    <select {...field} className="w-full p-2 border rounded">
                      <option value="available">Available</option>
                      <option value="used">Used</option>
                      <option value="expired">Expired</option>
                      <option value="damaged">Damaged</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Member</FormLabel>
              <div className="p-2 border rounded bg-gray-100 text-sm">
                {memberName} (ID: {memberId})
              </div>
            </FormItem>
            <Button type="submit">Create Blood Unit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}