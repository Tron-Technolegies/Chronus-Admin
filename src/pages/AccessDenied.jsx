import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FiShieldOff } from "react-icons/fi";

export default function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="w-16 h-16 rounded-full bg-[#fdf2f2] flex items-center justify-center text-[#ef4444] mb-4">
        <FiShieldOff size={32} />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2 font-[Bastoni]">Access Denied</h2>
      <p className="text-gray-500 max-w-md mb-6 text-sm">
        You do not have permission to view this page. This section is restricted to Super Administrators.
      </p>
      <Button
        variant="contained"
        onClick={() => navigate("/products")}
        sx={{
          bgcolor: "#3D1613",
          textTransform: "none",
          "&:hover": { bgcolor: "#2a0f0d" },
        }}
      >
        Go to Products
      </Button>
    </div>
  );
}

