"use client";
import React, { useState, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useSelector } from "react-redux";
import { decrypt } from "@/utils/crypto";
import { serviceUrl } from "@/app/constant";
import Loading from "@/app/dl-suspensions/[type]/[range]/loading";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-range-picker";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { unparse } from "papaparse";
import * as XLSX from "xlsx";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Loader } from "lucide-react";

function MisReportTable() {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const authToken = useSelector((state) => state.auth.token);
  const [token, setToken] = useState(null);
  const userDetails = useSelector((state) => state.auth.user);
  const [user, setUser] = useState(null);
  const [apiData, setApiData] = useState("");
  const [status, setStatus] = useState("");
  const [isInvalidStatus, setIsInvalidStatus] = useState(false);
  const [loading, setLoading] = useState(false);

  const [fromDate, setFromDate] = useState("");
  const [isInvalidFromDate, setIsInvalidFromDate] = useState(false);

  const [toDate, setToDate] = useState("");
  const [isInvalidToDate, setIsInvalidToDate] = useState(false);
  const { toast } = useToast();

  const handleStatusChange = (value) => {
    setStatus(value);
    setIsInvalidStatus(!value); // Mark invalid if no value is selected
  };

  const handleFromDateChange = (date) => {
    if (date) {
      const formattedDate = new Date(date).toISOString().split("T")[0];
      setFromDate(formattedDate);

      if (toDate && new Date(date) > new Date(toDate)) {
        setToDate("");
        toast({
          variant: "destructive",
          title: "OPPS! ",
          description:
            "From Date cannot be later than To Date. Please adjust the dates.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    }
  };

  const handleToDateChange = (date) => {
    if (date) {
      const formattedDate = new Date(date).toISOString().split("T")[0];
      setToDate(formattedDate);

      if (fromDate && new Date(date) < new Date(fromDate)) {
        toast({
          variant: "destructive",
          title: "OPPS! ",
          description:
            "To Date cannot be earlier than From Date. Please adjust the dates.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
        setToDate(""); // Reset To Date
      }
    }
  };

  useEffect(() => {
    const parse_token = authToken;
    setToken(parse_token);
    // token && dlSuspensionRecommendedUser();
    // setApiData("");
    const user_data = JSON.parse(decrypt(userDetails));
    setUser(user_data);
  }, [userDetails, token]);

  async function dlSuspensionRecommendedUser() {
    setLoading(true);
    try {
      setApiData([]);
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      const response = await fetch(
        `${serviceUrl}get-dl-suspension-mis-report-details?RTOCode=${user?.RTOCode}&FromDate=${fromDate}&ToDate=${toDate}&DLStatus=${status}`,
        requestOptions
      );
      const result = await response.json();
      result?.data && result?.data?.length == 0
        ? setApiData("")
        : setApiData(result.data);
    } catch (error) {
      console.error(error.message);
      setApiData(null);
    } finally {
      setLoading(false);
    }
  }

  const exportToPDF = () => {
    const doc = new jsPDF();

    // Add a title
    doc.text(`MIS Report from ${fromDate} to ${toDate}`, 10, 10);
    doc.text(`RTO = ${user.RTOName}`, 10, 20);


    // Define table headers (including SL No)
    const headers = [
      [
        "SL No", // New SL No column
        "Status",
        "Challan Number",
        "Challan Date",
        "Vehicle Number",
        "Contact Number",
        "Accused Name",
        "Hearing Date",
        "DL Number",
      ],
    ];

    // Ensure apiData is an array
    const dataArray = Array.isArray(apiData) ? apiData : [];
    if (!dataArray.length) {
      toast({
        variant: "destructive",
        title: "Failed! ",
        description: "No data available to export.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      return;
    }

    // Map the data to match the headers, adding SL No
    const rows = dataArray.map((item, index) => [
      index + 1, // SL No starts from 1
      // Validate ChallanStatusID and show appropriate status
      item.ChallanStatusID === 1
        ? "Pending"
        : item.ChallanStatusID === 2
        ? "Offline"
        : item.ChallanStatusID === 3
        ? "Online"
        : item.ChallanStatusID === 4
        ? "Disposed"
        : "Unknown",
      item.ChallanNumber,
      // Format ChallanDate to local date string
      item.ChallanDate
        ? new Date(item.ChallanDate).toLocaleDateString("en-US")
        : "N/A",
      item.VehicleNumber,
      item.ContactNumber,
      item.AccusedName,
      // Format HearingDate to local date string
      item.HearingDate
        ? new Date(item.HearingDate).toLocaleDateString("en-US")
        : "N/A",
      item.DLNumber,
    ]);

    // Add data to PDF using autoTable
    doc.autoTable({
      head: headers,
      body: rows,
      startY: 30, // Start below the title
    });

    // Save the PDF
    doc.save(`mis_report_${fromDate}_to_${toDate}.pdf`);
  };

  const exportToCSV = () => {
    const headers = [
      "SL No",
      "Hearing Status",
      "Challan Number",
      "Challan Date",
      "Vehicle Number",
      "Contact Number",
      "Accused Name",
      "Hearing Date",
      "DL Number",
    ];
    const dataArray = Array.isArray(apiData) ? apiData : [];
    if (!dataArray.length) {
      toast({
        variant: "destructive",
        title: "Failed! ",
        description: "No data available to export.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      return;
    }

    const rows = dataArray.map((item, index) => [
      index + 1, // SL No
      item.ChallanStatusID === 1
        ? "Pending"
        : item.ChallanStatusID === 2
        ? "Offline"
        : item.ChallanStatusID === 3
        ? "Online"
        : item.ChallanStatusID === 4
        ? "Disposed"
        : "Unknown",
      item.ChallanNumber,
      item.ChallanDate
        ? new Date(item.ChallanDate).toLocaleDateString("en-US")
        : "N/A",
      item.VehicleNumber,
      item.ContactNumber,
      item.AccusedName,
      item.HearingDate
        ? new Date(item.HearingDate).toLocaleDateString("en-US")
        : "N/A",
      item.DLNumber,
    ]);

    const csv = unparse({
      fields: headers,
      data: rows,
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `mis_report_${fromDate}-${toDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    const headers = [
      "SL No",
      "Hearing Status",
      "Challan Number",
      "Challan Date",
      "Vehicle Number",
      "Contact Number",
      "Accused Name",
      "Hearing Date",
      "DL Number",
    ];

    const dataArray = Array.isArray(apiData) ? apiData : [];
    if (!dataArray.length) {
      toast({
        variant: "destructive",
        title: "Failed! ",
        description: "No data available to export.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      return;
    }
    const rows = dataArray.map((item, index) => ({
      "SL No": index + 1,
      "Hearing Status":
        item.ChallanStatusID === 1
          ? "Pending"
          : item.ChallanStatusID === 2
          ? "Offline"
          : item.ChallanStatusID === 3
          ? "Online"
          : item.ChallanStatusID === 4
          ? "Disposed"
          : "Unknown",
      "Challan Number": item.ChallanNumber,
      "Challan Date": item.ChallanDate
        ? new Date(item.ChallanDate).toLocaleDateString("en-US")
        : "N/A",
      "Vehicle Number": item.VehicleNumber,
      "Contact Number": item.ContactNumber,
      "Accused Name": item.AccusedName,
      "Hearing Date": item.HearingDate
        ? new Date(item.HearingDate).toLocaleDateString("en-US")
        : "N/A",
      "DL Number": item.DLNumber,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "MIS Report");

    XLSX.writeFile(workbook, `mis_report_${fromDate}-${toDate}.xlsx`);
  };

  const columns = [
    {
      accessorKey: "ChallanStatusID",
      header: () => <div className="text-left text-white">Status</div>,
      cell: ({ row }) => {
        const status = row.getValue("ChallanStatusID");
        const statusLabels = {
          1: "Pending",
          2: "Offline",
          3: "Online",
          4: "Disposed",
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
        const ChallanNumber = row.getValue("ChallanNumber");
        return <div className="text-left font-medium">{ChallanNumber}</div>;
      },
    },
    {
      accessorKey: "AccusedName",
      header: () => <div className="text-left text-white">Full Name</div>,
      cell: ({ row }) => {
        const AccusedName = row.getValue("AccusedName");
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
      accessorKey: "HearingDate",
      header: () => <div className="text-left text-white">Hearing Date</div>,
      cell: ({ row }) => {
        const rawDate = row.getValue("HearingDate");
        const formattedDate = new Date(rawDate).toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        return <div className="text-left">{formattedDate}</div>;
      },
    },
  ];

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
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-end gap-4">
            {/* Status Field */}
            <div className="w-full md:w-1/3 space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Status
              </Label>
              <Select
                onValueChange={handleStatusChange}
                className={isInvalidStatus ? "border-red-500" : ""}
              >
                <SelectTrigger id="status" className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">Online</SelectItem>
                  <SelectItem value="2">Offline</SelectItem>
                  {/* <SelectItem value="1">Pending</SelectItem>
                  <SelectItem value="4">Disposed</SelectItem> */}
                  <SelectItem value="0">All</SelectItem>
                </SelectContent>
              </Select>
              {isInvalidStatus && (
                <p className="text-red-500 text-sm">Please select a status.</p>
              )}
            </div>

            {/* From Date Field */}
            <div className="w-full md:w-1/3 space-y-2">
              <Label className="text-sm font-medium">From Date</Label>
              <DatePicker
                className={`w-full ${
                  isInvalidFromDate ? "border-red-500" : ""
                }`}
                onChange={(date) => handleFromDateChange(date)}
              />
              {isInvalidFromDate && (
                <p className="text-red-500 text-sm">Invalid date format.</p>
              )}
            </div>

            {/* To Date Field */}
            <div className="w-full md:w-1/3 space-y-2">
              <Label className="text-sm font-medium">To Date</Label>
              <DatePicker
                className={`w-full ${isInvalidToDate ? "border-red-500" : ""}`}
                onChange={(date) => handleToDateChange(date)}
              />
              {isInvalidToDate && (
                <p className="text-red-500 text-sm">Invalid date format.</p>
              )}
            </div>

            {/* Search Button */}
            <div className="w-full md:w-1/3 mt-6 md:mt-0">
              <Button
                className="w-full h-10"
                onClick={dlSuspensionRecommendedUser}
                disabled={loading || !status || !fromDate || !toDate}
              >
                {loading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Fetching...
                  </>
                ) : (
                  "Search"
                )}
                {/* Search */}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="w-full pt-5">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">MIS Report</h1>
          <div className="space-x-2">
            <button
              onClick={exportToPDF}
              className="bg-blue-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              PDF
            </button>
            <button
              onClick={exportToCSV}
              className="bg-blue-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              CSV
            </button>
            <button
              onClick={exportToExcel}
              className="bg-blue-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Excel
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="rounded-md border">
          {apiData === "" ? (
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
                    No Data Available.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ) : apiData && apiData?.length === 0 ? (
            <Loading />
          ) : (
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

        {/* Pagination Section */}
        <div className="flex items-center justify-end space-x-2 py-4">
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
    </div>
  );
}

export default MisReportTable;
