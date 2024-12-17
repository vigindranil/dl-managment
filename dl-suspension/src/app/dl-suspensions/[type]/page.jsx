import React from "react";
import DataTableDemo from "@/components/suspension-data-table";

const page = ({ type }) => {
  return (
    <div className="p-10">
      <DataTableDemo type={type}></DataTableDemo>
    </div>
  );
};

export default page;
