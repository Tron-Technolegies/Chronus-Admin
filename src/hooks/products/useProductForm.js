import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  addProduct,
  updateProductNew,
  getCategories,
  getBrands,
  getSubCategories,
  getFrames,
  getMaterials,
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

const EMPTY_SPEC_ROW = { key: "", value: "" };
const EMPTY_SIZE_ROW = { size: "", price: "" };
const EMPTY_COLOR_ROW = { color_name: "", image: null, preview: "" };

const normalizeRelationIds = (value) => {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (item && typeof item === "object") return item.id;
      return item;
    })
    .filter((item) => item !== null && item !== undefined && item !== "")
    .map((item) => String(item));
};

export default function useProductForm({ open, onClose, onSuccess, initialData }) {
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [specs, setSpecs] = useState([EMPTY_SPEC_ROW]);
  const [sizes, setSizes] = useState([EMPTY_SIZE_ROW]);
  const [colors, setColors] = useState([EMPTY_COLOR_ROW]);
  const [selectedFrameIds, setSelectedFrameIds] = useState([]);
  const [selectedMaterialIds, setSelectedMaterialIds] = useState([]);
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [frames, setFrames] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [galleryPreview, setGalleryPreview] = useState([]);

  useEffect(() => {
    const fetchLookups = async () => {
      try {
        const [catRes, brandRes, subCatRes, frameRes, materialRes] = await Promise.all([
          getCategories(),
          getBrands(),
          getSubCategories(),
          getFrames(),
          getMaterials(),
        ]);

        setCategories(catRes.data.categories || []);
        setBrands(brandRes.data.brands || []);

        const subList =
          subCatRes.data.subcategories ||
          subCatRes.data.sub_categories ||
          (Array.isArray(subCatRes.data) ? subCatRes.data : []);
        setSubCategories(subList);
        setFrames(Array.isArray(frameRes.data) ? frameRes.data : frameRes.data.frames || []);
        setMaterials(
          Array.isArray(materialRes.data) ? materialRes.data : materialRes.data.materials || [],
        );
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
        setSpecs(
          Object.entries(existingSpec).map(([key, value]) => ({ key, value: String(value) })),
        );
      } else {
        setSpecs([EMPTY_SPEC_ROW]);
      }

      const existingSizes = Array.isArray(initialData.sizes) ? initialData.sizes : [];
      if (existingSizes.length > 0) {
        setSizes(
          existingSizes.map((item) => ({ size: item.size || "", price: String(item.price || "") })),
        );
      } else {
        setSizes([EMPTY_SIZE_ROW]);
      }

      const existingColors = Array.isArray(initialData.colors) ? initialData.colors : [];
      if (existingColors.length > 0) {
        setColors(
          existingColors.map((item) => ({
            color_name: item.color_name || "",
            image: null,
            preview: item.image || "",
          })),
        );
      } else {
        setColors([EMPTY_COLOR_ROW]);
      }

      setSelectedFrameIds(normalizeRelationIds(initialData.frames));
      setSelectedMaterialIds(normalizeRelationIds(initialData.materials));
      setPreview(initialData.image || null);
      setGalleryPreview(initialData.gallery || []);
    } else {
      setFormData(DEFAULT_FORM_DATA);
      setSpecs([EMPTY_SPEC_ROW]);
      setSizes([EMPTY_SIZE_ROW]);
      setColors([EMPTY_COLOR_ROW]);
      setSelectedFrameIds([]);
      setSelectedMaterialIds([]);
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
    setSpecs((prev) =>
      prev.length === 1 ? [EMPTY_SPEC_ROW] : prev.filter((_, i) => i !== index),
    );
  };

  const addSizeRow = () => {
    setSizes((prev) => [...prev, { size: "", price: "" }]);
  };

  const updateSizeRow = (index, field, value) => {
    setSizes((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };

  const removeSizeRow = (index) => {
    setSizes((prev) =>
      prev.length === 1 ? [EMPTY_SIZE_ROW] : prev.filter((_, i) => i !== index),
    );
  };

  const addColorRow = () => {
    setColors((prev) => [...prev, { color_name: "", image: null, preview: "" }]);
  };

  const updateColorRow = (index, value) => {
    setColors((prev) => prev.map((row, i) => (i === index ? { ...row, color_name: value } : row)));
  };

  const updateColorImage = (index, file) => {
    if (!file) return;
    const nextPreview = URL.createObjectURL(file);
    setColors((prev) =>
      prev.map((row, i) => (i === index ? { ...row, image: file, preview: nextPreview } : row)),
    );
  };

  const removeColorRow = (index) => {
    setColors((prev) =>
      prev.length === 1 ? [EMPTY_COLOR_ROW] : prev.filter((_, i) => i !== index),
    );
  };

  const clearColorImage = (index) => {
    setColors((prev) =>
      prev.map((row, i) => (i === index ? { ...row, image: null, preview: "" } : row)),
    );
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
        .map((item) => ({
          size: item.size.trim(),
          price: Number(item.price),
        })),
    [sizes],
  );

  const colorsPayload = useMemo(
    () =>
      colors
        .filter((item) => item.color_name.trim())
        .map((item) => ({ color_name: item.color_name.trim(), image: item.image })),
    [colors],
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
    data.append("price", Number(formData.price));
    data.append("description", formData.description);
    data.append("specification", JSON.stringify(specificationPayload));
    data.append("sizes", JSON.stringify(sizesPayload));
    data.append("colors", JSON.stringify(colorsPayload.map(({ color_name }) => ({ color_name }))));
    if (formData.stock !== "") data.append("stock", Number(formData.stock));
    data.append("is_featured", formData.is_featured);
    data.append("is_best_seller", formData.is_best_seller);
    data.append("frame_ids", JSON.stringify(selectedFrameIds));
    data.append("material_ids", JSON.stringify(selectedMaterialIds));

    if (formData.image) data.append("image", formData.image);
    formData.gallery.forEach((file) => data.append("images", file));
    colors.forEach((color, index) => {
      if (color.image) {
        data.append(`color_image_${index}`, color.image);
      }
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
      toast.error(getApiErrorMessage(error, "Failed to save product"));
    } finally {
      setLoading(false);
    }
  };

  return {
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
    setSelectedFrameIds,
    setSelectedMaterialIds,
    handleSubmit,
  };
}
