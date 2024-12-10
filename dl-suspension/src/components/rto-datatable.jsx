"use client"

import React, { useEffect, useState } from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, CookingPot, MoreHorizontal, Trash2, UserRoundPen, UserRoundPenIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useSelector } from "react-redux";
import { decrypt } from "@/utils/crypto";

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
import { serviceUrl } from "@/app/constant"

const data = [
  {
    id: "m5gr84i9",
    name: "Abhijit Basu",
    status: "pending",
    Username: 8669869,
    dl_number: "DL1234567890",
    vehicle_number: "WB01A1234",
    contact_number: "9876543210",
  },
  {
    id: "3u1reuv4",
    name: "Pallab Rudra",
    status: "processed",
    Username: 7858756,
    dl_number: "DL0987654321",
    vehicle_number: "WB02B5678",
    contact_number: "9123456780",
  },
  {
    id: "derv1ws0",
    name: "Akash Singh",
    status: "offline",
    Username: 76767879,
    dl_number: "DL5678901234",
    vehicle_number: "KA03C9012",
    contact_number: "9876501234",
  },
  {
    id: "5kma53ae",
    name: "Millen",
    status: "online",
    Username: 395435438,
    dl_number: "DL6789012345",
    vehicle_number: "MH04D3456",
    contact_number: "9123451234",
  },
  {
    id: "bhqecj4p",
    name: "Aziza",
    status: "failed",
    Username: 758678787,
    dl_number: "DL1234560987",
    vehicle_number: "TN05E7890",
    contact_number: "9001234567",
  },
]

export const columns = [
  {
    accessorKey: "Username",
    header: () => <div className="text-left text-white">Username</div>,
    cell: ({ row }) => {
      const Username = row.getValue("Username"); // Retrieve the text value
      return <div className="text-left font-medium">{Username}</div>;
    },
  },
  {
    accessorKey: "FullName",
    header: () => <div className="text-left text-white">Full Name</div>,
    cell: ({ row }) => {
      const FullName = row.getValue("FullName"); // Retrieve the text value
      return <div className="text-left font-medium">{FullName}</div>;
    },
  },
  {
    accessorKey: "UserPassword",
    header: () => <div className="text-left text-white">User Password</div>,
    cell: ({ row }) => {
      const UserPassword = row.getValue("UserPassword")
      return <div className="text-left">{UserPassword}</div>
    },
  },
  {
    accessorKey: "ContactNo",
    header: () => <div className="text-left text-white">Contact No.</div>,
    cell: ({ row }) => {
      const ContactNo = row.getValue("ContactNo")
      return <div className="text-left">{ContactNo}</div>
    },
  },
  {
    accessorKey: "Action",
    header: () => <div className="text-left text-white">Action</div>,
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const Username = row.getValue("Username")

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
              <Link href={`#`} className="text-yellow-500 font-bold">

                <UserRoundPen className="inline w-4 h-4 stroke-[3]" /> Edit 
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-800 font-bold"><Trash2 className="inline w-4 h-4 stroke-[3]" /> Delete</DropdownMenuItem>
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
  const authToken = useSelector((state) => state.auth.token);
  const [token, setToken] = useState(null);
  const [apiData, setApiData] = useState([]);

  useEffect(() => {
    const parse_token = decrypt(authToken);
    setToken(parse_token);
    token && getRTOUsers();
  }, [token]);
  async function getRTOUsers() {
    try {
        const myHeaders = new Headers();
        console.log("token: ", token);
        myHeaders.append("Authorization", `Bearer ${token}`);
        const requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow"
        };
        await fetch(`${serviceUrl}get-rto-user-details?UserID=0`, requestOptions)
          .then((response) => response.json())
          .then((result) => {console.log(result.data)
            setApiData(result.data);
          })
          .catch((error) => console.error(error));
    } catch (error) {
      console.log(error.message);
    }
  }
  const table = useReactTable({
    data: apiData,
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
      <h1 className="text-2xl font-bold mb-6">RTO Users</h1>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter Username, Fullname, Contact No..."
          value={table.getColumn("Username")?.getFilterValue() || ""}
          onChange={(event) =>
            table.getColumn("Username")?.setFilterValue(event.target.value)
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