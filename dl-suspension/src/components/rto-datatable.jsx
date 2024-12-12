"use client";
import React, { useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  CookingPot,
  MoreHorizontal,
  Trash2,
  UserRoundPen,
  UserRoundPenIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useSelector } from "react-redux";
import { decrypt } from "@/utils/crypto";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
import { serviceUrl } from "@/app/constant";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CheckCircle, CircleHelp, UserPen } from "lucide-react";
import { useRouter } from "next/navigation";

function RTODataTable() {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({ UserID: false });
  const [rowSelection, setRowSelection] = useState({});
  const authToken = useSelector((state) => state.auth.token);
  const [token, setToken] = useState(null);
  const [apiData, setApiData] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const userDetails = useSelector((state) => state.auth.user);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [rtoOptions, setRtoOptions] = useState([]);
  const [showEditSuccess, setShowEditSuccess] = useState(false);

  const router = useRouter();

  const columns = [
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
        const UserPassword = row.getValue("UserPassword");
        return <div className="text-left">{UserPassword}</div>;
      },
    },
    {
      accessorKey: "ContactNo",
      header: () => <div className="text-left text-white">Contact No.</div>,
      cell: ({ row }) => {
        const ContactNo = row.getValue("ContactNo");
        return <div className="text-left">{ContactNo}</div>;
      },
    },
    {
      accessorKey: "UserID",
      header: () => <div className="text-left text-white">UserID</div>,
      cell: ({ row }) => {
        const UserID = row.getValue("UserID");
        return <div className="text-left">{UserID}</div>;
      },
    },
    {
      accessorKey: "RTOCode",
      header: () => <div className="text-left text-white">RTO Code</div>,
      cell: ({ row }) => {
        const RTOCode = row.getValue("RTOCode");
        return <div className="text-left">{RTOCode}</div>;
      },
    },
    {
      accessorKey: "Action",
      header: () => <div className="text-left text-white">Action</div>,
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const UserID = row.getValue("UserID");
        const Username = row.getValue("Username");
        const UserPassword = row.getValue("UserPassword");
        const FullName = row.getValue("FullName");
        const ContactNo = row.getValue("ContactNo");
        const RTOCode = row.getValue("RTOCode");

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
              <DropdownMenuItem
                className="text-yellow-500 font-bold"
                onClick={() => {
                  setShowEdit(true);
                  setCurrentUser({
                    UserID: UserID || "",
                    Username: Username || "",
                    UserPassword: UserPassword || "",
                    FullName: FullName || "",
                    ContactNo: ContactNo || "",
                    RTOCode: RTOCode || "",
                  });
                }}
              >
                <UserRoundPen className="inline w-4 h-4 stroke-[3]" /> Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-800 font-bold"
                onClick={() => {
                  setShowDialog(true);
                  setCurrentUser({
                    UserID: UserID || "",
                    Username: Username || "",
                    UserPassword: UserPassword || "",
                    FullName: FullName || "",
                    ContactNo: ContactNo || "",
                    RTOCode: RTOCode || "",
                  });
                }}
              >
                <Trash2 className="inline w-4 h-4 stroke-[3]" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  useEffect(() => {
    const parse_token = decrypt(authToken);
    setToken(parse_token);
    token && getRTOUsers();

    const user_data = JSON.parse(decrypt(userDetails));
    setUser(user_data);

    token && rtoDropDown();
  }, [token]);

  const handleDelete = async () => {
    console.log("id", user?.AuthorityUserID);
    try {
      const response = await fetch(`${serviceUrl}create-rto-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          Username: currentUser?.Username,
          UserPassword: "admin@123",
          FullName: currentUser?.FullName,
          ContactNo: currentUser?.ContactNo,
          RtoID: currentUser?.RTOCode,
          EntryUserID: user?.AuthorityUserID,
          OperationStatus: "2",
          UserID: currentUser?.UserID,
        }),
      });
      if (response.ok) {
        const decoded_data = await response.json();

        if (decoded_data?.status == 0) {
          console.log("user deleted");
          setShowSuccessDialog(true);
        } else {
          console.log("User not deleted");

          setError("User not deleted");
        }
      } else {
        const errorData = await response.json();
        console.log(errorData.message);
        setError(`${errorData.message}`);
      }
    } catch (error) {
      console.log("catch");
      console.log(error.message);
      setError("Failed to create user, Internal server error");
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${serviceUrl}create-rto-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          Username: currentUser?.Username,
          UserPassword: currentUser?.UserPassword,
          FullName: currentUser?.FullName,
          ContactNo: currentUser?.ContactNo,
          RtoID: currentUser?.RTOCode,
          EntryUserID: user?.AuthorityUserID,
          OperationStatus: "1",
          UserID: currentUser?.UserID,
        }),
      });
      if (response.ok) {
        const decoded_data = await response.json();

        if (decoded_data?.status == 0) {
          console.log("user Edited");
          setShowEditSuccess(true);
        } else {
          console.log("User not Edited");

          setError("User not Edited");
        }
      } else {
        const errorData = await response.json();
        setError(`${errorData.message}`);
      }
    } catch (error) {
      console.log(error.message);
      setError("Failed to Edited user, Internal server error");
    }
  };
  const rtoDropDown = async () => {
    try {
      console.log("token", token);
      if (!token) {
        console.error("Token is not available");
        return;
      }

      const response = await fetch(`${serviceUrl}get-all-rto-list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const result = await response.json();

        setRtoOptions(result.data);
      } else {
        console.error("Failed to fetch RTO options");
      }
    } catch (error) {
      console.error("Error fetching RTO options:", error);
    }
  };

  const openSucessAlert = () => {
    setShowSuccessDialog(false);
    getRTOUsers();
  };

  const handleSuccessEditDialog = () => {
    setShowEditSuccess(false);
    getRTOUsers();
  };
  async function getRTOUsers() {
    try {
      const myHeaders = new Headers();
      console.log("token: ", token);
      myHeaders.append("Authorization", `Bearer ${token}`);
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      await fetch(`${serviceUrl}get-rto-user-details?UserID=0`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result.data);
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
  });

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
                );
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
      </div>
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
      {/* Delete Alert */}
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader className="flex flex-col items-center justify-center">
            <CircleHelp size={48} color="orange" className="mb-2" />
            <AlertDialogTitle className="text-center">
              Are you sure you want to delete this user?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Proceed with deletion?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center space-x-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Delete Confirm Alert */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader className="flex flex-col items-center justify-center">
            <CheckCircle size={48} color="green" className="mb-2" />
            <AlertDialogTitle className="text-center">
              User deleted successfully
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              The user account has been deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center mt-4">
            <AlertDialogAction
              onClick={openSucessAlert}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 mx-auto"
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* edit user */}
      <AlertDialog open={showEdit} onOpenChange={setShowEdit}>
        <AlertDialogContent>
          <AlertDialogHeader className="flex flex-col items-center justify-center">
            <UserPen size={48} color="orange" className="mb-2" />
            <AlertDialogTitle className="text-center">
              Edit User Details
            </AlertDialogTitle>
            <AlertDialogDescription>
              Fill in the details below to edit the user.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Form inside AlertDialogContent */}
          <form className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={currentUser?.Username}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, Username: e.target.value })
                }
                className="mt-1 px-3 py-2 border rounded-md"
                placeholder="Enter username"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="rto">RTO Preference</label>
              <div className="flex">
                <Select
                  required
                  value={currentUser?.RTOCode}
                  onValueChange={(value) =>
                    setCurrentUser({ ...currentUser, RTOCode: value })
                  }
                >
                  <SelectTrigger id="rto">
                    <SelectValue placeholder="Select RTO preference" />
                  </SelectTrigger>
                  <SelectContent>
                    {rtoOptions.map((option, index) => (
                      <SelectItem key={index} value={option?.RTOCode}>
                        {option?.RTOName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="fullName" className="text-sm font-medium">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={currentUser?.FullName}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, FullName: e.target.value })
                }
                className="mt-1 px-3 py-2 border rounded-md"
                placeholder="Enter full name"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="contactNo" className="text-sm font-medium">
                Contact No
              </label>
              <input
                type="number"
                id="contactNo"
                name="contactNo"
                value={currentUser?.ContactNo}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, ContactNo: e.target.value })
                }
                className="mt-1 px-3 py-2 border rounded-md"
                placeholder="Enter contact number"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                type="text"
                id="password"
                name="password"
                value={currentUser?.UserPassword}
                onChange={(e) =>
                  setCurrentUser({
                    ...currentUser,
                    UserPassword: e.target.value,
                  })
                }
                className="mt-1 px-3 py-2 border rounded-md"
                placeholder="Enter password"
              />
            </div>
          </form>

          <AlertDialogFooter className="flex justify-center space-x-4">
            <AlertDialogCancel onClick={() => setShowDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              type="submit"
              form="editUserForm"
              className="py-2 bg-black text-white rounded hover:bg-gray-800"
              onClick={handleSave}
            >
              Save Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={showEditSuccess} onOpenChange={setShowEditSuccess}>
        <AlertDialogContent>
          <AlertDialogHeader className="flex flex-col items-center justify-center">
            <CheckCircle size={48} color="green" className="mb-2" />
            <AlertDialogTitle className="text-center">
              User edited successfully
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              The user account has been edited.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center mt-4">
            <AlertDialogAction
              onClick={handleSuccessEditDialog}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 mx-auto"
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default RTODataTable;
