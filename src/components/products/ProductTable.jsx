// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Chip,
//   Avatar,
//   Box,
//   TextField,
//   InputAdornment,
//   Tooltip,
//   Pagination,
//   Stack,
//   Typography,
//   Button,
// } from "@mui/material";
// import { FiEdit, FiTrash2, FiSearch, FiEye } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";

// import Loader from "../Loader";
// import ConfirmModal from "../ConfirmModal";
// import useProductsTable from "../../hooks/products/useProductsTable";
// import { isSuperAdmin } from "../../utils/auth";

// export default function ProductTable({ onEdit, filters = {}, refreshKey }) {
//   const navigate = useNavigate();
//   const {
//     rows,
//     loading,
//     deleteId,
//     setDeleteId,
//     handleDelete,
//     searchInput,
//     setSearchInput,
//     handleSearchSubmit,
//     clearSearch,
//     pagination,
//     setPage,
//   } = useProductsTable({ filters, refreshKey });

//   if (loading) return <Loader />;

//   return (
//     <>
//       <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, mb: 2, flexWrap: "wrap" }}>
//         <TextField
//           size="small"
//           placeholder="Search products..."
//           value={searchInput}
//           onChange={(e) => setSearchInput(e.target.value)}
//           onKeyDown={(e) => {
//             if (e.key === "Enter") handleSearchSubmit();
//           }}
//           sx={{
//             width: 300,
//             "& .MuiOutlinedInput-root": {
//               borderRadius: "8px",
//               backgroundColor: "white",
//             },
//           }}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <FiSearch className="text-gray-400" />
//               </InputAdornment>
//             ),
//           }}
//         />
//         <Button
//           size="small"
//           variant="contained"
//           onClick={handleSearchSubmit}
//           sx={{ bgcolor: "#3D1613", textTransform: "none", "&:hover": { bgcolor: "#2a0f0d" } }}
//         >
//           Search
//         </Button>
//         <Button
//           size="small"
//           variant="text"
//           onClick={clearSearch}
//           sx={{ color: "#666", textTransform: "none" }}
//         >
//           Clear
//         </Button>
//       </Box>

//       <TableContainer
//         component={Paper}
//         sx={{ borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
//       >
//         <Table sx={{ minWidth: 650 }}>
//           <TableHead sx={{ bgcolor: "#f8fafc" }}>
//             <TableRow>
//               <TableCell sx={{ fontWeight: 600 }}>Image</TableCell>
//               <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
//               <TableCell align="right" sx={{ fontWeight: 600 }}>
//                 Category
//               </TableCell>
//               <TableCell align="right" sx={{ fontWeight: 600 }}>
//                 Brand
//               </TableCell>
//               <TableCell align="right" sx={{ fontWeight: 600 }}>
//                 Supplier
//               </TableCell>
//               <TableCell align="right" sx={{ fontWeight: 600 }}>
//                 Price
//               </TableCell>
//               <TableCell align="right" sx={{ fontWeight: 600 }}>
//                 Stock
//               </TableCell>
//               <TableCell align="right" sx={{ fontWeight: 600 }}>
//                 Actions
//               </TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {rows.length > 0 ? (
//               rows.map((row) => (
//                 <TableRow key={row.id} hover onClick={() => navigate(`/products/view/${row.id}`)} sx={{ cursor: "pointer" }}>
//                   <TableCell>
//                     {row.image ? (
//                       <Avatar src={row.image} variant="rounded" sx={{ width: 40, height: 40 }} />
//                     ) : (
//                       "-"
//                     )}
//                   </TableCell>

//                   <TableCell>
//                     <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
//                       <span className="font-medium text-gray-900">{row.name}</span>
//                       {Array.isArray(row.variants) && row.variants.length > 0 && (
//                         <Typography variant="caption" color="text.secondary">
//                           {row.variants.length} Variant(s)
//                         </Typography>
//                       )}
//                       <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
//                         {row.is_published === false && (
//                           <Chip label="Hidden" size="small" sx={{ height: 20, fontSize: "0.65rem", bgcolor: "#f3f4f6", color: "#4b5563", fontWeight: 600 }} />
//                         )}
//                         {row.is_featured && (
//                           <Chip label="Featured" size="small" sx={{ height: 20, fontSize: "0.65rem", bgcolor: "#fef08a", color: "#854d0e", fontWeight: 600 }} />
//                         )}
//                         {row.is_best_seller && (
//                           <Chip label="Best Seller" size="small" sx={{ height: 20, fontSize: "0.65rem", bgcolor: "#bfdbfe", color: "#1e3a8a", fontWeight: 600 }} />
//                         )}
//                       </Box>
//                     </Box>
//                   </TableCell>

//                   <TableCell align="right">{row.category ? row.category.name : "-"}</TableCell>

//                   <TableCell align="right">{row.brand ? row.brand.name : "-"}</TableCell>

//                   <TableCell align="right">{row.supplier ? row.supplier.name : "-"}</TableCell>

//                   <TableCell align="right">
//                     <span className="font-semibold text-gray-700">AED {Number(row.price || 0).toFixed(2)}</span>
//                   </TableCell>

//                   <TableCell align="right">
//                     {(() => {
//                       const isVariantProduct = Array.isArray(row.variants) && row.variants.length > 0;
//                       const calculatedStock = isVariantProduct 
//                         ? row.variants.reduce((acc, v) => acc + (Number(v.stock) || 0), 0)
//                         : Number(row.stock || 0);
                        
//                       return (
//                         <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
//                           <Chip
//                             label={calculatedStock > 0 ? (calculatedStock < 10 ? `Low Stock (${calculatedStock})` : `${calculatedStock} in stock`) : "Out of Stock"}
//                             color={calculatedStock === 0 ? "error" : (calculatedStock < 10 ? "warning" : "success")}
//                             size="small"
//                             variant={calculatedStock > 0 ? "filled" : "outlined"}
//                           />
//                           {isVariantProduct && (
//                             <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
//                               across variants
//                             </Typography>
//                           )}
//                         </Box>
//                       );
//                     })()}
//                   </TableCell>

//                   <TableCell align="right">
//                     <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
//                       <Tooltip title="Edit Product">
//                         <IconButton
//                           size="small"
//                           onClick={(e) => { e.stopPropagation(); onEdit && onEdit(row); }}
//                           sx={{
//                             color: "#0E45B7",
//                             bgcolor: "#eff6ff",
//                             "&:hover": { bgcolor: "#dbeafe" },
//                           }}
//                         >
//                           <FiEdit size={18} />
//                         </IconButton>
//                       </Tooltip>

//                       {isSuperAdmin() && (
//                         <Tooltip title="Delete Product">
//                           <IconButton
//                             size="small"
//                             onClick={(e) => { e.stopPropagation(); setDeleteId(row.id); }}
//                             sx={{
//                               color: "#ef4444",
//                               bgcolor: "#fef2f2",
//                               "&:hover": { bgcolor: "#fee2e2" },
//                             }}
//                           >
//                             <FiTrash2 size={18} />
//                           </IconButton>
//                         </Tooltip>
//                       )}
//                     </Box>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={8} align="center" sx={{ py: 6, color: "gray" }}>
//                   No products found
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       {pagination.total_pages > 1 && (
//         <Stack
//           direction={{ xs: "column", sm: "row" }}
//           alignItems={{ xs: "flex-start", sm: "center" }}
//           justifyContent="space-between"
//           spacing={2}
//           sx={{ mt: 2 }}
//         >
//           <Typography variant="body2" color="text.secondary">
//             Showing page {pagination.current_page} of {pagination.total_pages} ({pagination.total_products} products)
//           </Typography>
//           <Pagination
//             page={pagination.current_page}
//             count={pagination.total_pages}
//             color="primary"
//             onChange={(_, value) => setPage(value)}
//           />
//         </Stack>
//       )}

//       <ConfirmModal
//         open={Boolean(deleteId)}
//         onClose={() => setDeleteId(null)}
//         onConfirm={handleDelete}
//         title="Delete Product"
//         message="Are you sure you want to delete this product?"
//       />
//     </>
//   );
// }




// import { useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Chip,
//   Avatar,
//   Box,
//   TextField,
//   InputAdornment,
//   Tooltip,
//   Pagination,
//   Stack,
//   Typography,
//   Button,
// } from "@mui/material";
// import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";

// import Loader from "../Loader";
// import ConfirmModal from "../ConfirmModal";
// import useProductsTable from "../../hooks/products/useProductsTable";
// import { isSuperAdmin } from "../../utils/auth";

// const LOW_STOCK_LIMIT = 10;
// const VISIBLE_VARIANTS = 3; // how many variants show before "Show all"

// // colours and labels for each stock level
// const LEVEL_STYLES = {
//   out: { bg: "#fef2f2", border: "#fecaca", text: "#b91c1c", dot: "#ef4444", label: "Out of Stock" },
//   low: { bg: "#fffbeb", border: "#fde68a", text: "#b45309", dot: "#f59e0b", label: "Low Stock" },
//   ok: { bg: "#f0fdf4", border: "#bbf7d0", text: "#15803d", dot: "#22c55e", label: "In Stock" },
// };

// const getLevel = (stock, forceLow = false) => {
//   if (stock <= 0) return "out";
//   if (forceLow) return "low"; // in Low Stock mode the API already decided this variant is low
//   return stock < LOW_STOCK_LIMIT ? "low" : "ok";
// };

// // readable name for a variant, e.g. "Size: M, Color: Red"
// const variantLabel = (variant) => {
//   const options = Array.isArray(variant.options)
//     ? variant.options
//         .filter((o) => o.option_value)
//         .map((o) => (o.option_name ? `${o.option_name}: ${o.option_value}` : o.option_value))
//         .join(", ")
//     : "";
//   return options || variant.sku || `Variant #${variant.id}`;
// };

// // one variant as a compact card (Low Stock filter only)
// function VariantRow({ variant, lowStockOnly }) {
//   const stock = Number(variant.stock) || 0;
//   const level = getLevel(stock, lowStockOnly);
//   const style = LEVEL_STYLES[level];
//   const label = variantLabel(variant);
//   const showBadge = level !== "ok";

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between",
//         gap: 1.5,
//         px: 1.25,
//         py: 0.75,
//         borderRadius: 1.5,
//         bgcolor: style.bg,
//         border: `1px solid ${style.border}`,
//       }}
//     >
//       <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
//         <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: style.dot, flexShrink: 0 }} />
//         <Tooltip title={label} placement="top" arrow>
//           <Typography variant="body2" noWrap sx={{ color: "#374151", fontWeight: 500, maxWidth: 220 }}>
//             {label}
//           </Typography>
//         </Tooltip>
//       </Box>

//       <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexShrink: 0 }}>
//         <Typography variant="body2" sx={{ fontWeight: 700, color: style.text, minWidth: 18, textAlign: "right" }}>
//           {stock}
//         </Typography>
//         {showBadge && (
//           <Chip
//             label={style.label}
//             size="small"
//             sx={{
//               height: 20,
//               fontSize: "0.65rem",
//               fontWeight: 700,
//               bgcolor: "#fff",
//               color: style.text,
//               border: `1px solid ${style.border}`,
//             }}
//           />
//         )}
//       </Box>
//     </Box>
//   );
// }

// // the whole Stock cell
// function StockCell({ row, lowStockOnly }) {
//   const [expanded, setExpanded] = useState(false);

//   const variants = Array.isArray(row.variants) ? row.variants : [];
//   const isVariantProduct = variants.length > 0;

//   const totalStock = isVariantProduct
//     ? variants.reduce((acc, v) => acc + (Number(v.stock) || 0), 0)
//     : Number(row.stock || 0);

//   // All Products, or products without variants: one summary pill
//   if (!lowStockOnly || !isVariantProduct) {
//     const level = getLevel(totalStock, lowStockOnly);
//     const style = LEVEL_STYLES[level];
//     return (
//       <Box
//         sx={{
//           display: "inline-flex",
//           alignItems: "center",
//           gap: 1,
//           px: 1.25,
//           py: 0.75,
//           borderRadius: 1.5,
//           bgcolor: style.bg,
//           border: `1px solid ${style.border}`,
//         }}
//       >
//         <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: style.dot }} />
//         <Typography variant="body2" sx={{ fontWeight: 700, color: style.text }}>
//           {totalStock}
//         </Typography>
//         <Typography variant="caption" sx={{ color: style.text, fontWeight: 600 }}>
//           {level === "ok" ? "in stock" : style.label}
//         </Typography>
//       </Box>
//     );
//   }

//   // Low Stock filter: show each variant the API returned, with its own stock and badge
//   const visible = expanded ? variants : variants.slice(0, VISIBLE_VARIANTS);
//   const hiddenCount = variants.length - VISIBLE_VARIANTS;

//   return (
//     <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, minWidth: 260 }}>
//       {visible.map((variant) => (
//         <VariantRow key={variant.id ?? variant.sku} variant={variant} lowStockOnly />
//       ))}

//       {hiddenCount > 0 && (
//         <Button
//           size="small"
//           onClick={(e) => {
//             e.stopPropagation(); // do not open the product
//             setExpanded((prev) => !prev);
//           }}
//           sx={{ alignSelf: "flex-start", textTransform: "none", fontSize: "0.75rem", color: "#3D1613", px: 0.5, minWidth: 0 }}
//         >
//           {expanded ? "Show less" : `Show all (${variants.length})`}
//         </Button>
//       )}
//     </Box>
//   );
// }

// export default function ProductTable({ onEdit, filters = {}, refreshKey }) {
//   const navigate = useNavigate();
//   const {
//     rows,
//     loading,
//     lowStockOnly, // true only when the rows on screen are the low-stock result
//     deleteId,
//     setDeleteId,
//     handleDelete,
//     searchInput,
//     setSearchInput,
//     handleSearchSubmit,
//     clearSearch,
//     pagination,
//     setPage,
//   } = useProductsTable({ filters, refreshKey });

//   if (loading) return <Loader />;

//   return (
//     <>
//       <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, mb: 2, flexWrap: "wrap" }}>
//         <TextField
//           size="small"
//           placeholder="Search products..."
//           value={searchInput}
//           onChange={(e) => setSearchInput(e.target.value)}
//           onKeyDown={(e) => {
//             if (e.key === "Enter") handleSearchSubmit();
//           }}
//           sx={{
//             width: 300,
//             "& .MuiOutlinedInput-root": {
//               borderRadius: "8px",
//               backgroundColor: "white",
//             },
//           }}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <FiSearch className="text-gray-400" />
//               </InputAdornment>
//             ),
//           }}
//         />
//         <Button
//           size="small"
//           variant="contained"
//           onClick={handleSearchSubmit}
//           sx={{ bgcolor: "#3D1613", textTransform: "none", "&:hover": { bgcolor: "#2a0f0d" } }}
//         >
//           Search
//         </Button>
//         <Button
//           size="small"
//           variant="text"
//           onClick={clearSearch}
//           sx={{ color: "#666", textTransform: "none" }}
//         >
//           Clear
//         </Button>
//       </Box>

//       <TableContainer
//         component={Paper}
//         sx={{ borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
//       >
//         <Table sx={{ minWidth: 650 }}>
//           <TableHead sx={{ bgcolor: "#f8fafc" }}>
//             <TableRow>
//               <TableCell sx={{ fontWeight: 600 }}>Image</TableCell>
//               <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
//               <TableCell align="right" sx={{ fontWeight: 600 }}>
//                 Category
//               </TableCell>
//               <TableCell align="right" sx={{ fontWeight: 600 }}>
//                 Brand
//               </TableCell>
//               <TableCell align="right" sx={{ fontWeight: 600 }}>
//                 Supplier
//               </TableCell>
//               <TableCell align="right" sx={{ fontWeight: 600 }}>
//                 Price
//               </TableCell>
//               <TableCell align="left" sx={{ fontWeight: 600, minWidth: lowStockOnly ? 280 : 120 }}>
//                 Stock
//               </TableCell>
//               <TableCell align="right" sx={{ fontWeight: 600 }}>
//                 Actions
//               </TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {rows.length > 0 ? (
//               rows.map((row) => (
//                 <TableRow key={row.id} hover onClick={() => navigate(`/products/view/${row.id}`)} sx={{ cursor: "pointer" }}>
//                   <TableCell>
//                     {row.image ? (
//                       <Avatar src={row.image} variant="rounded" sx={{ width: 40, height: 40 }} />
//                     ) : (
//                       "-"
//                     )}
//                   </TableCell>

//                   <TableCell>
//                     <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
//                       <span className="font-medium text-gray-900">{row.name}</span>
//                       {Array.isArray(row.variants) && row.variants.length > 0 && (
//                         <Typography variant="caption" color="text.secondary">
//                           {lowStockOnly ? `${row.variants.length} low-stock variant(s)` : `${row.variants.length} Variant(s)`}
//                         </Typography>
//                       )}
//                       <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
//                         {row.is_published === false && (
//                           <Chip label="Hidden" size="small" sx={{ height: 20, fontSize: "0.65rem", bgcolor: "#f3f4f6", color: "#4b5563", fontWeight: 600 }} />
//                         )}
//                         {row.is_featured && (
//                           <Chip label="Featured" size="small" sx={{ height: 20, fontSize: "0.65rem", bgcolor: "#fef08a", color: "#854d0e", fontWeight: 600 }} />
//                         )}
//                         {row.is_best_seller && (
//                           <Chip label="Best Seller" size="small" sx={{ height: 20, fontSize: "0.65rem", bgcolor: "#bfdbfe", color: "#1e3a8a", fontWeight: 600 }} />
//                         )}
//                       </Box>
//                     </Box>
//                   </TableCell>

//                   <TableCell align="right">{row.category ? row.category.name : "-"}</TableCell>

//                   <TableCell align="right">{row.brand ? row.brand.name : "-"}</TableCell>

//                   <TableCell align="right">{row.supplier ? row.supplier.name : "-"}</TableCell>

//                   <TableCell align="right">
//                     <span className="font-semibold text-gray-700">AED {Number(row.price || 0).toFixed(2)}</span>
//                   </TableCell>

//                   <TableCell align="left" sx={{ verticalAlign: "top" }}>
//                     <StockCell row={row} lowStockOnly={lowStockOnly} />
//                   </TableCell>

//                   <TableCell align="right">
//                     <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
//                       <Tooltip title="Edit Product">
//                         <IconButton
//                           size="small"
//                           onClick={(e) => { e.stopPropagation(); onEdit && onEdit(row); }}
//                           sx={{
//                             color: "#0E45B7",
//                             bgcolor: "#eff6ff",
//                             "&:hover": { bgcolor: "#dbeafe" },
//                           }}
//                         >
//                           <FiEdit size={18} />
//                         </IconButton>
//                       </Tooltip>

//                       {isSuperAdmin() && (
//                         <Tooltip title="Delete Product">
//                           <IconButton
//                             size="small"
//                             onClick={(e) => { e.stopPropagation(); setDeleteId(row.id); }}
//                             sx={{
//                               color: "#ef4444",
//                               bgcolor: "#fef2f2",
//                               "&:hover": { bgcolor: "#fee2e2" },
//                             }}
//                           >
//                             <FiTrash2 size={18} />
//                           </IconButton>
//                         </Tooltip>
//                       )}
//                     </Box>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={8} align="center" sx={{ py: 6, color: "gray" }}>
//                   No products found
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       {pagination.total_pages > 1 && (
//         <Stack
//           direction={{ xs: "column", sm: "row" }}
//           alignItems={{ xs: "flex-start", sm: "center" }}
//           justifyContent="space-between"
//           spacing={2}
//           sx={{ mt: 2 }}
//         >
//           <Typography variant="body2" color="text.secondary">
//             Showing page {pagination.current_page} of {pagination.total_pages} ({pagination.total_products} products)
//           </Typography>
//           <Pagination
//             page={pagination.current_page}
//             count={pagination.total_pages}
//             color="primary"
//             onChange={(_, value) => setPage(value)}
//           />
//         </Stack>
//       )}

//       <ConfirmModal
//         open={Boolean(deleteId)}
//         onClose={() => setDeleteId(null)}
//         onConfirm={handleDelete}
//         title="Delete Product"
//         message="Are you sure you want to delete this product?"
//       />
//     </>
//   );
// }




import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Avatar,
  Box,
  TextField,
  InputAdornment,
  Tooltip,
  Pagination,
  Stack,
  Typography,
  Button,
} from "@mui/material";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";
import ConfirmModal from "../ConfirmModal";
import useProductsTable from "../../hooks/products/useProductsTable";
import { canManageStore, isSuperAdmin } from "../../utils/auth";

const LOW_STOCK_LIMIT = 10;
const VISIBLE_VARIANTS = 3; // how many variants show before "Show all"

// colours and labels for each stock level
const LEVEL_STYLES = {
  out: { bg: "#fef2f2", border: "#fecaca", text: "#b91c1c", dot: "#ef4444", label: "Out of Stock" },
  low: { bg: "#fffbeb", border: "#fde68a", text: "#b45309", dot: "#f59e0b", label: "Low Stock" },
  ok: { bg: "#f0fdf4", border: "#bbf7d0", text: "#15803d", dot: "#22c55e", label: "In Stock" },
};

const getLevel = (stock, forceLow = false) => {
  if (stock <= 0) return "out";
  if (forceLow) return "low"; // in Low Stock mode the API already decided this variant is low
  return stock < LOW_STOCK_LIMIT ? "low" : "ok";
};

// readable name for a variant, e.g. "Size: M, Color: Red"
const variantLabel = (variant) => {
  const options = Array.isArray(variant.options)
    ? variant.options
        .filter((o) => o.option_value)
        .map((o) => (o.option_name ? `${o.option_name}: ${o.option_value}` : o.option_value))
        .join(", ")
    : "";
  return options || variant.sku || `Variant #${variant.id}`;
};

// NEW: size-priced products keep their stock on the sizes, not on variants
const getPricedSizes = (row) => {
  if (Array.isArray(row.product_sizes) && row.product_sizes.length > 0) return row.product_sizes;
  if (Array.isArray(row.colors)) {
    return row.colors.flatMap((c) => (Array.isArray(c.sizes) ? c.sizes : []));
  }
  return [];
};

// one variant as a compact card (Low Stock filter only)
function VariantRow({ variant, lowStockOnly }) {
  const stock = Number(variant.stock) || 0;
  const level = getLevel(stock, lowStockOnly);
  const style = LEVEL_STYLES[level];
  const label = variantLabel(variant);
  const showBadge = level !== "ok";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1.5,
        px: 1.25,
        py: 0.75,
        borderRadius: 1.5,
        bgcolor: style.bg,
        border: `1px solid ${style.border}`,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
        <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: style.dot, flexShrink: 0 }} />
        <Tooltip title={label} placement="top" arrow>
          <Typography variant="body2" noWrap sx={{ color: "#374151", fontWeight: 500, maxWidth: 220 }}>
            {label}
          </Typography>
        </Tooltip>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexShrink: 0 }}>
        <Typography variant="body2" sx={{ fontWeight: 700, color: style.text, minWidth: 18, textAlign: "right" }}>
          {stock}
        </Typography>
        {showBadge && (
          <Chip
            label={style.label}
            size="small"
            sx={{
              height: 20,
              fontSize: "0.65rem",
              fontWeight: 700,
              bgcolor: "#fff",
              color: style.text,
              border: `1px solid ${style.border}`,
            }}
          />
        )}
      </Box>
    </Box>
  );
}

// the whole Stock cell
function StockCell({ row, lowStockOnly }) {
  const [expanded, setExpanded] = useState(false);

  // CHANGED: size-priced products sum their size stock; everything else works as before
  const isSizePriced = Boolean(row.has_size_pricing);
  const pricedSizes = isSizePriced ? getPricedSizes(row) : [];
  const variants = Array.isArray(row.variants) ? row.variants : [];
  const isVariantProduct = !isSizePriced && variants.length > 0;

  const totalStock = isSizePriced
    ? pricedSizes.reduce((acc, s) => acc + (Number(s.stock) || 0), 0)
    : isVariantProduct
      ? variants.reduce((acc, v) => acc + (Number(v.stock) || 0), 0)
      : Number(row.stock || 0);

  // All Products, size-priced products, or products without variants: one summary pill
  if (isSizePriced || !lowStockOnly || !isVariantProduct) {
    const level = getLevel(totalStock, lowStockOnly && !isSizePriced);
    const style = LEVEL_STYLES[level];
    return (
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 1,
          px: 1.25,
          py: 0.75,
          borderRadius: 1.5,
          bgcolor: style.bg,
          border: `1px solid ${style.border}`,
        }}
      >
        <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: style.dot }} />
        <Typography variant="body2" sx={{ fontWeight: 700, color: style.text }}>
          {totalStock}
        </Typography>
        <Typography variant="caption" sx={{ color: style.text, fontWeight: 600 }}>
          {level === "ok" ? "in stock" : style.label}
        </Typography>
      </Box>
    );
  }

  // Low Stock filter: show each variant the API returned, with its own stock and badge
  const visible = expanded ? variants : variants.slice(0, VISIBLE_VARIANTS);
  const hiddenCount = variants.length - VISIBLE_VARIANTS;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, minWidth: 260 }}>
      {visible.map((variant) => (
        <VariantRow key={variant.id ?? variant.sku} variant={variant} lowStockOnly />
      ))}

      {hiddenCount > 0 && (
        <Button
          size="small"
          onClick={(e) => {
            e.stopPropagation(); // do not open the product
            setExpanded((prev) => !prev);
          }}
          sx={{ alignSelf: "flex-start", textTransform: "none", fontSize: "0.75rem", color: "#3D1613", px: 0.5, minWidth: 0 }}
        >
          {expanded ? "Show less" : `Show all (${variants.length})`}
        </Button>
      )}
    </Box>
  );
}

export default function ProductTable({ onEdit, filters = {}, refreshKey }) {
  const navigate = useNavigate();
  const {
    rows,
    loading,
    lowStockOnly, // true only when the rows on screen are the low-stock result
    deleteId,
    setDeleteId,
    handleDelete,
    searchInput,
    setSearchInput,
    handleSearchSubmit,
    clearSearch,
    pagination,
    setPage,
  } = useProductsTable({ filters, refreshKey });

  if (loading) return <Loader />;

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, mb: 2, flexWrap: "wrap" }}>
        <TextField
          size="small"
          placeholder="Search products..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearchSubmit();
          }}
          sx={{
            width: 300,
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              backgroundColor: "white",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FiSearch className="text-gray-400" />
              </InputAdornment>
            ),
          }}
        />
        <Button
          size="small"
          variant="contained"
          onClick={handleSearchSubmit}
          sx={{ bgcolor: "#3D1613", textTransform: "none", "&:hover": { bgcolor: "#2a0f0d" } }}
        >
          Search
        </Button>
        <Button
          size="small"
          variant="text"
          onClick={clearSearch}
          sx={{ color: "#666", textTransform: "none" }}
        >
          Clear
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{ borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Image</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Category
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Brand
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Supplier
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Price
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: 600, minWidth: lowStockOnly ? 280 : 120 }}>
                Stock
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.length > 0 ? (
              rows.map((row) => (
                <TableRow key={row.id} hover onClick={() => navigate(`/products/view/${row.id}`)} sx={{ cursor: "pointer" }}>
                  <TableCell>
                    {row.image ? (
                      <Avatar src={row.image} variant="rounded" sx={{ width: 40, height: 40 }} />
                    ) : (
                      "-"
                    )}
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                      <span className="font-medium text-gray-900">{row.name}</span>
                      {/* CHANGED: size-priced products show a size count instead of a variant count */}
                      {row.has_size_pricing ? (
                        <Typography variant="caption" color="text.secondary">
                          {getPricedSizes(row).length} Size(s)
                        </Typography>
                      ) : (
                        Array.isArray(row.variants) && row.variants.length > 0 && (
                          <Typography variant="caption" color="text.secondary">
                            {lowStockOnly ? `${row.variants.length} low-stock variant(s)` : `${row.variants.length} Variant(s)`}
                          </Typography>
                        )
                      )}
                      <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                        {row.is_published === false && (
                          <Chip label="Hidden" size="small" sx={{ height: 20, fontSize: "0.65rem", bgcolor: "#f3f4f6", color: "#4b5563", fontWeight: 600 }} />
                        )}
                        {row.is_featured && (
                          <Chip label="Featured" size="small" sx={{ height: 20, fontSize: "0.65rem", bgcolor: "#fef08a", color: "#854d0e", fontWeight: 600 }} />
                        )}
                        {row.is_best_seller && (
                          <Chip label="Best Seller" size="small" sx={{ height: 20, fontSize: "0.65rem", bgcolor: "#bfdbfe", color: "#1e3a8a", fontWeight: 600 }} />
                        )}
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell align="right">{row.category ? row.category.name : "-"}</TableCell>

                  <TableCell align="right">{row.brand ? row.brand.name : "-"}</TableCell>

                  <TableCell align="right">{row.supplier ? row.supplier.name : "-"}</TableCell>

                  <TableCell align="right">
                    <span className="font-semibold text-gray-700">
                      {row.has_size_pricing ? "From " : ""}AED {Number(row.price || 0).toFixed(2)}
                    </span>
                  </TableCell>

                  <TableCell align="left" sx={{ verticalAlign: "top" }}>
                    <StockCell row={row} lowStockOnly={lowStockOnly} />
                  </TableCell>

                  <TableCell align="right">
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                      <Tooltip title="Edit Product">
                        <IconButton
                          size="small"
                          onClick={(e) => { e.stopPropagation(); onEdit && onEdit(row); }}
                          sx={{
                            color: "#0E45B7",
                            bgcolor: "#eff6ff",
                            "&:hover": { bgcolor: "#dbeafe" },
                          }}
                        >
                          <FiEdit size={18} />
                        </IconButton>
                      </Tooltip>

                      {canManageStore() && (
                        <Tooltip title="Delete Product">
                          <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); setDeleteId(row.id); }}
                            sx={{
                              color: "#ef4444",
                              bgcolor: "#fef2f2",
                              "&:hover": { bgcolor: "#fee2e2" },
                            }}
                          >
                            <FiTrash2 size={18} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6, color: "gray" }}>
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination.total_pages > 1 && (
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          spacing={2}
          sx={{ mt: 2 }}
        >
          <Typography variant="body2" color="text.secondary">
            Showing page {pagination.current_page} of {pagination.total_pages} ({pagination.total_products} products)
          </Typography>
          <Pagination
            page={pagination.current_page}
            count={pagination.total_pages}
            color="primary"
            onChange={(_, value) => setPage(value)}
          />
        </Stack>
      )}

      <ConfirmModal
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product?"
      />
    </>
  );
}