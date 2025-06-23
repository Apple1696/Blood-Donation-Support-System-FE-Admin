"use client"

import * as React from "react"
import {
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react"
import { useParams } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  useGetDonationRequests,
} from "../../services/campaign"
import CreateBloodUnitDialog from "@/components/dialog/CreateBloodUnitDialog"

interface DonationRequest {
  id: string;
  donor: {
    id: string;
    firstName: string;
    lastName: string;
  };
  campaign: {
    id: string;
    name: string;
  };
  amount: number;
  note: string;
  appointmentDate: string;
  currentStatus: "pending" | "completed" | "failed";
  createdAt: string;
  updatedAt: string;
}

const columns: ColumnDef<DonationRequest>[] = [
  {
    accessorKey: "donor.firstName",
    header: "Donor First Name",
    cell: ({ row }) => row.original.donor.firstName,
  },
  {
    accessorKey: "donor.lastName",
    header: "Donor Last Name",
    cell: ({ row }) => row.original.donor.lastName,
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "note",
    header: "Note",
  },
  {
    accessorKey: "appointmentDate",
    header: "Appointment Date",
    cell: ({ row }) => new Date(row.getValue("appointmentDate")).toLocaleDateString(),
  },
  {
    accessorKey: "currentStatus",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("currentStatus") as string;

      const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
          case "pending":
            return "bg-yellow-100 text-yellow-700";
          case "completed":
            return "bg-green-100 text-green-700";
          case "failed":
            return "bg-red-100 text-red-700";
          default:
            return "bg-gray-100 text-gray-700";
        }
      };

      return (
        <Badge className={getStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString(),
  },
];

export default function DonationRequestList() {
  const { id } = useParams<{ id: string }>();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const { data, isLoading, error } = useGetDonationRequests(
    id || "",
    undefined,
    Number(pagination.pageSize),
    Number(pagination.pageIndex) + 1
  );

  const table = useReactTable({
    data: data?.data.data || [],
    columns,
    state: {
      sorting,
      columnVisibility,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => row.id,
    manualPagination: true,
    pageCount: data?.data.meta.totalPages,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const memberId = data?.data.data[0]?.donor.id || "";
  const memberName = `${data?.data.data[0]?.donor.firstName} ${data?.data.data[0]?.donor.lastName}` || "";

  return (
    <div className="w-full p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Donation Requests for Campaign</h1>
        <Button onClick={() => setIsDialogOpen(true)}>Create Blood Unit</Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No donation requests found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Toaster />
      <CreateBloodUnitDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        memberId={memberId}
        memberName={memberName}
      />
    </div>
  );
}