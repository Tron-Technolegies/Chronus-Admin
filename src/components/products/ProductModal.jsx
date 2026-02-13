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
  IconButton
} from "@mui/material";
import { IoClose, IoCloudUploadOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import {
  addProduct,
  updateProductNew,
  getCategories,
  getBrands,
} from "../../api/api";

export default function ProductModal({ open, onClose, onSuccess, initialData }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    brand: "",
    price: "",
    description: "",
    stock: "",
    status: "In Stock", // Added for UI completeness, maps to stock logic basically
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          getCategories(),
          getBrands(),
        ]);
        setCategories(catRes.data);
        setBrands(brandRes.data);
      } catch (error) {
        console.error("Failed to fetch dropdown data");
      }
    };
    if (open) fetchData();
  }, [open]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        category: initialData.category, 
        brand: initialData.brand,
        price: initialData.price,
        description: initialData.description,
        stock: initialData.stock,
        status: initialData.stock > 0 ? "In Stock" : "Out of Stock",
        image: null,
      });
      setPreview(initialData.image);
    } else {
      setFormData({
        name: "",
        category: "",
        brand: "",
        price: "",
        description: "",
        stock: "",
        status: "In Stock",
        image: null,
      });
      setPreview(null);
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
    if (formData.brand) data.append("brand", formData.brand);
    data.append("price", formData.price);
    data.append("description", formData.description);
    data.append("stock", formData.stock);
    if (formData.image) data.append("image", formData.image);

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
    '& .MuiOutlinedInput-root': {
        borderRadius: 2,
        bgcolor: '#fff'
    },
    '& .MuiInputLabel-root': {
        color: '#666'
    }
  };

  return (
    <Dialog 
        open={open} 
        onClose={onClose} 
        fullWidth 
        maxWidth="sm" // Matches the compact look of the image
        PaperProps={{
            sx: { borderRadius: 3, p: 1 }
        }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, pt: 1 }}>
          <Typography variant="h5" sx={{ fontFamily: 'serif', fontWeight: 500 }}>
            {initialData ? "Edit Product" : "Add New Product"}
          </Typography>
          <IconButton onClick={onClose}>
            <IoClose />
          </IconButton>
      </Box>

      <DialogContent sx={{ mt: 1 }}>
        
        {/* Product Name */}
        <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: '#333' }}>
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

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
            {/* Category */}
            <Box>
                <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: '#333' }}>
                    Category
                </Typography>
                <FormControl fullWidth>
                    <Select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        displayEmpty
                        sx={{ borderRadius: 2 }}
                    >
                        <MenuItem value="" disabled>Select Category</MenuItem>
                        {categories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                            {cat.name}
                        </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            
            {/* Brand - Adding Brand here to make it complete, although image likely showed Price next */}
             {/* OR Price to match image layout */}
             <Box>
                <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: '#333' }}>
                    Brand
                </Typography>
                 <FormControl fullWidth>
                    <Select
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        displayEmpty
                         sx={{ borderRadius: 2 }}
                    >
                         <MenuItem value="" disabled>Select Brand</MenuItem>
                        {brands.map((brand) => (
                        <MenuItem key={brand.id} value={brand.id}>
                            {brand.name}
                        </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
        </Box>

         <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
             {/* Price */}
             <Box>
                <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: '#333' }}>
                    Price
                </Typography>
                 <TextField
                    placeholder="$0.00"
                    name="price"
                    type="number"
                    fullWidth
                    value={formData.price}
                    onChange={handleChange}
                     sx={inputStyles}
                 />
             </Box>
            
            {/* Stock */}
            <Box>
                <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: '#333' }}>
                    Stock
                </Typography>
                <TextField
                    placeholder="0"
                    name="stock"
                    type="number"
                    fullWidth
                    value={formData.stock}
                    onChange={handleChange}
                    sx={inputStyles}
                />
            </Box>
        </Box>

        {/* Description */}
         <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: '#333' }}>
                Description
            </Typography>
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


        {/* Image Upload */}
        <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: '#333' }}>
                Product Image
            </Typography>
            <Box
                component="label"
                sx={{
                    border: '2px dashed #ccc',
                    borderRadius: 3,
                    height: 150,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    bgcolor: '#FAFAFA',
                    '&:hover': { bgcolor: '#F0F0F0', borderColor: '#999' }
                }}
            >
                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                
                {preview ? (
                     <Box
                        component="img"
                        src={preview}
                        alt="Preview"
                        sx={{ width: '100%', height: '100%', objectFit: 'contain', p: 1, borderRadius: 3 }}
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
        </Box>

      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
            onClick={onClose} 
            color="inherit" 
            sx={{ textTransform: 'none', fontSize: '1rem', color: '#555' }}
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
            textTransform: 'none',
            fontSize: '1rem',
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
