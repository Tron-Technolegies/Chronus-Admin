import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { IoClose, IoCloudUploadOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { addProduct, updateProductNew, getCategories, getBrands, getSubCategories } from "../../api/api";

export default function ProductModal({ open, onClose, onSuccess, initialData }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    subcategory: "",
    brand: "",
    price: "",
    description: "",
    specification: "",
    stock: "",
    status: "In Stock",
    image: null,
    gallery: [],
    is_featured: false,
    is_best_seller: false,
  });
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [galleryPreview, setGalleryPreview] = useState([]);

  // Append newly selected files to existing gallery
  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, gallery: [...prev.gallery, ...files] }));
    setGalleryPreview((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
    // Reset input so same file can be re-added if needed
    e.target.value = "";
  };

  // Remove a single gallery image by index
  const handleRemoveGalleryImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
    setGalleryPreview((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          getCategories(),
          getBrands(),
        ]);
        setCategories(catRes.data.categories || []);
        setBrands(brandRes.data.brands || []);
      } catch (error) {
        console.error("Failed to fetch categories/brands", error);
      }
      try {
        const subCatRes = await getSubCategories();
        console.log("SubCategories API response:", subCatRes.data);
        const subList =
          subCatRes.data.subcategories ||
          subCatRes.data.sub_categories ||
          (Array.isArray(subCatRes.data) ? subCatRes.data : []);
        setSubCategories(subList);
      } catch (error) {
        console.error("SubCategories fetch error:", error);
      }
    };
    if (open) fetchData();
  }, [open]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        category: initialData.category?.id || "",
        subcategory: initialData.subcategory?.id || "",
        brand: initialData.brand?.id || "",
        price: initialData.price,
        description: initialData.description,
        specification: initialData.specification || "",
        stock: initialData.stock,
        status: initialData.stock > 0 ? "In Stock" : "Out of Stock",
        image: null,
        gallery: [],
        is_featured: initialData.is_featured || false,
        is_best_seller: initialData.is_best_seller || false,
      });
      setPreview(initialData.image);
      setGalleryPreview(initialData.gallery || []);
    } else {
      setFormData({
        name: "",
        category: "",
        subcategory: "",
        brand: "",
        price: "",
        description: "",
        specification: "",
        stock: "",
        status: "In Stock",
        image: null,
        gallery: [],
        is_featured: false,
        is_best_seller: false,
      });
      setPreview(null);
      setGalleryPreview([]);
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price) {
      return toast.error("Name and Price are required");
    }
    setLoading(true);
    const data = new FormData();
    data.append("name", formData.name);
    if (formData.category) data.append("category", formData.category);
    if (formData.subcategory) data.append("subcategory", formData.subcategory);
    if (formData.brand) data.append("brand", formData.brand);
    data.append("price", formData.price);
    data.append("description", formData.description);
    data.append("specification", formData.specification);
    data.append("stock", formData.stock);
    data.append("is_featured", formData.is_featured);
    data.append("is_best_seller", formData.is_best_seller);
    if (formData.image) data.append("image", formData.image);
    formData.gallery.forEach((file) => {
      data.append("images", file);
    });
    try {
      if (initialData) {
        await updateProductNew(initialData.id, data);
        toast.success("Product updated successfully");
      } else {
        await addProduct(data);
        toast.success("Product added successfully");
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = {
    "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#fff" },
    "& .MuiInputLabel-root": { color: "#666" },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2, pt: 1 }}>
        <Typography variant="h5" sx={{ fontFamily: "serif", fontWeight: 500 }}>
          {initialData ? "Edit Product" : "Add New Product"}
        </Typography>
        <IconButton onClick={onClose}>
          <IoClose />
        </IconButton>
      </Box>

      <DialogContent sx={{ mt: 1 }}>
        {/* Product Name */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: "#333" }}>
            Product Name
          </Typography>
          <TextField
            placeholder="e.g. Royal Chronograph"
            name="name"
            fullWidth
            value={formData.name}
            onChange={handleChange}
            sx={inputStyles}
          />
        </Box>

        {/* Category + Brand */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: "#333" }}>
              Category
            </Typography>
            <FormControl fullWidth>
              <Select name="category" value={formData.category} onChange={handleChange} displayEmpty sx={{ borderRadius: 2 }}>
                <MenuItem value="" disabled>Select Category</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: "#333" }}>
              Brand
            </Typography>
            <FormControl fullWidth>
              <Select name="brand" value={formData.brand} onChange={handleChange} displayEmpty sx={{ borderRadius: 2 }}>
                <MenuItem value="" disabled>Select Brand</MenuItem>
                {brands.map((brand) => (
                  <MenuItem key={brand.id} value={brand.id}>{brand.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Sub Category */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: "#333" }}>
            Sub Category
          </Typography>
          <FormControl fullWidth>
            <Select name="subcategory" value={formData.subcategory} onChange={handleChange} displayEmpty sx={{ borderRadius: 2 }}>
              <MenuItem value="">None</MenuItem>
              {subCategories.map((sc) => (
                <MenuItem key={sc.id} value={sc.id}>{sc.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Price + Stock */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: "#333" }}>Price</Typography>
            <TextField placeholder="$0.00" name="price" type="number" fullWidth value={formData.price} onChange={handleChange} sx={inputStyles} />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: "#333" }}>Stock</Typography>
            <TextField placeholder="0" name="stock" type="number" fullWidth value={formData.stock} onChange={handleChange} sx={inputStyles} />
          </Box>
        </Box>

        {/* Description */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: "#333" }}>Description</Typography>
          <TextField
            placeholder="Product description..."
            name="description"
            multiline
            rows={3}
            fullWidth
            value={formData.description}
            onChange={handleChange}
            sx={inputStyles}
          />
        </Box>

        {/* Specification */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: "#333" }}>Specification</Typography>
          <TextField
            placeholder="e.g. Material: Steel, Diameter: 42mm, Water resistance: 100m..."
            name="specification"
            multiline
            rows={3}
            fullWidth
            value={formData.specification}
            onChange={handleChange}
            sx={inputStyles}
          />
        </Box>

        {/* Featured & Best Seller */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.is_featured}
                onChange={(e) => setFormData((prev) => ({ ...prev, is_featured: e.target.checked }))}
                sx={{ color: "#3D1613", "&.Mui-checked": { color: "#3D1613" } }}
              />
            }
            label={<Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#333" }}>Featured</Typography>}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.is_best_seller}
                onChange={(e) => setFormData((prev) => ({ ...prev, is_best_seller: e.target.checked }))}
                sx={{ color: "#3D1613", "&.Mui-checked": { color: "#3D1613" } }}
              />
            }
            label={<Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#333" }}>Best Seller</Typography>}
          />
        </Box>

        {/* Main Image Upload */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: "#333" }}>
            Product Image
          </Typography>
          <Box sx={{ position: "relative" }}>
            <Box
              component="label"
              sx={{
                border: "2px dashed #ccc",
                borderRadius: 3,
                height: 150,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                bgcolor: "#FAFAFA",
                "&:hover": { bgcolor: "#F0F0F0", borderColor: "#999" },
              }}
            >
              <input type="file" hidden accept="image/*" onChange={handleImageChange} />
              {preview ? (
                <Box
                  component="img"
                  src={preview}
                  alt="Preview"
                  sx={{ width: "100%", height: "100%", objectFit: "contain", p: 1, borderRadius: 3 }}
                />
              ) : (
                <>
                  <IoCloudUploadOutline size={32} color="#666" />
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    Click to upload image
                  </Typography>
                </>
              )}
            </Box>
            {/* Remove / Change image button */}
            {preview && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.preventDefault();
                  setPreview(null);
                  setFormData((prev) => ({ ...prev, image: null }));
                }}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  width: 24,
                  height: 24,
                  bgcolor: "#3D1613",
                  color: "#fff",
                  "&:hover": { bgcolor: "#5c2420" },
                }}
              >
                <IoClose size={13} />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Gallery Images */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: "#333" }}>
            Gallery Images
          </Typography>

          <Box
            component="label"
            sx={{
              border: "2px dashed #ccc",
              borderRadius: 3,
              minHeight: 90,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              bgcolor: "#FAFAFA",
              p: galleryPreview.length > 0 ? 1.5 : 2,
              "&:hover": { bgcolor: "#F0F0F0", borderColor: "#999" },
            }}
          >
            <input
              type="file"
              hidden
              accept="image/*"
              multiple
              onChange={handleGalleryChange}
            />

            {galleryPreview.length === 0 ? (
              <>
                <IoCloudUploadOutline size={28} color="#999" />
                <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                  Click to add gallery images
                </Typography>
              </>
            ) : (
              <>
                {/* Thumbnail row */}
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, width: "100%", mb: 1 }}>
                  {galleryPreview.map((src, i) => (
                    <Box
                      key={i}
                      sx={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}
                      onClick={(e) => e.preventDefault()}
                    >
                      <Box
                        component="img"
                        src={src}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: 2,
                          border: "1px solid #e0e0e0",
                        }}
                      />
                      {/* Remove button */}
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemoveGalleryImage(i);
                        }}
                        sx={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          width: 20,
                          height: 20,
                          bgcolor: "#3D1613",
                          color: "#fff",
                          "&:hover": { bgcolor: "#5c2420" },
                        }}
                      >
                        <IoClose size={11} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
                <Typography variant="caption" color="textSecondary">
                  + Click to add more images
                </Typography>
              </>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onClose}
          color="inherit"
          sx={{ textTransform: "none", fontSize: "1rem", color: "#555" }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{
            bgcolor: "#3D1613",
            color: "#F5F5F3",
            textTransform: "none",
            fontSize: "1rem",
            px: 4,
            py: 1,
            borderRadius: 2,
            "&:hover": { bgcolor: "#2a0f0d" },
          }}
        >
          {loading ? "Saving..." : initialData ? "Update Product" : "Create Product"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
