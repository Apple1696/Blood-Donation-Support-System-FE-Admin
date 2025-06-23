"use client"

import * as React from "react"
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  MoreVerticalIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useGetDonationRequests } from "@/services/donations"
import ViewDonationDetail from "@/components/dialog/ViewDonationDetail"
import UpdateDonationStatus from "@/components/dialog/UpdateDonationStatus"
import { type DonationRequest } from "@/services/donations"
import { Badge } from "@/components/ui/badge"

const getColumns = (meta?: {
  onView?: (id: string) => void
  onUpdate?: (id: string, date: string) => void
}): ColumnDef<DonationRequest>[] => [
    {
      accessorKey: "campaign.name",
      header: "Campaign",
      cell: ({ row }) => row.original.campaign.name,
    },
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
      accessorKey: "bloodType",
      header: "Blood Type",
      cell: ({ }) => "N/A", // Vì DonationRequest không có bloodType, nên hiện tạm "N/A"
    },
    {
      accessorKey: "currentStatus",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.currentStatus;
        const getStatusColor = (status: string) => {
          switch (status.toLowerCase()) {
            case "pending":
              return "bg-yellow-100 text-yellow-700";
            case "completed":
              return "bg-green-100 text-green-700";
            case "rejected":
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
      accessorKey: "appointmentDate",
      header: "Appointment Date",
      cell: ({ row }) =>
        row.original.appointmentDate
          ? new Date(row.original.appointmentDate).toLocaleDateString()
          : "N/A",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const [openView, setOpenView] = React.useState(false)
        const [openUpdate, setOpenUpdate] = React.useState(false)
        const donation = row.original

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreVerticalIcon className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setOpenView(true)
                    meta?.onView?.(donation.id)
                  }}
                >
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setOpenUpdate(true)
                    meta?.onUpdate?.(donation.id, donation.appointmentDate)
                  }}
                >
                  Update Status
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ViewDonationDetail
              open={openView}
              onOpenChange={setOpenView}
              donationId={donation.id}
            />
            <UpdateDonationStatus
              open={openUpdate}
              onOpenChange={setOpenUpdate}
              donationId={donation.id}
            />
          </>
        )
      },
    },
  ]


export function DonationTable({
  onView,
  onUpdate,
}: {
  onView?: (id: string) => void
  onUpdate?: (id: string, date: string) => void
}) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data, isLoading, error } = useGetDonationRequests()

  const table = useReactTable<DonationRequest>({
    data: data || [],
    columns: getColumns({ onView, onUpdate }),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => row.id,
    manualPagination: true,
    pageCount: Math.ceil((data?.length || 0) / pagination.pageSize),
  })

  if (isLoading) return <div>Loading...</div>
  if (error || !data) return <div>Error: {error?.message || "Failed to load donation requests"}</div>

  return (
    <div className="w-full p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Donation Request Management</h1>
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
              <SortableContext
                items={table.getRowModel().rows.map((row) => row.id)}
                strategy={verticalListSortingStrategy}
              >
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </SortableContext>
            ) : (
              <TableRow>
                <TableCell colSpan={table.getVisibleLeafColumns().length} className="h-24 text-center">
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
    </div>
  )
}