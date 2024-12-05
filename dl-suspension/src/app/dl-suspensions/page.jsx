import React from "react";
import SidebarLayout from "@/components/sidebar-layout";
import DataTableDemo from "@/components/suspension-data-table";

const page = () => {
  return (
    <div>
      <SidebarLayout>
        <div className="p-10">
          <DataTableDemo></DataTableDemo>
        </div>
      </SidebarLayout>
    </div>
  );
};

export default page;
