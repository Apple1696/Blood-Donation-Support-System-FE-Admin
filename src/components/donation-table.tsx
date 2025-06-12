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
import DonationService from "@/services/donations"
import ViewDonationDialog from "@/components/dialog/ViewDonationDialog"
import UpdateStatusDialog from "@/components/dialog/UpdateStatusDialog"

interface Donor {
  id: string
  firstName: string
  lastName: string
}

interface Campaign {
  id: string
  name: string
}

interface Donation {
  id: string
  donor: Donor
  campaign: Campaign
  amount: number
  note: string
  appointmentDate: string
  currentStatus: string
  createdAt: string
  updatedAt: string
}

const columns: ColumnDef<Donation>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "campaign.id",
    header: "Campaign ID",
    cell: ({ row }) => row.original.campaign.id,
  },
  {
    accessorKey: "donor.id",
    header: "Donor ID",
    cell: ({ row }) => row.original.donor.id,
  },
  {
    accessorKey: "currentStatus",
    header: "Status",
  },
  {
    accessorKey: "note",
    header: "Result ID", // Note: 'result_id' is not in DonationRequest, using 'note' as a placeholder
    cell: ({ row }) => row.original.note || "N/A",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString(),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => new Date(row.getValue("updatedAt")).toLocaleDateString(),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const [openView, setOpenView] = React.useState(false)
      const [openUpdate, setOpenUpdate] = React.useState(false)
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
              <DropdownMenuItem onClick={() => setOpenView(true)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOpenUpdate(true)}>
                Update Status
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ViewDonationDialog
            open={openView}
            onOpenChange={setOpenView}
            donationId={row.original.id}
          />
          <UpdateStatusDialog
            open={openUpdate}
            onOpenChange={setOpenUpdate}
            donationId={row.original.id}
          />
        </>
      )
    },
  },
]

export function DonationTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [data, setData] = React.useState<Donation[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchData() {
      try {
        const result = await DonationService.getDonationRequests()
        setData(result.data)
      } catch (error) {
        console.error("Failed to fetch donation requests:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const table = useReactTable({
    data,
    columns,
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
  })

  if (loading) return <div>Loading...</div>

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
    </div>
  )
}