import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Button,
  Grid,
  Container,
  Divider,
  Avatar,
  List,
  ListItem,
  Tabs,
  Tab,
} from "@mui/material";
import { IoArrowBack } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { getProductDetail } from "../api/api";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "../utils/apiError";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 4 }}>{children}</Box>}
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await getProductDetail(id);
        setProduct(res.data);
        if (res.data.image) setMainImage(res.data.image);
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

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderSpecsOrDesc = (content, fallback) => {
    if (typeof content === "object" && content !== null) {
      return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {Object.entries(content).map(([key, value]) => (
            <Box key={key} sx={{ borderBottom: "1px solid #f0f0f0", pb: 1.5 }}>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>
                {key}
              </Typography>
              <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500, color: "#333" }}>
                {String(value)}
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }
    return (
      <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", color: "#444", lineHeight: 1.8 }}>
        {content || fallback}
      </Typography>
    );
  };

  return (
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh", pb: 10 }}>
      {/* Top Header - Sticky */}
      <Box sx={{ borderBottom: "1px solid #eaeaea", position: "sticky", top: 0, bgcolor: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)", zIndex: 10, py: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton onClick={() => navigate("/products")} sx={{ color: "#333", "&:hover": { bgcolor: "#f5f5f5" } }}>
                <IoArrowBack size={24} />
              </IconButton>
              <Box>
                <Typography variant="h4" sx={{ fontFamily: "serif", fontWeight: 700, color: "#1a1a1a", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                  {product.name}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, mt: 0.5, alignItems: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    {product.brand?.name || "Unbranded"}
                  </Typography>
                  <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 14, alignSelf: "center" }} />
                  <Typography variant="body2" color="text.secondary">
                    {product.category?.name || "Uncategorized"}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
                <Chip label={product.is_published ? "Published" : "Hidden"} sx={{ bgcolor: product.is_published ? "#e6f4ea" : "#f1f3f4", color: product.is_published ? "#137333" : "#5f6368", fontWeight: 600, border: "none" }} size="small" />
                {product.is_featured && <Chip label="Featured" sx={{ bgcolor: "#fce8e6", color: "#c5221f", fontWeight: 600, border: "none" }} size="small" />}
                <Chip label={isVariant ? "Variant" : "Fine Art"} variant="outlined" sx={{ fontWeight: 600, borderColor: "#dadce0", color: "#3c4043" }} size="small" />
              </Box>
              <Button
                variant="contained"
                startIcon={<FiEdit />}
                onClick={() => navigate(`/products/edit/${product.id}`, { state: { editData: product } })}
                sx={{ bgcolor: "#3D1613", color: "#fff", textTransform: "none", borderRadius: 8, px: 3, py: 1, fontWeight: 600, boxShadow: "none", "&:hover": { bgcolor: "#2a0f0d", boxShadow: "none" } }}
              >
                Edit Product
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: { xs: 4, md: 8 } }}>
        <Grid container spacing={{ xs: 4, md: 8 }}>
          {/* Left Column: Image Gallery */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, position: { md: "sticky" }, top: { md: 100 }, width: "100%" }}>
              <Box sx={{ width: "100%", height: { xs: 350, md: 450, lg: 550 }, borderRadius: 4, overflow: "hidden", bgcolor: "#f8f9fa", border: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}>
                {(mainImage || product.image) ? (
                  <img src={mainImage || product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                ) : (
                  <Typography color="text.disabled">No Image Available</Typography>
                )}
              </Box>

              {/* Thumbnails */}
              {(product.gallery?.length > 0 || (isVariant && product.image)) && (
                <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 1, "&::-webkit-scrollbar": { height: 6 }, "&::-webkit-scrollbar-thumb": { bgcolor: "#e0e0e0", borderRadius: 4 } }}>
                  {product.image && (
                    <Box
                      onClick={() => setMainImage(product.image)}
                      sx={{ minWidth: 80, width: 80, height: 80, borderRadius: 2, overflow: "hidden", cursor: "pointer", flexShrink: 0, border: (mainImage || product.image) === product.image ? "2px solid #3D1613" : "2px solid transparent", opacity: (mainImage || product.image) === product.image ? 1 : 0.6, transition: "all 0.2s" }}
                    >
                      <img src={product.image} alt="Main thumbnail" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </Box>
                  )}
                  {product.gallery?.map((img) => (
                    <Box
                      key={`gallery-${img.id}`}
                      onClick={() => setMainImage(img.image)}
                      sx={{ minWidth: 80, width: 80, height: 80, borderRadius: 2, overflow: "hidden", cursor: "pointer", flexShrink: 0, border: (mainImage || product.image) === img.image ? "2px solid #3D1613" : "2px solid transparent", opacity: (mainImage || product.image) === img.image ? 1 : 0.6, transition: "all 0.2s" }}
                    >
                      <img src={img.image} alt="Gallery thumbnail" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Grid>

          {/* Right Column: Pricing & Configurations */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", flexDirection: "column", height: "100%", pr: { md: 4 } }}>
              
              <Box sx={{ mb: 5 }}>
                <Typography variant="h3" sx={{ fontWeight: 800, color: "#111", letterSpacing: "-0.03em" }}>
                  ${product.price}
                </Typography>
                {product.supplier_cost && (
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                    Supplier Cost: <span style={{ color: "#d32f2f", fontWeight: 500 }}>${product.supplier_cost}</span>
                  </Typography>
                )}
              </Box>

              <Divider sx={{ mb: 5, borderColor: "#eaeaea" }} />

              {/* Physical Details */}
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 6, mb: 5 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Weight</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>{product.weight} kg</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Dimensions</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>{product.length} × {product.width} × {product.height} cm</Typography>
                </Box>
                {isFineArt && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Stock</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5, color: product.stock > 0 ? "#137333" : "#d32f2f" }}>{product.stock} units</Typography>
                  </Box>
                )}
              </Box>

              {/* Configurations for Variant */}
              {isVariant && product.variants && product.variants.length > 0 && (
                <Box sx={{ mb: 5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "#111" }}>Variants</Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {product.variants.map((v) => (
                      <Box key={v.id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", p: 2, borderRadius: 2, bgcolor: "#f8f9fa", border: "1px solid #f0f0f0" }}>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block" }}>SKU: {v.sku}</Typography>
                          <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                            {v.options.map((opt) => (
                              <Typography key={opt.id} variant="body1" sx={{ fontWeight: 600, color: "#333" }}>
                                {opt.option_value}
                              </Typography>
                            ))}
                          </Box>
                          {v.images && v.images.length > 0 && (
                            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mt: 1.5 }}>
                              {v.images.map(img => (
                                <Box
                                  key={`var-img-${img.id}`}
                                  onClick={() => setMainImage(img.image)}
                                  sx={{ width: 72, height: 72, borderRadius: 2, overflow: "hidden", cursor: "pointer", border: (mainImage || product.image) === img.image ? "2px solid #3D1613" : "1px solid #ddd", opacity: (mainImage || product.image) === img.image ? 1 : 0.6, transition: "all 0.2s", flexShrink: 0, bgcolor: "#fff" }}
                                >
                                  <img src={img.image} style={{ width: "100%", height: "100%", objectFit: "contain" }} alt="Variant thumbnail" />
                                </Box>
                              ))}
                            </Box>
                          )}
                        </Box>
                        <Box sx={{ textAlign: "right" }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: v.stock > 0 ? "#137333" : "#d32f2f", bgcolor: v.stock > 0 ? "#e6f4ea" : "#fce8e6", px: 1.5, py: 0.5, borderRadius: 1, display: "inline-block" }}>
                            {v.stock} in stock
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Configurations for Fine Art */}
              {isFineArt && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5, mb: 5 }}>
                  {product.sizes?.length > 0 && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.05em", mb: 1, display: "block" }}>Sizes</Typography>
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {product.sizes.map((size) => (
                          <Chip key={size.id} label={`${size.size} (+$${size.price})`} variant="outlined" sx={{ borderRadius: 1.5, borderColor: "#ddd", color: "#333", fontWeight: 500 }} />
                        ))}
                      </Box>
                    </Box>
                  )}
                  {product.colors?.length > 0 && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.05em", mb: 1, display: "block" }}>Colors</Typography>
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {product.colors.map((color) => (
                          <Chip key={color.id} avatar={color.image ? <Avatar src={color.image} /> : null} label={color.color_name} variant="outlined" sx={{ borderRadius: 1.5, borderColor: "#ddd", color: "#333", fontWeight: 500 }} />
                        ))}
                      </Box>
                    </Box>
                  )}
                  {product.frames?.length > 0 && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.05em", mb: 1, display: "block" }}>Frames</Typography>
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {product.frames.map((frame) => (
                          <Chip key={frame.id} avatar={frame.image ? <Avatar src={frame.image} /> : null} label={`${frame.name} (+$${frame.extra_price})`} variant="outlined" sx={{ borderRadius: 1.5, borderColor: "#ddd", color: "#333", fontWeight: 500 }} />
                        ))}
                      </Box>
                    </Box>
                  )}
                  {product.materials?.length > 0 && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.05em", mb: 1, display: "block" }}>Materials</Typography>
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {product.materials.map((mat) => (
                          <Chip key={mat.id} label={`${mat.name} (+$${mat.extra_price})`} variant="outlined" sx={{ borderRadius: 1.5, borderColor: "#ddd", color: "#333", fontWeight: 500 }} />
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              )}

            </Box>
          </Grid>
        </Grid>

        {/* Bottom Section: Tabs */}
        <Box sx={{ mt: { xs: 4, md: 8 } }}>
          <Box sx={{ borderBottom: 1, borderColor: "#eaeaea" }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              aria-label="product details tabs"
              TabIndicatorProps={{ style: { backgroundColor: "#3D1613", height: 2 } }}
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontSize: "1.05rem",
                  fontWeight: 500,
                  color: "#888",
                  minWidth: "auto",
                  mr: { xs: 2, md: 6 },
                  p: 0,
                  pb: 1.5,
                  "&.Mui-selected": {
                    color: "#3D1613",
                    fontWeight: 600,
                  }
                }
              }}
            >
              <Tab label="Description" id="simple-tab-0" aria-controls="simple-tabpanel-0" />
              <Tab label="Specifications" id="simple-tab-1" aria-controls="simple-tabpanel-1" />
              <Tab label="Supplier Info" id="simple-tab-2" aria-controls="simple-tabpanel-2" />
            </Tabs>
          </Box>
          
          <TabPanel value={activeTab} index={0}>
            <Box sx={{ maxWidth: "800px" }}>
              {renderSpecsOrDesc(product.description, "No description provided.")}
            </Box>
          </TabPanel>
          
          <TabPanel value={activeTab} index={1}>
            <Box sx={{ maxWidth: "800px" }}>
              {renderSpecsOrDesc(product.specification, "No specifications provided.")}
            </Box>
          </TabPanel>
          
          <TabPanel value={activeTab} index={2}>
            {product.supplier ? (
               <List disablePadding sx={{ maxWidth: "500px" }}>
                 <ListItem disableGutters sx={{ py: 1.5, borderBottom: "1px solid #f0f0f0" }}>
                   <Typography variant="body2" sx={{ minWidth: 120, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em" }}>Name</Typography>
                   <Typography variant="body1" sx={{ fontWeight: 500, color: "#222" }}>{product.supplier.name}</Typography>
                 </ListItem>
                 <ListItem disableGutters sx={{ py: 1.5, borderBottom: "1px solid #f0f0f0" }}>
                   <Typography variant="body2" sx={{ minWidth: 120, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em" }}>Email</Typography>
                   <Typography variant="body1" sx={{ fontWeight: 500, color: "#222" }}>{product.supplier.email}</Typography>
                 </ListItem>
                 <ListItem disableGutters sx={{ py: 1.5, borderBottom: "1px solid #f0f0f0" }}>
                   <Typography variant="body2" sx={{ minWidth: 120, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em" }}>Phone</Typography>
                   <Typography variant="body1" sx={{ fontWeight: 500, color: "#222" }}>{product.supplier.phone}</Typography>
                 </ListItem>
                 <ListItem disableGutters sx={{ py: 1.5, borderBottom: "1px solid #f0f0f0" }}>
                   <Typography variant="body2" sx={{ minWidth: 120, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em" }}>WeChat</Typography>
                   <Typography variant="body1" sx={{ fontWeight: 500, color: "#222" }}>{product.supplier.wechat_id || "N/A"}</Typography>
                 </ListItem>
                 <ListItem disableGutters sx={{ py: 1.5 }}>
                   <Typography variant="body2" sx={{ minWidth: 120, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em" }}>Country</Typography>
                   <Typography variant="body1" sx={{ fontWeight: 500, color: "#222" }}>{product.supplier.country || "N/A"}</Typography>
                 </ListItem>
               </List>
            ) : (
              <Typography variant="body1" color="text.secondary">No supplier assigned.</Typography>
            )}
          </TabPanel>
        </Box>

      </Container>
    </Box>
  );
}
