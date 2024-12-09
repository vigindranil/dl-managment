"use client"

import React, { useState } from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const data = [
    {
        id: "m5gr84i9",
        name: "Abhijit Basu",
        status: "pending",
        challan_no: 8669869,
        dl_number: "DL1234567890",
        vehicle_number: "WB01A1234",
        contact_number: "9876543210",
      },
      {
        id: "3u1reuv4",
        name: "Pallab Rudra",
        status: "processed",
        challan_no: 7858756,
        dl_number: "DL0987654321",
        vehicle_number: "WB02B5678",
        contact_number: "9123456780",
      },
      {
        id: "derv1ws0",
        name: "Akash Singh",
        status: "offline",
        challan_no: 76767879,
        dl_number: "DL5678901234",
        vehicle_number: "KA03C9012",
        contact_number: "9876501234",
      },
      {
        id: "5kma53ae",
        name: "Millen",
        status: "online",
        challan_no: 395435438,
        dl_number: "DL6789012345",
        vehicle_number: "MH04D3456",
        contact_number: "9123451234",
      },
      {
        id: "bhqecj4p",
        name: "Aziza",
        status: "failed",
        challan_no: 758678787,
        dl_number: "DL1234560987",
        vehicle_number: "TN05E7890",
        contact_number: "9001234567",
      },
]

export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
      className="text-white border-white"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: () => <div className="text-left text-white">Status</div>,
    cell: ({ row }) => (
      <div className="text-left"><Badge className={`${row.getValue("status") == 'pending' ? 'bg-yellow-200'  : row.getValue("status") == 'processed' ? 'bg-emerald-200' : row.getValue("status") == 'online' ? 'bg-sky-200' : row.getValue("status") == 'failed' ? 'bg-red-200' : 'bg-slate-200'} text-slate-500 hover:text-white rounded-full`}>{row.getValue("status")}</Badge></div>
    ),
  },
  {
    accessorKey: "challan_no",
    header: () => <div className="text-left text-white">Challan Number</div>,
    cell: ({ row }) => {
      const challan_no = row.getValue("challan_no"); // Retrieve the text value
      return <div className="text-left font-medium">{challan_no}</div>;
    },    
  },
  {
    accessorKey: "name",
    header: () => <div className="text-left text-white">Full Name</div>,
    cell: ({ row }) => {
      const name = row.getValue("name"); // Retrieve the text value
      return <div className="text-left font-medium">{name}</div>;
    },    
  },
  {
    accessorKey: "dl_number",
    header: () => <div className="text-left text-white">DL Number</div>,
    cell: ({ row }) => {
      const dlNumber = row.getValue("dl_number")
      return <div className="text-left">{dlNumber}</div>
    },
  },
  {
    accessorKey: "vehicle_number",
    header: () => <div className="text-left text-white">Vehicle Number</div>,
    cell: ({ row }) => {
      const vehicleNumber = row.getValue("vehicle_number")
      return <div className="text-left">{vehicleNumber}</div>
    },
  },
  {
    accessorKey: "contact_number",
    header: () => <div className="text-left text-white">Contact Number</div>,
    cell: ({ row }) => {
      const contactNumber = row.getValue("contact_number")
      return <div className="text-left">{contactNumber}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const challan_no = row.getValue("challan_no")

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Link href={`/user-details/${challan_no}`}>
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Online Hearing</DropdownMenuItem>
            <DropdownMenuItem>Offline Hearing</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

function RTODataTable() {
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">DL Recommended Suspensions</h1>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter challan no..."
          value={table.getColumn("challan_no")?.getFilterValue() || ""}
          onChange={(event) =>
            table.getColumn("challan_no")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-primary text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="hover:bg-muted"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
export default RTODataTable;