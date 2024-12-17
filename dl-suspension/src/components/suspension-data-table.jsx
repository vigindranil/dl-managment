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
import Loading from "@/app/dl-suspensions/[type]/loading";

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
    accessorKey: "ChallanStatusID",
    header: () => <div className="text-left text-white">Status</div>,
    cell: ({ row }) => {
      const status = row.getValue("ChallanStatusID");

      // Mapping numeric IDs to status labels
      const statusLabels = {
        1: "Pending",
        2: "Offline",
        3: "Online",
        4: "Processed",
      };

      return (
        <div className="text-left">
          <Badge
            className={`${
              status == "1"
                ? "bg-yellow-200"
                : status == "4"
                ? "bg-emerald-200"
                : status == "3"
                ? "bg-sky-200"
                : status == "2"
                ? "bg-red-200"
                : "bg-slate-200"
            } text-slate-500 hover:text-white rounded-full`}
          >
            {statusLabels[status] || "Unknown"}
          </Badge>
        </div>
      );
    },
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
      const DlNumber = row.getValue("DLNumber");

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
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/user-details/${ChallanNumber}/${DlNumber}`}>
                View Details
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function DataTableDemo({ type }) {
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
    token && dlSuspensionRecommendedUser();

    const user_data = JSON.parse(decrypt(userDetails));
    setUser(user_data);
  }, [token, userDetails]);
  console.log("hi 2", apiData);

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
      const response = await fetch(
        `${serviceUrl}get-dl-suspension-recommendation-details?RTOCode=41&ChallanNumber=0&DLStatus=${type}`,
        requestOptions
      );

      const result = await response.json();
      result?.data && result?.data?.length == 0
        ? setApiData("")
        : setApiData(result.data);
      console.log("hi", result.data);
    } catch (error) {
      console.error(error.message);
      setApiData(null);
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
      <h1 className="text-2xl font-bold mb-6">
        {type == 1
          ? "DL Recommended Suspensions"
          : type == 2
          ? "Offline Hearing"
          : type == 3
          ? "Online Hearing"
          : type == 4
          ? "Processed Hearing"
          : "DL Recommended Suspensions"}
      </h1>

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
        {apiData === "" ? (
          // Case: apiData is null -> Show "No Data Found"
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
              <TableRow>
                <TableCell colSpan="100%" className="h-24 text-center">
                  No Data Found.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ) : apiData && apiData?.length === 0 ? (
          // Case: apiData is an empty array -> Show Loader
          <Loading />
        ) : (
          // Case: apiData has data -> Show Table with Data
          <Table>
            <TableHeader className="bg-primary text-white">
              {table?.getHeaderGroups()?.map((headerGroup) => (
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
              {table?.getRowModel()?.rows &&
                table?.getRowModel()?.rows?.length > 0 &&
                table?.getRowModel()?.rows?.map((row) => (
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
                ))}
            </TableBody>
          </Table>
        )}
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table?.getFilteredSelectedRowModel()?.rows &&
            table?.getFilteredSelectedRowModel()?.rows?.length}{" "}
          of{" "}
          {table?.getFilteredRowModel()?.rows &&
            table?.getFilteredRowModel()?.rows?.length}{" "}
          row(s) selected.
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
