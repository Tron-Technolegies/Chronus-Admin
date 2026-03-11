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
import useProductForm from "../../hooks/products/useProductForm";

export default function ProductModal({ open, onClose, onSuccess, initialData }) {
  const {
    formData,
    specs,
    sizes,
    colors,
    preview,
    categories,
    brands,
    subCategories,
    loading,
    galleryPreview,
    handleChange,
    handleToggleFlag,
    handleImageChange,
    handleRemoveImage,
    handleGalleryChange,
    handleRemoveGalleryImage,
    addSpecRow,
    updateSpecRow,
    removeSpecRow,
    addSizeRow,
    updateSizeRow,
    removeSizeRow,
    addColorRow,
    updateColorRow,
    updateColorImage,
    removeColorRow,
    clearColorImage,
    handleSubmit,
  } = useProductForm({ open, onClose, onSuccess, initialData });

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
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2, pt: 1 }}>
        <Typography variant="h5" sx={{ fontFamily: "serif", fontWeight: 500 }}>
          {initialData ? "Edit Product" : "Add New Product"}
        </Typography>
        <IconButton onClick={onClose}>
          <IoClose />
        </IconButton>
      </Box>

      <DialogContent sx={{ mt: 1 }}>
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

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#333" }}>Specifications</Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={addSpecRow}
              sx={{
                textTransform: "none",
                borderColor: "#3D1613",
                color: "#3D1613",
                fontSize: "0.75rem",
                px: 1.5,
                "&:hover": { bgcolor: "#f9eded", borderColor: "#3D1613" },
              }}
            >
              + Add Specification
            </Button>
          </Box>

          {specs.map((spec, index) => (
            <Box
              key={index}
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 1, mb: 1, alignItems: "center" }}
            >
              <TextField
                placeholder="Key (e.g. Material)"
                size="small"
                value={spec.key}
                onChange={(e) => updateSpecRow(index, "key", e.target.value)}
                sx={inputStyles}
              />
              <TextField
                placeholder="Value (e.g. Steel)"
                size="small"
                value={spec.value}
                onChange={(e) => updateSpecRow(index, "value", e.target.value)}
                sx={inputStyles}
              />
              <IconButton
                size="small"
                onClick={() => removeSpecRow(index)}
                sx={{
                  bgcolor: "#fdecea",
                  color: "#c62828",
                  "&:hover": { bgcolor: "#ffcdd2" },
                  width: 32,
                  height: 32,
                }}
              >
                <IoClose size={14} />
              </IconButton>
            </Box>
          ))}
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#333" }}>Sizes</Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={addSizeRow}
              sx={{
                textTransform: "none",
                borderColor: "#3D1613",
                color: "#3D1613",
                fontSize: "0.75rem",
                px: 1.5,
                "&:hover": { bgcolor: "#f9eded", borderColor: "#3D1613" },
              }}
            >
              + Add Size
            </Button>
          </Box>

          {sizes.map((item, index) => (
            <Box
              key={index}
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 1, mb: 1, alignItems: "center" }}
            >
              <TextField
                placeholder="Size (e.g. 12x18)"
                size="small"
                value={item.size}
                onChange={(e) => updateSizeRow(index, "size", e.target.value)}
                sx={inputStyles}
              />
              <TextField
                placeholder="Price"
                size="small"
                type="number"
                value={item.price}
                onChange={(e) => updateSizeRow(index, "price", e.target.value)}
                sx={inputStyles}
              />
              <IconButton
                size="small"
                onClick={() => removeSizeRow(index)}
                sx={{
                  bgcolor: "#fdecea",
                  color: "#c62828",
                  "&:hover": { bgcolor: "#ffcdd2" },
                  width: 32,
                  height: 32,
                }}
              >
                <IoClose size={14} />
              </IconButton>
            </Box>
          ))}
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#333" }}>Colors</Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={addColorRow}
              sx={{
                textTransform: "none",
                borderColor: "#3D1613",
                color: "#3D1613",
                fontSize: "0.75rem",
                px: 1.5,
                "&:hover": { bgcolor: "#f9eded", borderColor: "#3D1613" },
              }}
            >
              + Add Color
            </Button>
          </Box>

          {colors.map((item, index) => (
            <Box
              key={index}
              sx={{
                border: "1px solid #eee",
                borderRadius: 2,
                p: 1.25,
                mb: 1,
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 1,
                alignItems: "start",
              }}
            >
              <TextField
                placeholder="Color name (e.g. Midnight Black)"
                size="small"
                value={item.color_name}
                onChange={(e) => updateColorRow(index, e.target.value)}
                sx={inputStyles}
              />

              <IconButton
                size="small"
                onClick={() => removeColorRow(index)}
                sx={{
                  bgcolor: "#fdecea",
                  color: "#c62828",
                  "&:hover": { bgcolor: "#ffcdd2" },
                  width: 32,
                  height: 32,
                }}
              >
                <IoClose size={14} />
              </IconButton>

              <Box sx={{ gridColumn: "1 / -1", display: "flex", gap: 1.5, alignItems: "center" }}>
                <Button
                  component="label"
                  size="small"
                  variant="outlined"
                  sx={{
                    textTransform: "none",
                    borderColor: "#ccc",
                    color: "#333",
                    minWidth: 120,
                  }}
                >
                  Upload Color Image
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(e) => updateColorImage(index, e.target.files?.[0])}
                  />
                </Button>

                {item.preview ? (
                  <>
                    <Box
                      component="img"
                      src={item.preview}
                      alt={item.color_name || `Color ${index + 1}`}
                      sx={{
                        width: 44,
                        height: 44,
                        objectFit: "cover",
                        borderRadius: 1,
                        border: "1px solid #ddd",
                      }}
                    />
                    <Button
                      size="small"
                      color="error"
                      onClick={() => clearColorImage(index)}
                      sx={{ textTransform: "none", minWidth: 40 }}
                    >
                      Remove
                    </Button>
                  </>
                ) : (
                  <Typography variant="caption" color="textSecondary">
                    Optional image
                  </Typography>
                )}
              </Box>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.is_featured}
                onChange={(e) => handleToggleFlag("is_featured", e.target.checked)}
                sx={{ color: "#3D1613", "&.Mui-checked": { color: "#3D1613" } }}
              />
            }
            label={<Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#333" }}>Featured</Typography>}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.is_best_seller}
                onChange={(e) => handleToggleFlag("is_best_seller", e.target.checked)}
                sx={{ color: "#3D1613", "&.Mui-checked": { color: "#3D1613" } }}
              />
            }
            label={<Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#333" }}>Best Seller</Typography>}
          />
        </Box>

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
            {preview && (
              <IconButton
                size="small"
                onClick={handleRemoveImage}
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
            <input type="file" hidden accept="image/*" multiple onChange={handleGalleryChange} />

            {galleryPreview.length === 0 ? (
              <>
                <IoCloudUploadOutline size={28} color="#999" />
                <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                  Click to add gallery images
                </Typography>
              </>
            ) : (
              <>
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
