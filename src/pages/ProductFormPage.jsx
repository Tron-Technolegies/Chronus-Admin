import {
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
  OutlinedInput,
} from "@mui/material";
import { IoClose, IoCloudUploadOutline, IoArrowBack } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import useProductForm from "../hooks/products/useProductForm";

export default function ProductFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialData = location.state?.editData || null;

  const handleClose = () => {
    navigate("/products");
  };

  const {
    formData,
    specs,
    sizes,
    colors,
    selectedFrameIds,
    selectedMaterialIds,
    preview,
    categories,
    brands,
    subCategories,
    frames,
    materials,
    suppliers,
    loading,
    galleryPreview,
    variants,
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
    setSelectedFrameIds,
    setSelectedMaterialIds,
    addVariant,
    updateVariant,
    removeVariant,
    addVariantOption,
    updateVariantOption,
    removeVariantOption,
    handleVariantImagesChange,
    handleRemoveVariantImage,
    handleSubmit,
  } = useProductForm({ open: true, onClose: handleClose, onSuccess: handleClose, initialData });

  const renderSelectedNames = (selectedIds, options, emptyLabel) => {
    if (!selectedIds.length) return emptyLabel;

    const labelMap = new Map(options.map((option) => [String(option.id), option.name]));
    return selectedIds.map((id) => labelMap.get(String(id)) || `#${id}`).join(", ");
  };

  const inputStyles = {
    "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#fff" },
    "& .MuiInputLabel-root": { color: "#666" },
  };

  const selectedCategoryObj = categories.find((c) => String(c.id) === String(formData.category));
  const catName = selectedCategoryObj?.name?.toLowerCase() || "";

  const isArt = catName.includes("art");

  const showColors = isArt;
  const showSizes = formData.category !== ""; // Enable sizes for all selected categories
  const showFrames = isArt;
  const showMaterials = isArt;
  const showVariants = !isArt && formData.category !== ""; // Only show after category is selected

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={handleClose} sx={{ mr: 1, bgcolor: "#f5f5f5", "&:hover": { bgcolor: "#e0e0e0" } }}>
          <IoArrowBack />
        </IconButton>
        <Typography variant="h5" sx={{ fontFamily: "serif", fontWeight: 600 }}>
          {initialData ? "Edit Product" : "Add New Product"}
        </Typography>
      </Box>

      <Box sx={{ bgcolor: "#fff", p: { xs: 3, md: 4 }, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
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

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
          <Box>
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
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: "#333" }}>
              Supplier
            </Typography>
            <FormControl fullWidth>
              <Select name="supplier" value={formData.supplier} onChange={handleChange} displayEmpty sx={{ borderRadius: 2 }}>
                <MenuItem value="">None</MenuItem>
                {suppliers.map((sup) => (
                  <MenuItem key={sup.id} value={sup.id}>{sup.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {(showFrames || showMaterials) && (
          <Box sx={{ display: "grid", gridTemplateColumns: (showFrames && showMaterials) ? "1fr 1fr" : "1fr", gap: 2, mb: 2 }}>
            {showFrames && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: "#333" }}>
                  Frames
                </Typography>
                <FormControl fullWidth>
                  <Select
                    multiple
                    displayEmpty
                    value={selectedFrameIds}
                    onChange={(e) => setSelectedFrameIds(e.target.value)}
                    input={<OutlinedInput sx={{ borderRadius: 2, bgcolor: "#fff" }} />}
                    renderValue={(selected) =>
                      renderSelectedNames(selected, frames, "Select frames")
                    }
                  >
                    {frames.map((frame) => (
                      <MenuItem key={frame.id} value={String(frame.id)}>
                        {frame.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}

            {showMaterials && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: "#333" }}>
                  Materials
                </Typography>
                <FormControl fullWidth>
                  <Select
                    multiple
                    displayEmpty
                    value={selectedMaterialIds}
                    onChange={(e) => setSelectedMaterialIds(e.target.value)}
                    input={<OutlinedInput sx={{ borderRadius: 2, bgcolor: "#fff" }} />}
                    renderValue={(selected) =>
                      renderSelectedNames(selected, materials, "Select materials")
                    }
                  >
                    {materials.map((material) => (
                      <MenuItem key={material.id} value={String(material.id)}>
                        {material.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}
          </Box>
        )}

        <Box sx={{ display: "grid", gridTemplateColumns: isArt ? "1fr 1fr 1fr" : "1fr 1fr", gap: 2, mb: 2 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: "#333" }}>Price</Typography>
            <TextField placeholder="$0.00" name="price" type="number" fullWidth value={formData.price} onChange={handleChange} sx={inputStyles} />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: "#333" }}>Cost Price</Typography>
            <TextField placeholder="$0.00" name="supplier_cost" type="number" fullWidth value={formData.supplier_cost} onChange={handleChange} sx={inputStyles} />
          </Box>
          {isArt && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: "#333" }}>Stock</Typography>
              <TextField placeholder="0" name="stock" type="number" fullWidth value={formData.stock} onChange={handleChange} sx={inputStyles} />
            </Box>
          )}
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "#333" }}>DHL Shipping Dimensions</Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 2 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: "#333" }}>Weight (kg)</Typography>
              <TextField placeholder="0.00" name="weight" type="number" inputProps={{ step: "0.01", min: "0" }} fullWidth value={formData.weight} onChange={handleChange} sx={inputStyles} />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: "#333" }}>Length (cm)</Typography>
              <TextField placeholder="0.00" name="length" type="number" inputProps={{ step: "0.01", min: "0" }} fullWidth value={formData.length} onChange={handleChange} sx={inputStyles} />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: "#333" }}>Width (cm)</Typography>
              <TextField placeholder="0.00" name="width" type="number" inputProps={{ step: "0.01", min: "0" }} fullWidth value={formData.width} onChange={handleChange} sx={inputStyles} />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: "#333" }}>Height (cm)</Typography>
              <TextField placeholder="0.00" name="height" type="number" inputProps={{ step: "0.01", min: "0" }} fullWidth value={formData.height} onChange={handleChange} sx={inputStyles} />
            </Box>
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

        {showSizes && (
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
        )}

        {showColors && (
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
        )}

        {showVariants && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#333" }}>Product Variants</Typography>
              <Button
                size="small"
                variant="outlined"
                onClick={addVariant}
                sx={{
                  textTransform: "none",
                  borderColor: "#3D1613",
                  color: "#3D1613",
                  fontSize: "0.75rem",
                  px: 1.5,
                  "&:hover": { bgcolor: "#f9eded", borderColor: "#3D1613" },
                }}
              >
                + Add Variant
              </Button>
            </Box>

            {variants.map((variant, vIndex) => (
              <Box
                key={vIndex}
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: 2,
                  p: 2,
                  mb: 2,
                  bgcolor: "#fafafa"
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Variant #{vIndex + 1}</Typography>
                  <IconButton
                    size="small"
                    onClick={() => removeVariant(vIndex)}
                    sx={{ bgcolor: "#fdecea", color: "#c62828", "&:hover": { bgcolor: "#ffcdd2" }, width: 28, height: 28 }}
                  >
                    <IoClose size={14} />
                  </IconButton>
                </Box>
                
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
                  <TextField
                    placeholder="SKU"
                    size="small"
                    label="SKU"
                    value={variant.sku}
                    onChange={(e) => updateVariant(vIndex, "sku", e.target.value)}
                    sx={inputStyles}
                  />
                  <TextField
                    placeholder="Stock"
                    size="small"
                    label="Stock"
                    type="number"
                    value={variant.stock}
                    onChange={(e) => updateVariant(vIndex, "stock", e.target.value)}
                    sx={inputStyles}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, mb: 1, display: "block" }}>Options (e.g. Size: M, Color: Red)</Typography>
                  {variant.options.map((opt, oIndex) => (
                    <Box key={oIndex} sx={{ display: "flex", gap: 1, mb: 1, alignItems: "center" }}>
                      <TextField
                        placeholder="Option Name"
                        size="small"
                        value={opt.option_name}
                        onChange={(e) => updateVariantOption(vIndex, oIndex, "option_name", e.target.value)}
                        sx={{ ...inputStyles, flex: 1 }}
                      />
                      <TextField
                        placeholder="Option Value"
                        size="small"
                        value={opt.option_value}
                        onChange={(e) => updateVariantOption(vIndex, oIndex, "option_value", e.target.value)}
                        sx={{ ...inputStyles, flex: 1 }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => removeVariantOption(vIndex, oIndex)}
                        sx={{ color: "#c62828" }}
                      >
                        <IoClose size={14} />
                      </IconButton>
                    </Box>
                  ))}
                  <Button size="small" onClick={() => addVariantOption(vIndex)} sx={{ textTransform: "none", p: 0 }}>
                    + Add Option
                  </Button>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 600, mb: 1, display: "block" }}>Variant Images</Typography>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
                    <Button
                      component="label"
                      size="small"
                      variant="outlined"
                      sx={{ textTransform: "none", minWidth: 120, height: 64, borderStyle: "dashed" }}
                    >
                      <IoCloudUploadOutline size={20} style={{ marginRight: 8 }} />
                      Upload
                      <input
                        hidden
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleVariantImagesChange(vIndex, e)}
                      />
                    </Button>
                    
                    {variant.images_preview.map((src, iIndex) => {
                      const isExisting = iIndex < variant.existing_images.length;
                      return (
                        <Box key={iIndex} sx={{ position: "relative", width: 64, height: 64 }}>
                          <Box
                            component="img"
                            src={src}
                            sx={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 1, border: "1px solid #ddd" }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveVariantImage(vIndex, iIndex, isExisting)}
                            sx={{
                              position: "absolute", top: -8, right: -8, width: 20, height: 20,
                              bgcolor: "#3D1613", color: "#fff", "&:hover": { bgcolor: "#5c2420" }
                            }}
                          >
                            <IoClose size={11} />
                          </IconButton>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        )}

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.is_published}
                onChange={(e) => handleToggleFlag("is_published", e.target.checked)}
                sx={{ color: "#3D1613", "&.Mui-checked": { color: "#3D1613" } }}
              />
            }
            label={<Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#333" }}>Published</Typography>}
          />
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
      </Box>

      <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button
          onClick={handleClose}
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
      </Box>
    </Box>
  );
}
