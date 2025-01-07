import React from "react";
import DataTableDemo from "@/components/suspension-data-table";

const page = ({ type , range }) => {
  return (
    <div className="p-10">
      <DataTableDemo type={type} range={range}></DataTableDemo>
    </div>
  );
};

export default page;
