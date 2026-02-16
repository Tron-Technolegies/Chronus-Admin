import React, { useState } from "react";
import CustomerTable from "../components/Customers/CustomerTable";
import { IoFunnelOutline } from "react-icons/io5";
import { Menu, MenuItem, Button } from "@mui/material";

export default function Customers() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [filters, setFilters] = useState({});

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const applyFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    handleClose();
  };

  const clearFilters = () => {
    setFilters({});
    handleClose();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Customers</h2>

        <div className="flex gap-2">
          <Button
            variant="outlined"
            className="bg-white"
            startIcon={<IoFunnelOutline />}
            onClick={handleClick}
          >
            Filters
          </Button>

          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem onClick={() => applyFilter("is_active", "true")}>Active Users</MenuItem>
            <MenuItem onClick={() => applyFilter("is_active", "false")}>Inactive Users</MenuItem>
            <MenuItem onClick={() => applyFilter("is_staff", "true")}>Admin Users</MenuItem>
            <MenuItem onClick={() => applyFilter("is_staff", "false")}>Normal Customers</MenuItem>
            <MenuItem onClick={clearFilters}>Clear Filters</MenuItem>
          </Menu>
        </div>
      </div>

      <div className="mt-4">
        <CustomerTable filters={filters} />
      </div>
    </div>
  );
}
