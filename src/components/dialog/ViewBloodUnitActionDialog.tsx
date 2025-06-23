"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useGetBloodUnitActionById } from "../../services/inventory"
import { StaffProfileService } from "../../services/staffProfile"
import { useQuery } from '@tanstack/react-query'

interface ViewBloodUnitActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actionId: string;
}

export function ViewBloodUnitActionDialog({ open, onOpenChange, actionId }: ViewBloodUnitActionDialogProps) {
  const { data, isLoading, error } = useGetBloodUnitActionById(actionId);

  const getCurrentStaffProfile = () => {
    return useQuery({
      queryKey: ['currentStaffProfile'],
      queryFn: () => StaffProfileService.getProfile(),
    });
  };

  const { data: staffProfile } = getCurrentStaffProfile();

  const getActionDisplay = (action: string) => {
    return action === "status_update" ? "Status Update" : "Volume Change";
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Action Details</DialogTitle>
          </DialogHeader>
          <div>Loading...</div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !data?.success || !data?.data) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Action Details</DialogTitle>
          </DialogHeader>
          <div>Error: {error?.message || "Failed to load action details"}</div>
        </DialogContent>
      </Dialog>
    );
  }

  const action = data.data;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Action Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Staff</label>
            <p className="text-sm text-gray-900">{staffProfile?.firstName || `${action.staff.firstName} ${action.staff.lastName}`}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Action</label>
            <p className="text-sm text-gray-900">{getActionDisplay(action.action)}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <p className="text-sm text-gray-900">{action.description}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Previous Value</label>
            <p className="text-sm text-gray-900">{action.previousValue}</p>
          </div>
          <div>
            <label className="text-sm font-medium">New Value</label>
            <p className="text-sm text-gray-900">{action.newValue}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Created At</label>
            <p className="text-sm text-gray-900">
              {new Date(action.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium">Updated At</label>
            <p className="text-sm text-gray-900">
              {new Date(action.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}