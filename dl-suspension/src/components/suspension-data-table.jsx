"use client";

import React, { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useSelector } from "react-redux";
import { decrypt } from "@/utils/crypto";
import { useEffect } from "react";
import { serviceUrl } from "@/app/constant";
import Loading from "@/app/dl-suspensions/loading";



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
    accessorKey: "ChallanStatus",
    header: () => <div className="text-left text-white">Status</div>,
    cell: ({ row }) => (
      <div className="text-left">
        <Badge
          className={`${
            row.getValue("ChallanStatus") == "Pending"
              ? "bg-yellow-200"
              : row.getValue("ChallanStatus") == "Processed"
              ? "bg-emerald-200"
              : row.getValue("ChallanStatus") == "Online"
              ? "bg-sky-200"
              : row.getValue("ChallanStatus") == "Failed"
              ? "bg-red-200"
              : "bg-slate-200"
          } text-slate-500 hover:text-white rounded-full`}
        >
          {row.getValue("ChallanStatus")}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "ChallanNumber",
    header: () => <div className="text-left text-white">Challan Number</div>,
    cell: ({ row }) => {
      const ChallanNumber = row.getValue("ChallanNumber"); // Retrieve the text value
      return <div className="text-left font-medium">{ChallanNumber}</div>;
    },
  },
  {
    accessorKey: "AccusedName",
    header: () => <div className="text-left text-white">Full Name</div>,
    cell: ({ row }) => {
      const AccusedName = row.getValue("AccusedName"); // Retrieve the text value
      return <div className="text-left font-medium">{AccusedName}</div>;
    },
  },
  {
    accessorKey: "DLNumber",
    header: () => <div className="text-left text-white">DL Number</div>,
    cell: ({ row }) => {
      const dlNumber = row.getValue("DLNumber");
      return <div className="text-left">{dlNumber}</div>;
    },
  },
  {
    accessorKey: "VehicleNumber",
    header: () => <div className="text-left text-white">Vehicle Number</div>,
    cell: ({ row }) => {
      const vehicleNumber = row.getValue("VehicleNumber");
      return <div className="text-left">{vehicleNumber}</div>;
    },
  },
  {
    accessorKey: "ContactNumber",
    header: () => <div className="text-left text-white">Contact Number</div>,
    cell: ({ row }) => {
      const contactNumber = row.getValue("ContactNumber");
      return <div className="text-left">{contactNumber}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const ChallanNumber = row.getValue("ChallanNumber");

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
              <Link href={`/user-details/${ChallanNumber}`}>View Details</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/user-details/${ChallanNumber}`}> Online Hearing </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/user-details/${ChallanNumber}`}>
                {" "}
                Offline Hearing{" "}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/user-details/${ChallanNumber}`}>
                {" "}
                Process without Hearing{" "}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function DataTableDemo() {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const authToken = useSelector((state) => state.auth.token);
  const [token, setToken] = useState(null);
  const userDetails = useSelector((state) => state.auth.user);
  const [user, setUser] = useState(null);
  const [apiData, setApiData] = useState([]);

  useEffect(() => {
    const parse_token = decrypt(authToken);
    setToken(parse_token);
    setTimeout(() => {
      token && dlSuspensionRecommendedUser();
    }, 3000);
    

    const user_data = JSON.parse(decrypt(userDetails));
    setUser(user_data);
  }, [token,userDetails]);
  console.log(token);
  console.log(user);

  async function dlSuspensionRecommendedUser() {
  
    try {
      setApiData([]);
      const myHeaders = new Headers();
      console.log("token: ", token);
      myHeaders.append("Authorization", `Bearer ${token}`);
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      await fetch(
        `${serviceUrl}get-dl-suspension-recommendation-details?RTOCode=WB-07&ChallanNumber=0&DLStatus=0`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          console.log(result.data);
          setApiData(result.data || []);
          
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
  });

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">DL Recommended Suspensions</h1>
      
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter challan no..."
          value={table.getColumn("ChallanNumber")?.getFilterValue() || ""}
          onChange={(event) =>
            table.getColumn("ChallanNumber")?.setFilterValue(event.target.value)
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
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
      {apiData.length == 0 ? <Loading /> : (
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
                  );
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
        )}
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
  );
}
export default DataTableDemo;
