import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  addProduct,
  updateProductNew,
  getCategories,
  getBrands,
  getSubCategories,
} from "../../api/api";
import { getApiErrorMessage } from "../../utils/apiError";

const DEFAULT_FORM_DATA = {
  name: "",
  category: "",
  subcategory: "",
  brand: "",
  price: "",
  description: "",
  stock: "",
  status: "In Stock",
  image: null,
  gallery: [],
  is_featured: false,
  is_best_seller: false,
};

export default function useProductForm({ open, onClose, onSuccess, initialData }) {
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [specs, setSpecs] = useState([{ key: "", value: "" }]);
  const [sizes, setSizes] = useState([{ size: "", price: "" }]);
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [galleryPreview, setGalleryPreview] = useState([]);

  useEffect(() => {
    const fetchLookups = async () => {
      try {
        const [catRes, brandRes, subCatRes] = await Promise.all([
          getCategories(),
          getBrands(),
          getSubCategories(),
        ]);

        setCategories(catRes.data.categories || []);
        setBrands(brandRes.data.brands || []);

        const subList =
          subCatRes.data.subcategories ||
          subCatRes.data.sub_categories ||
          (Array.isArray(subCatRes.data) ? subCatRes.data : []);
        setSubCategories(subList);
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Failed to load product form data"));
      }
    };

    if (open) fetchLookups();
  }, [open]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        category: initialData.category?.id || "",
        subcategory: initialData.subcategory?.id || "",
        brand: initialData.brand?.id || "",
        price: initialData.price || "",
        description: initialData.description || "",
        stock: initialData.stock || "",
        status: initialData.stock > 0 ? "In Stock" : "Out of Stock",
        image: null,
        gallery: [],
        is_featured: initialData.is_featured || false,
        is_best_seller: initialData.is_best_seller || false,
      });

      const existingSpec = initialData.specification;
      if (
        existingSpec &&
        typeof existingSpec === "object" &&
        Object.keys(existingSpec).length > 0
      ) {
        setSpecs(Object.entries(existingSpec).map(([key, value]) => ({ key, value: String(value) })));
      } else {
        setSpecs([{ key: "", value: "" }]);
      }

      const existingSizes = Array.isArray(initialData.sizes) ? initialData.sizes : [];
      if (existingSizes.length > 0) {
        setSizes(existingSizes.map((item) => ({ size: item.size || "", price: String(item.price || "") })));
      } else {
        setSizes([{ size: "", price: "" }]);
      }

      setPreview(initialData.image || null);
      setGalleryPreview(initialData.gallery || []);
    } else {
      setFormData(DEFAULT_FORM_DATA);
      setSpecs([{ key: "", value: "" }]);
      setSizes([{ size: "", price: "" }]);
      setPreview(null);
      setGalleryPreview([]);
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleFlag = (name, checked) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = (e) => {
    e.preventDefault();
    setPreview(null);
    setFormData((prev) => ({ ...prev, image: null }));
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setFormData((prev) => ({ ...prev, gallery: [...prev.gallery, ...files] }));
    setGalleryPreview((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))]);
    e.target.value = "";
  };

  const handleRemoveGalleryImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
    setGalleryPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const addSpecRow = () => {
    setSpecs((prev) => [...prev, { key: "", value: "" }]);
  };

  const updateSpecRow = (index, field, value) => {
    setSpecs((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };

  const removeSpecRow = (index) => {
    setSpecs((prev) => (prev.length === 1 ? [{ key: "", value: "" }] : prev.filter((_, i) => i !== index)));
  };

  const addSizeRow = () => {
    setSizes((prev) => [...prev, { size: "", price: "" }]);
  };

  const updateSizeRow = (index, field, value) => {
    setSizes((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };

  const removeSizeRow = (index) => {
    setSizes((prev) => (prev.length === 1 ? [{ size: "", price: "" }] : prev.filter((_, i) => i !== index)));
  };

  const specificationPayload = useMemo(() => {
    const specObj = {};
    specs.forEach(({ key, value }) => {
      if (key.trim()) specObj[key.trim()] = value;
    });
    return specObj;
  }, [specs]);

  const sizesPayload = useMemo(
    () =>
      sizes
        .filter((item) => item.size.trim() && item.price !== "")
        .map((item) => ({ size: item.size.trim(), price: item.price })),
    [sizes],
  );

  const handleSubmit = async () => {
    if (!formData.name || !formData.price) {
      toast.error("Name and Price are required");
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("name", formData.name);
    if (formData.category) data.append("category", formData.category);
    if (formData.subcategory) data.append("subcategory", formData.subcategory);
    if (formData.brand) data.append("brand", formData.brand);
    data.append("price", formData.price);
    data.append("description", formData.description);
    data.append("specification", JSON.stringify(specificationPayload));
    data.append("sizes", JSON.stringify(sizesPayload));
    data.append("stock", formData.stock);
    data.append("is_featured", formData.is_featured);
    data.append("is_best_seller", formData.is_best_seller);
    if (formData.image) data.append("image", formData.image);
    formData.gallery.forEach((file) => data.append("images", file));

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
      toast.error(getApiErrorMessage(error, "Failed to save product"));
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    specs,
    sizes,
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
    handleSubmit,
  };
}
