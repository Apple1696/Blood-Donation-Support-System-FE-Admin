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
  MoreVerticalIcon,
} from "lucide-react"
import { Toaster } from "@/components/ui/sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { useNavigate } from "react-router-dom"
import {
  useGetCampaigns,
} from "../../services/campaign"

interface Campaign {
  id: string
  name: string
  description?: string
  startDate: string
  endDate?: string
  status: string
  banner: string
  location: string
  limitDonation: number
}

const columns: ColumnDef<Campaign>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => new Date(row.getValue("startDate")).toLocaleDateString(),
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => row.getValue("endDate") ? new Date(row.getValue("endDate")).toLocaleDateString() : "N/A",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string

      const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
          case "active":
            return "bg-green-100 text-green-700"
          case "inactive":
            return "bg-yellow-100 text-yellow-700"
          case "completed":
            return "bg-blue-100 text-blue-700"
          case "cancelled":
            return "bg-red-100 text-red-700"
          default:
            return "bg-gray-100 text-gray-700"
        }
      }

      return (
        <Badge className={getStatusColor(status)}>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "banner",
    header: "Banner",
    cell: ({ row }) => (
      <a href={row.getValue("banner")} target="_blank" rel="noopener noreferrer">
        View Banner
      </a>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "limitDonation",
    header: "Limit Donation",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CampaignActions campaign={row.original} />,
  },
]

interface CampaignActionsProps {
  campaign: Campaign
}

function CampaignActions({ campaign }: CampaignActionsProps) {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreVerticalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => navigate(`/staff/campaign/${campaign.id}/donation-requests`)}>
          View Donation Requests
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function StaffCampaignList() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data, isLoading, error } = useGetCampaigns(
    Number(pagination.pageIndex) + 1,
    Number(pagination.pageSize)
  )

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
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="w-full p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">View Campaign for Update Blood Unit</h1>
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
                  No campaigns found.
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
    </div>
  )
}