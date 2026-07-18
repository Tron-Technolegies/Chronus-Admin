import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Button,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Container,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { IoArrowBack } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { getProductDetail } from "../api/api";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "../utils/apiError";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await getProductDetail(id);
        setProduct(res.data);
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Failed to load product details"));
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  if (loading) return <Loader />;
  if (!product)
    return (
      <Box p={4} textAlign="center">
        <Typography variant="h6" color="text.secondary">
          Product not found
        </Typography>
      </Box>
    );

  const isFineArt = product.product_type === "fine_art";
  const isVariant = product.product_type === "variant";

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      {/* Header section */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton onClick={() => navigate("/products")} sx={{ bgcolor: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", "&:hover": { bgcolor: "#f5f5f5" } }}>
            <IoArrowBack />
          </IconButton>
          <Typography variant="h4" sx={{ fontFamily: "serif", fontWeight: 700, color: "#1a1a1a" }}>
            {product.name}
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Chip label={product.is_published ? "Published" : "Hidden"} color={product.is_published ? "success" : "default"} size="small" />
            {product.is_featured && <Chip label="Featured" color="secondary" size="small" />}
            {product.is_best_seller && <Chip label="Best Seller" color="primary" size="small" />}
            <Chip label={isVariant ? "Variant" : "Fine Art"} variant="outlined" size="small" />
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<FiEdit />}
          onClick={() => navigate(`/products/edit/${product.id}`, { state: { editData: product } })}
          sx={{ bgcolor: "#3D1613", textTransform: "none", borderRadius: 2, px: 3, "&:hover": { bgcolor: "#2a0f0d" } }}
        >
          Edit Product
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column: Image & Supplier */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.03)", mb: 3, overflow: "hidden" }}>
            {product.image ? (
              <Box sx={{ position: "relative", width: "100%", pt: "100%" }}>
                <img src={product.image} alt={product.name} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              </Box>
            ) : (
              <Box sx={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#f9fafb" }}>
                <Typography color="text.secondary">No Image</Typography>
              </Box>
            )}
          </Card>

          {/* Supplier Info */}
          <Card sx={{ borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, fontSize: "1.1rem" }}>
                Supplier Information
              </Typography>
              {product.supplier ? (
                <List disablePadding dense>
                  <ListItem disableGutters><ListItemText primary="Name" secondary={product.supplier.name} /></ListItem>
                  <ListItem disableGutters><ListItemText primary="Email" secondary={product.supplier.email} /></ListItem>
                  <ListItem disableGutters><ListItemText primary="Phone" secondary={product.supplier.phone} /></ListItem>
                  <ListItem disableGutters><ListItemText primary="WeChat" secondary={product.supplier.wechat_id || "N/A"} /></ListItem>
                  <ListItem disableGutters><ListItemText primary="Country" secondary={product.supplier.country || "N/A"} /></ListItem>
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">No supplier assigned.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.03)", mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, fontSize: "1.1rem" }}>
                General Details
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary" display="block">Base Price</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#10b981" }}>${product.price}</Typography>
                </Grid>
                {product.supplier_cost && (
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary" display="block">Supplier Cost</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#ef4444" }}>${product.supplier_cost}</Typography>
                  </Grid>
                )}
                {isFineArt && (
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary" display="block">Stock</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{product.stock}</Typography>
                  </Grid>
                )}
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>

                <Grid item xs={6} sm={4}>
                  <Typography variant="caption" color="text.secondary" display="block">Category</Typography>
                  <Typography variant="body1" fontWeight="500">{product.category?.name || "N/A"}</Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="caption" color="text.secondary" display="block">Subcategory</Typography>
                  <Typography variant="body1" fontWeight="500">{product.subcategory?.name || "N/A"}</Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="caption" color="text.secondary" display="block">Brand</Typography>
                  <Typography variant="body1" fontWeight="500">{product.brand?.name || "N/A"}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: "flex", gap: 3, p: 2, bgcolor: "#f9fafb", borderRadius: 2, mt: 1 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">Weight</Typography>
                      <Typography variant="body2" fontWeight="500">{product.weight} kg</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">Dimensions (L×W×H)</Typography>
                      <Typography variant="body2" fontWeight="500">{product.length} × {product.width} × {product.height} cm</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Variants Section */}
          {isVariant && product.variants && product.variants.length > 0 && (
            <Card sx={{ borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.03)", mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, fontSize: "1.1rem" }}>
                  Product Variants
                </Typography>
                <TableContainer sx={{ border: "1px solid #f0f0f0", borderRadius: 2 }}>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: "#f9fafb" }}>
                      <TableRow>
                        <TableCell>SKU</TableCell>
                        <TableCell>Options</TableCell>
                        <TableCell align="right">Stock</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {product.variants.map((v) => (
                        <TableRow key={v.id}>
                          <TableCell sx={{ fontWeight: 500 }}>{v.sku}</TableCell>
                          <TableCell>
                            {v.options.map((opt) => (
                              <Chip key={opt.id} label={`${opt.option_value}`} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                            ))}
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="600" color={v.stock > 0 ? "success.main" : "error.main"}>
                              {v.stock}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}

          {/* Fine Art Configuration */}
          {isFineArt && (
            <Card sx={{ borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.03)", mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, fontSize: "1.1rem" }}>
                  Fine Art Configurations
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>Available Sizes</Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {product.sizes?.map((size) => (
                        <Chip key={size.id} label={`${size.size} (+$${size.price})`} size="small" />
                      ))}
                      {!product.sizes?.length && <Typography variant="body2" color="text.secondary">None</Typography>}
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>Available Colors</Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {product.colors?.map((color) => (
                        <Chip key={color.id} avatar={color.image ? <Avatar src={color.image} /> : null} label={color.color_name} size="small" />
                      ))}
                      {!product.colors?.length && <Typography variant="body2" color="text.secondary">None</Typography>}
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>Available Frames</Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {product.frames?.map((frame) => (
                        <Chip key={frame.id} avatar={frame.image ? <Avatar src={frame.image} /> : null} label={`${frame.name} (+$${frame.extra_price})`} size="small" />
                      ))}
                      {!product.frames?.length && <Typography variant="body2" color="text.secondary">None</Typography>}
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>Available Materials</Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {product.materials?.map((mat) => (
                        <Chip key={mat.id} label={`${mat.name} (+$${mat.extra_price})`} size="small" />
                      ))}
                      {!product.materials?.length && <Typography variant="body2" color="text.secondary">None</Typography>}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Description & Specs */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Card sx={{ borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.03)", height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, fontSize: "1.1rem" }}>
                    Description
                  </Typography>
                  {typeof product.description === "object" && product.description !== null ? (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      {Object.entries(product.description).map(([key, value]) => (
                        <Typography variant="body2" key={key}>
                          <span style={{ fontWeight: 600, color: '#555' }}>{key}:</span> {String(value)}
                        </Typography>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", color: "text.secondary" }}>
                      {product.description || "No description provided."}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card sx={{ borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.03)", height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, fontSize: "1.1rem" }}>
                    Specification
                  </Typography>
                  {typeof product.specification === "object" && product.specification !== null ? (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      {Object.entries(product.specification).map(([key, value]) => (
                        <Typography variant="body2" key={key}>
                          <span style={{ fontWeight: 600, color: '#555' }}>{key}:</span> {String(value)}
                        </Typography>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", color: "text.secondary" }}>
                      {product.specification || "No specifications provided."}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Gallery Section */}
        {product.gallery && product.gallery.length > 0 && (
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.03)", mt: 1 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, fontSize: "1.1rem" }}>
                  Gallery Images
                </Typography>
                <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 1 }}>
                  {product.gallery.map((img) => (
                    <Box key={img.id} sx={{ minWidth: 120, width: 120, height: 120, borderRadius: 2, overflow: "hidden" }}>
                      <img src={img.image} alt="Gallery" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
