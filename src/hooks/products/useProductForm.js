// import { useEffect, useMemo, useState } from "react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import toast from "react-hot-toast";
// import {
//   addProduct,
//   updateProductNew,
//   getCategories,
//   getBrands,
//   getSubCategories,
//   getFrames,
//   getMaterials,
//   getSuppliers,
// } from "../../api/api";
// import { getApiErrorMessage } from "../../utils/apiError";

// const DEFAULT_FORM_DATA = {
//   name: "",
//   category: "",
//   subcategory: "",
//   brand: "",
//   supplier: "",
//   price: "",
//   supplier_cost: "",
//   description: "",
//   stock: "",
//   status: "In Stock",
//   image: null,
//   gallery: [],
//   is_featured: false,
//   is_best_seller: false,
//   is_published: true,
//   weight: "",
//   length: "",
//   width: "",
//   height: "",
// };

// const EMPTY_SPEC_ROW = { key: "", value: "" };
// const EMPTY_SIZE_ROW = { size: "", price: "" };
// const EMPTY_COLOR_ROW = { color_name: "", image: null, preview: "" };
// const EMPTY_VARIANT = { id: "", sku: "", stock: "", options: [{ option_name: "", option_value: "" }], images: [], existing_images: [], images_preview: [] };

// // ---- Size-based pricing helpers (new flow) ----
// const str = (v) => (v === undefined || v === null ? "" : String(v));

// // one size row: name, price, stock, optional cost. `id` only exists for saved sizes.
// const makeSizeRow = () => ({ id: "", size: "", price: "", stock: "", supplier_cost: "" });

// // one colour card (colour + its own sizes + images)
// const makeSizeColor = () => ({
//   id: "",
//   color_name: "",
//   image: null, // newly picked primary image
//   preview: "", // primary image preview (saved URL or new file)
//   has_existing_image: false,
//   remove_image: false,
//   gallery: [], // newly picked gallery files
//   existing_gallery: [], // saved gallery images [{ id, image }]
//   images_preview: [], // saved first, then new
//   sizes: [makeSizeRow()],
// });

// const mapApiSize = (item) => ({
//   id: item.id || "",
//   size: item.size || "",
//   price: str(item.price),
//   stock: str(item.stock),
//   supplier_cost: str(item.supplier_cost),
// });

// const isFilledSize = (r) => r.size.trim() || r.price !== "" || r.stock !== "";

// // validates size rows and returns { payload } or { error }
// const buildSizePayload = (rows, where = "") => {
//   const filled = rows.filter(isFilledSize);
//   if (filled.length === 0) return { error: `Add at least one size${where}` };

//   const seen = new Set();
//   const payload = [];
//   for (const r of filled) {
//     const name = r.size.trim();
//     if (!name) return { error: `Every size needs a name${where}` };
//     if (!(Number(r.price) > 0)) return { error: `Price for "${name}"${where} must be greater than zero` };
//     if (r.stock === "" || !Number.isInteger(Number(r.stock)) || Number(r.stock) < 0) {
//       return { error: `Stock for "${name}"${where} must be a whole number, 0 or more` };
//     }
//     if (r.supplier_cost !== "" && !(Number(r.supplier_cost) >= 0)) {
//       return { error: `Cost for "${name}"${where} must be 0 or more` };
//     }
//     const key = name.toLowerCase();
//     if (seen.has(key)) return { error: `Size "${name}"${where} is added twice` };
//     seen.add(key);

//     payload.push({
//       ...(r.id ? { id: r.id } : {}), // existing size keeps its id, new size has none
//       size: name,
//       price: Number(r.price),
//       stock: Number(r.stock),
//       ...(r.supplier_cost !== "" ? { supplier_cost: Number(r.supplier_cost) } : {}),
//     });
//   }
//   return { payload };
// };

// const isBlankSizeColor = (c) =>
//   !c.id && !c.color_name.trim() && !c.image && c.gallery.length === 0 && !c.sizes.some(isFilledSize);

// const normalizeRelationIds = (value) => {
//   if (!Array.isArray(value)) return [];

//   return value
//     .map((item) => {
//       if (item && typeof item === "object") return item.id;
//       return item;
//     })
//     .filter((item) => item !== null && item !== undefined && item !== "")
//     .map((item) => String(item));
// };

// // gallery items can be plain URLs or objects ({ id, image })
// const gallerySrc = (g) => (g && typeof g === "object" ? g.image || g.url : g);

// // pulls the numeric/string ids out of saved image objects; plain URL strings have no id
// const extractImageIds = (items) =>
//   (Array.isArray(items) ? items : [])
//     .map((item) => (item && typeof item === "object" ? item.id : null))
//     .filter((id) => id !== null && id !== undefined && id !== "");

// export default function useProductForm({ open, onClose, onSuccess, initialData }) {
//   const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
//   const [specs, setSpecs] = useState([EMPTY_SPEC_ROW]);
//   const [sizes, setSizes] = useState([EMPTY_SIZE_ROW]);
//   const [colors, setColors] = useState([EMPTY_COLOR_ROW]);
//   const [selectedFrameIds, setSelectedFrameIds] = useState([]);
//   const [selectedMaterialIds, setSelectedMaterialIds] = useState([]);
//   const [preview, setPreview] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [subCategories, setSubCategories] = useState([]);
//   const [frames, setFrames] = useState([]);
//   const [materials, setMaterials] = useState([]);
//   const [suppliers, setSuppliers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [galleryPreview, setGalleryPreview] = useState([]);
//   const [variants, setVariants] = useState([EMPTY_VARIANT]);

//   // size-based pricing state
//   const [hasSizePricing, setHasSizePricing] = useState(false);
//   const [sizePricingMode, setSizePricingMode] = useState("sizes"); // "sizes" (size-only) | "colors" (colour + sizes)
//   const [pricedSizes, setPricedSizes] = useState([makeSizeRow()]);
//   const [sizeColors, setSizeColors] = useState([makeSizeColor()]);

//   // The backend does not allow converting an existing product to or from size pricing,
//   // so the toggle and the mode are locked in edit mode.
//   const sizePricingLocked = Boolean(initialData);

//   // saved gallery images (the ones still kept) are tracked separately from newly picked files
//   const [existingGallery, setExistingGallery] = useState([]);
//   const [removeMainImage, setRemoveMainImage] = useState(false);

//   const queryClient = useQueryClient();

//   const { data: catRes } = useQuery({ queryKey: ['categories'], queryFn: getCategories, enabled: open });
//   const { data: brandRes } = useQuery({ queryKey: ['brands'], queryFn: getBrands, enabled: open });
//   const { data: subCatRes } = useQuery({ queryKey: ['subcategories'], queryFn: getSubCategories, enabled: open });
//   const { data: frameRes } = useQuery({ queryKey: ['frames'], queryFn: getFrames, enabled: open });
//   const { data: materialRes } = useQuery({ queryKey: ['materials'], queryFn: getMaterials, enabled: open });
//   const { data: supplierRes } = useQuery({ queryKey: ['suppliers'], queryFn: getSuppliers, enabled: open });

//   useEffect(() => {
//     if (catRes) setCategories(catRes.data.categories || []);
//     if (brandRes) setBrands(brandRes.data.brands || []);
//     if (supplierRes) setSuppliers(supplierRes.data || []);

//     if (subCatRes) {
//       const subList = subCatRes.data.subcategories || subCatRes.data.sub_categories || (Array.isArray(subCatRes.data) ? subCatRes.data : []);
//       setSubCategories(subList);
//     }

//     if (frameRes) setFrames(Array.isArray(frameRes.data) ? frameRes.data : frameRes.data.frames || []);
//     if (materialRes) setMaterials(Array.isArray(materialRes.data) ? materialRes.data : materialRes.data.materials || []);
//   }, [catRes, brandRes, subCatRes, frameRes, materialRes, supplierRes]);

//   useEffect(() => {
//     if (initialData) {
//       setFormData({
//         name: initialData.name || "",
//         category: initialData.category?.id || "",
//         subcategory: initialData.subcategory?.id || "",
//         brand: initialData.brand?.id || "",
//         supplier: initialData.supplier?.id || "",
//         price: initialData.price || "",
//         description: initialData.description || "",
//         stock: initialData.stock || "",
//         status: initialData.stock > 0 ? "In Stock" : "Out of Stock",
//         image: null,
//         gallery: [],
//         is_featured: initialData.is_featured || false,
//         is_best_seller: initialData.is_best_seller || false,
//         is_published: initialData.is_published !== undefined ? initialData.is_published : true,
//         supplier_cost: initialData.supplier_cost || "",
//         weight: initialData.weight || "",
//         length: initialData.length || "",
//         width: initialData.width || "",
//         height: initialData.height || "",
//       });

//       const existingSpec = initialData.specification;
//       if (
//         existingSpec &&
//         typeof existingSpec === "object" &&
//         Object.keys(existingSpec).length > 0
//       ) {
//         setSpecs(
//           Object.entries(existingSpec).map(([key, value]) => ({ key, value: String(value) })),
//         );
//       } else {
//         setSpecs([EMPTY_SPEC_ROW]);
//       }

//       const existingSizes = Array.isArray(initialData.sizes) ? initialData.sizes : [];

//       if (initialData.has_size_pricing) {
//         // size-priced product. Saved ids are kept so the backend updates instead of recreating.
//         setHasSizePricing(true);
//         setSizes([EMPTY_SIZE_ROW]);

//         const apiColors = Array.isArray(initialData.colors) ? initialData.colors : [];
//         // size-only sizes come from product_sizes (colour sizes live under each colour)
//         const flatSizes = Array.isArray(initialData.product_sizes) ? initialData.product_sizes : existingSizes;

//         if (apiColors.length > 0) {
//           setSizePricingMode("colors");
//           setSizeColors(
//             apiColors.map((c) => {
//               const gallery = Array.isArray(c.gallery) ? c.gallery : [];
//               const colorSizes = Array.isArray(c.sizes) ? c.sizes : [];
//               return {
//                 id: c.id || "",
//                 color_name: c.color_name || "",
//                 image: null,
//                 preview: c.image || "",
//                 has_existing_image: Boolean(c.image),
//                 remove_image: false,
//                 gallery: [],
//                 existing_gallery: gallery,
//                 images_preview: gallery.map(gallerySrc),
//                 sizes: colorSizes.length > 0 ? colorSizes.map(mapApiSize) : [makeSizeRow()],
//               };
//             }),
//           );
//           setPricedSizes([makeSizeRow()]);
//         } else {
//           setSizePricingMode("sizes");
//           const ownSizes = flatSizes.filter((s) => !s.color_id);
//           setPricedSizes(ownSizes.length > 0 ? ownSizes.map(mapApiSize) : [makeSizeRow()]);
//           setSizeColors([makeSizeColor()]);
//         }
//       } else {
//         setHasSizePricing(false);
//         setSizePricingMode("sizes");
//         setPricedSizes([makeSizeRow()]);
//         setSizeColors([makeSizeColor()]);
//         if (existingSizes.length > 0) {
//           setSizes(
//             existingSizes.map((item) => ({ size: item.size || "", price: String(item.price || "") })),
//           );
//         } else {
//           setSizes([EMPTY_SIZE_ROW]);
//         }
//       }

//       const existingColors = Array.isArray(initialData.colors) ? initialData.colors : [];
//       if (existingColors.length > 0) {
//         setColors(
//           existingColors.map((item) => ({
//             color_name: item.color_name || "",
//             image: null,
//             preview: item.image || "",
//           })),
//         );
//       } else {
//         setColors([EMPTY_COLOR_ROW]);
//       }

//       setSelectedFrameIds(normalizeRelationIds(initialData.frames));
//       setSelectedMaterialIds(normalizeRelationIds(initialData.materials));
//       setPreview(initialData.image || null);

//       // keep saved gallery images separate so removing one is tracked correctly
//       const existing = Array.isArray(initialData.gallery) ? initialData.gallery : [];
//       setExistingGallery(existing);
//       setGalleryPreview(existing.map(gallerySrc));
//       setRemoveMainImage(false);

//       if (initialData.product_type === "variant" || (Array.isArray(initialData.variants) && initialData.variants.length > 0)) {
//         // fall back to [] so a variant product with no variants array does not crash
//         const existingVariants = Array.isArray(initialData.variants) ? initialData.variants : [];
//         if (existingVariants.length > 0) {
//           setVariants(existingVariants.map(v => ({
//             id: v.id || "",
//             sku: v.sku || "",
//             stock: v.stock !== undefined && v.stock !== null ? String(v.stock) : "",
//             options: Array.isArray(v.options) && v.options.length > 0 ? v.options : [{ option_name: "", option_value: "" }],
//             images: [],
//             existing_images: v.images || [],
//             images_preview: Array.isArray(v.images) ? v.images.map(img => img.image || img.url || img) : []
//           })));
//         } else {
//           setVariants([EMPTY_VARIANT]);
//         }
//       } else {
//         setVariants([EMPTY_VARIANT]);
//       }
//     } else {
//       setFormData(DEFAULT_FORM_DATA);
//       setSpecs([EMPTY_SPEC_ROW]);
//       setSizes([EMPTY_SIZE_ROW]);
//       setHasSizePricing(false);
//       setSizePricingMode("sizes");
//       setPricedSizes([makeSizeRow()]);
//       setSizeColors([makeSizeColor()]);
//       setColors([EMPTY_COLOR_ROW]);
//       setSelectedFrameIds([]);
//       setSelectedMaterialIds([]);
//       setPreview(null);
//       setGalleryPreview([]);
//       setExistingGallery([]);
//       setRemoveMainImage(false);
//       setVariants([EMPTY_VARIANT]);
//     }
//   }, [initialData, open]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleToggleFlag = (name, checked) => {
//     setFormData((prev) => ({ ...prev, [name]: checked }));
//   };

//   // reset the input so the same file can be picked again after removing it
//   const handleImageChange = (e) => {
//     const file = e.target.files?.[0];
//     e.target.value = "";
//     if (!file) return;

//     setFormData((prev) => ({ ...prev, image: file }));
//     setPreview(URL.createObjectURL(file));
//     setRemoveMainImage(false);
//   };

//   // also tells the server to delete the saved image in edit mode
//   const handleRemoveImage = (e) => {
//     e?.preventDefault?.();
//     e?.stopPropagation?.();
//     setPreview(null);
//     setFormData((prev) => ({ ...prev, image: null }));
//     if (initialData?.image) setRemoveMainImage(true);
//   };

//   const handleGalleryChange = (e) => {
//     const files = Array.from(e.target.files || []);
//     if (files.length === 0) return;

//     setFormData((prev) => ({ ...prev, gallery: [...prev.gallery, ...files] }));
//     setGalleryPreview((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))]);
//     e.target.value = "";
//   };

//   // saved images come first in the preview, new files come after them.
//   // Removing a saved image drops it from existingGallery; the remaining ids are sent on save.
//   const handleRemoveGalleryImage = (index) => {
//     const existingCount = existingGallery.length;

//     if (index < existingCount) {
//       setExistingGallery((prev) => prev.filter((_, i) => i !== index));
//     } else {
//       // a newly picked file: just drop it from the upload list
//       const newIndex = index - existingCount;
//       setFormData((prev) => ({
//         ...prev,
//         gallery: prev.gallery.filter((_, i) => i !== newIndex),
//       }));
//     }

//     setGalleryPreview((prev) => prev.filter((_, i) => i !== index));
//   };

//   const addSpecRow = () => {
//     setSpecs((prev) => [...prev, { key: "", value: "" }]);
//   };

//   const updateSpecRow = (index, field, value) => {
//     setSpecs((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
//   };

//   const removeSpecRow = (index) => {
//     setSpecs((prev) =>
//       prev.length === 1 ? [EMPTY_SPEC_ROW] : prev.filter((_, i) => i !== index),
//     );
//   };

//   // legacy sizes (Fine Art)
//   const addSizeRow = () => {
//     setSizes((prev) => [...prev, { size: "", price: "" }]);
//   };

//   const updateSizeRow = (index, field, value) => {
//     setSizes((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
//   };

//   const removeSizeRow = (index) => {
//     setSizes((prev) =>
//       prev.length === 1 ? [EMPTY_SIZE_ROW] : prev.filter((_, i) => i !== index),
//     );
//   };

//   // size-only rows
//   const addPricedSize = () => {
//     setPricedSizes((prev) => [...prev, makeSizeRow()]);
//   };

//   const updatePricedSize = (index, field, value) => {
//     setPricedSizes((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
//   };

//   const removePricedSize = (index) => {
//     setPricedSizes((prev) =>
//       prev.length === 1 ? [makeSizeRow()] : prev.filter((_, i) => i !== index),
//     );
//   };

//   // colour + sizes cards
//   const addSizeColor = () => {
//     setSizeColors((prev) => [...prev, makeSizeColor()]);
//   };

//   const removeSizeColor = (ci) => {
//     // a removed saved colour is simply left out of the payload, so the backend deletes it
//     setSizeColors((prev) => (prev.length === 1 ? [makeSizeColor()] : prev.filter((_, i) => i !== ci)));
//   };

//   const updateSizeColorName = (ci, value) => {
//     setSizeColors((prev) => prev.map((c, i) => (i === ci ? { ...c, color_name: value } : c)));
//   };

//   const setSizeColorImage = (ci, file) => {
//     if (!file) return;
//     const nextPreview = URL.createObjectURL(file);
//     setSizeColors((prev) =>
//       prev.map((c, i) => (i === ci ? { ...c, image: file, preview: nextPreview, remove_image: false } : c)),
//     );
//   };

//   const clearSizeColorImage = (ci) => {
//     setSizeColors((prev) =>
//       prev.map((c, i) =>
//         i === ci ? { ...c, image: null, preview: "", remove_image: c.has_existing_image } : c,
//       ),
//     );
//   };

//   const addSizeColorGallery = (ci, e) => {
//     const files = Array.from(e.target.files || []);
//     e.target.value = "";
//     if (files.length === 0) return;
//     setSizeColors((prev) =>
//       prev.map((c, i) =>
//         i === ci
//           ? {
//               ...c,
//               gallery: [...c.gallery, ...files],
//               images_preview: [...c.images_preview, ...files.map((f) => URL.createObjectURL(f))],
//             }
//           : c,
//       ),
//     );
//   };

//   // saved images come first in the preview, new files come after them
//   const removeSizeColorGallery = (ci, imageIndex) => {
//     setSizeColors((prev) =>
//       prev.map((c, i) => {
//         if (i !== ci) return c;
//         const savedCount = c.existing_gallery.length;
//         if (imageIndex < savedCount) {
//           return {
//             ...c,
//             existing_gallery: c.existing_gallery.filter((_, j) => j !== imageIndex),
//             images_preview: c.images_preview.filter((_, j) => j !== imageIndex),
//           };
//         }
//         const newIndex = imageIndex - savedCount;
//         return {
//           ...c,
//           gallery: c.gallery.filter((_, j) => j !== newIndex),
//           images_preview: c.images_preview.filter((_, j) => j !== imageIndex),
//         };
//       }),
//     );
//   };

//   const addSizeColorSize = (ci) => {
//     setSizeColors((prev) => prev.map((c, i) => (i === ci ? { ...c, sizes: [...c.sizes, makeSizeRow()] } : c)));
//   };

//   const updateSizeColorSize = (ci, si, field, value) => {
//     setSizeColors((prev) =>
//       prev.map((c, i) =>
//         i === ci
//           ? { ...c, sizes: c.sizes.map((s, j) => (j === si ? { ...s, [field]: value } : s)) }
//           : c,
//       ),
//     );
//   };

//   const removeSizeColorSize = (ci, si) => {
//     setSizeColors((prev) =>
//       prev.map((c, i) => {
//         if (i !== ci) return c;
//         return { ...c, sizes: c.sizes.length === 1 ? [makeSizeRow()] : c.sizes.filter((_, j) => j !== si) };
//       }),
//     );
//   };

//   const addColorRow = () => {
//     setColors((prev) => [...prev, { color_name: "", image: null, preview: "" }]);
//   };

//   const updateColorRow = (index, value) => {
//     setColors((prev) => prev.map((row, i) => (i === index ? { ...row, color_name: value } : row)));
//   };

//   const updateColorImage = (index, file) => {
//     if (!file) return;
//     const nextPreview = URL.createObjectURL(file);
//     setColors((prev) =>
//       prev.map((row, i) => (i === index ? { ...row, image: file, preview: nextPreview } : row)),
//     );
//   };

//   const removeColorRow = (index) => {
//     setColors((prev) =>
//       prev.length === 1 ? [EMPTY_COLOR_ROW] : prev.filter((_, i) => i !== index),
//     );
//   };

//   const clearColorImage = (index) => {
//     setColors((prev) =>
//       prev.map((row, i) => (i === index ? { ...row, image: null, preview: "" } : row)),
//     );
//   };

//   const addVariant = () => {
//     setVariants((prev) => [...prev, { id: "", sku: "", stock: "", options: [{ option_name: "", option_value: "" }], images: [], existing_images: [], images_preview: [] }]);
//   };

//   const updateVariant = (index, field, value) => {
//     setVariants((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
//   };

//   const removeVariant = (index) => {
//     setVariants((prev) => prev.length === 1 ? [EMPTY_VARIANT] : prev.filter((_, i) => i !== index));
//   };

//   const addVariantOption = (variantIndex) => {
//     setVariants((prev) => prev.map((row, i) => {
//       if (i === variantIndex) {
//         return { ...row, options: [...row.options, { option_name: "", option_value: "" }] };
//       }
//       return row;
//     }));
//   };

//   const updateVariantOption = (variantIndex, optionIndex, field, value) => {
//     setVariants((prev) => prev.map((row, i) => {
//       if (i === variantIndex) {
//         const newOptions = row.options.map((opt, j) => (j === optionIndex ? { ...opt, [field]: value } : opt));
//         return { ...row, options: newOptions };
//       }
//       return row;
//     }));
//   };

//   const removeVariantOption = (variantIndex, optionIndex) => {
//     setVariants((prev) => prev.map((row, i) => {
//       if (i === variantIndex) {
//         const newOptions = row.options.length === 1 ? [{ option_name: "", option_value: "" }] : row.options.filter((_, j) => j !== optionIndex);
//         return { ...row, options: newOptions };
//       }
//       return row;
//     }));
//   };

//   const handleVariantImagesChange = (variantIndex, e) => {
//     const files = Array.from(e.target.files || []);
//     if (files.length === 0) return;

//     setVariants((prev) => prev.map((row, i) => {
//       if (i === variantIndex) {
//         return {
//           ...row,
//           images: [...row.images, ...files],
//           images_preview: [...row.images_preview, ...files.map(file => URL.createObjectURL(file))]
//         };
//       }
//       return row;
//     }));
//     e.target.value = "";
//   };

//   const handleRemoveVariantImage = (variantIndex, imageIndex, isExisting) => {
//     setVariants((prev) => prev.map((row, i) => {
//       if (i === variantIndex) {
//         if (isExisting) {
//           return {
//             ...row,
//             existing_images: row.existing_images.filter((_, j) => j !== imageIndex),
//             images_preview: row.images_preview.filter((_, j) => j !== imageIndex)
//           };
//         } else {
//           // It's a new uploaded image
//           // imageIndex for new uploaded image is relative to existing_images.length
//           const newImageIdx = imageIndex - row.existing_images.length;
//           return {
//             ...row,
//             images: row.images.filter((_, j) => j !== newImageIdx),
//             images_preview: row.images_preview.filter((_, j) => j !== imageIndex)
//           };
//         }
//       }
//       return row;
//     }));
//   };

//   const specificationPayload = useMemo(() => {
//     const specObj = {};
//     specs.forEach(({ key, value }) => {
//       if (key.trim()) specObj[key.trim()] = value;
//     });
//     return specObj;
//   }, [specs]);

//   const sizesPayload = useMemo(
//     () =>
//       sizes
//         .filter((item) => item.size.trim() && item.price !== "")
//         .map((item) => ({
//           size: item.size.trim(),
//           price: Number(item.price),
//         })),
//     [sizes],
//   );

//   const colorsPayload = useMemo(
//     () =>
//       colors
//         .filter((item) => item.color_name.trim())
//         .map((item) => ({ color_name: item.color_name.trim(), image: item.image })),
//     [colors],
//   );

//   // base product price = smallest size price (across all colours in colour mode)
//   const derivedBasePrice = useMemo(() => {
//     const rows = sizePricingMode === "colors" ? sizeColors.flatMap((c) => c.sizes) : pricedSizes;
//     const prices = rows.map((r) => Number(r.price)).filter((n) => n > 0);
//     return prices.length ? Math.min(...prices) : "";
//   }, [sizePricingMode, sizeColors, pricedSizes]);

//   const handleSubmit = async () => {
//     // Determine category characteristics (whole-word match, so "Smart Watches" is not Fine Art)
//     const selectedCategoryObj = categories.find((c) => String(c.id) === String(formData.category));
//     const catName = selectedCategoryObj?.name?.toLowerCase() || "";
//     const isArt = /\bart(s|work)?\b/.test(catName);
//     const useSizePricing = !isArt && hasSizePricing; // size pricing is for Variant products only

//     // product-level gallery is only used by fine art and size-only priced products.
//     // Colour-priced and generic variant products use their own galleries.
//     const usesProductGallery = isArt || (useSizePricing && sizePricingMode === "sizes");

//     // base price comes from the sizes when size pricing is on
//     if (!formData.name || (!useSizePricing && !formData.price)) {
//       toast.error("Name and Price are required");
//       return;
//     }

//     if (!formData.weight || !formData.length || !formData.width || !formData.height) {
//       toast.error("Weight, Length, Width, and Height are required");
//       return;
//     }

//     if (Number(formData.weight) <= 0 || Number(formData.length) <= 0 || Number(formData.width) <= 0 || Number(formData.height) <= 0) {
//       toast.error("Weight, Length, Width, and Height must be greater than zero");
//       return;
//     }

//     const validVariants = variants.filter((v) => v.sku.trim() !== "");

//     // size-priced products have no SKU variants
//     if (!isArt && !useSizePricing && validVariants.length === 0) {
//       toast.error("Please add at least one product variant");
//       return;
//     }

//     // validate and build the size-pricing payload
//     let sizeOnlyPayload = [];
//     let colorPricingPayload = [];
//     let colorPricingRows = []; // same order as colorPricingPayload, used to attach images by index
//     let basePrice = Number(formData.price);

//     if (useSizePricing) {
//       if (sizePricingMode === "sizes") {
//         const result = buildSizePayload(pricedSizes);
//         if (result.error) { toast.error(result.error); return; }
//         sizeOnlyPayload = result.payload;
//         basePrice = Math.min(...sizeOnlyPayload.map((s) => s.price));
//       } else {
//         const rows = sizeColors.filter((c) => !isBlankSizeColor(c));
//         if (rows.length === 0) {
//           toast.error("Add at least one colour");
//           return;
//         }

//         const seenColors = new Set();
//         const allPrices = [];
//         for (const c of rows) {
//           const name = c.color_name.trim();
//           if (!name) { toast.error("Every colour needs a name"); return; }
//           const colorKey = name.toLowerCase();
//           if (seenColors.has(colorKey)) { toast.error(`Colour "${name}" is added twice`); return; }
//           seenColors.add(colorKey);

//           const result = buildSizePayload(c.sizes, ` (${name})`);
//           if (result.error) { toast.error(result.error); return; }
//           result.payload.forEach((s) => allPrices.push(s.price));

//           colorPricingPayload.push({
//             ...(c.id ? { id: c.id } : {}), // saved colour keeps its id, new colour has none
//             color_name: name,
//             existing_gallery_image_ids: extractImageIds(c.existing_gallery), // saved gallery images to keep
//             ...(c.remove_image && !c.image ? { remove_image: true } : {}),
//             sizes: result.payload,
//           });
//           colorPricingRows.push(c);
//         }
//         basePrice = Math.min(...allPrices);
//       }
//     }

//     // Edit mode: if saved gallery images arrived without ids, sending an empty keep-list
//     // would delete them all. Stop before anything is sent.
//     let keptGalleryIds = null;
//     if (initialData && usesProductGallery) {
//       keptGalleryIds = extractImageIds(existingGallery);
//       if (keptGalleryIds.length !== existingGallery.length) {
//         toast.error("Saved gallery images are missing IDs, so gallery changes can't be saved. Check the product API response.");
//         return;
//       }
//     }

//     setLoading(true);
//     const data = new FormData();
//     data.append("name", formData.name);
//     if (formData.category) data.append("category", formData.category);
//     if (formData.subcategory) data.append("subcategory", formData.subcategory);
//     if (formData.brand) data.append("brand", formData.brand);
//     if (formData.supplier) data.append("supplier", formData.supplier);
//     data.append("price", basePrice);
//     data.append("description", formData.description);
//     data.append("specification", JSON.stringify(specificationPayload));

//     // Always send the product type
//     data.append("product_type", isArt ? "fine_art" : "variant");

//     if (isArt) {
//       data.append("sizes", JSON.stringify(sizesPayload));
//       data.append("colors", JSON.stringify(colorsPayload.map(({ color_name }) => ({ color_name }))));
//       if (formData.stock !== "") data.append("stock", Number(formData.stock));
//       data.append("frame_ids", JSON.stringify(selectedFrameIds));
//       data.append("material_ids", JSON.stringify(selectedMaterialIds));
//       colors.forEach((color, index) => {
//         if (color.image) {
//           data.append(`color_image_${index}`, color.image);
//         }
//       });
//     } else if (useSizePricing) {
//       // Size-only sends sizes and colors = []; colour mode sends sizes = [] and colors.
//       data.append("has_size_pricing", "true");
//       data.append("sizes", JSON.stringify(sizePricingMode === "sizes" ? sizeOnlyPayload : []));
//       data.append("colors", JSON.stringify(sizePricingMode === "colors" ? colorPricingPayload : []));

//       if (sizePricingMode === "colors") {
//         // the number in the key is the colour's position in the colors JSON array
//         colorPricingRows.forEach((c, index) => {
//           if (c.image) data.append(`color_image_${index}`, c.image);
//           c.gallery.forEach((file) => data.append(`color_images_${index}`, file));
//         });
//       }
//     } else {
//       const payloadVariants = validVariants.map((v) => {
//         const payloadV = {
//           sku: v.sku.trim(),
//           stock: Number(v.stock) || 0,
//           options: v.options
//             .filter((opt) => opt.option_name.trim() !== "" && opt.option_value.trim() !== "")
//             .map((opt) => ({
//               option_name: opt.option_name.trim(),
//               option_value: opt.option_value.trim(),
//             })),
//         };
//         if (v.id) {
//           payloadV.id = v.id;
//           // backend reads `existing_image_ids`: the saved images that should be kept
//           payloadV.existing_image_ids = extractImageIds(v.existing_images);
//         }
//         return payloadV;
//       });
//       data.append("variants", JSON.stringify(payloadVariants));

//       validVariants.forEach((v, index) => {
//         v.images.forEach((file) => {
//           data.append(`variant_images_${index}`, file);
//         });
//       });
//     }

//     data.append("is_featured", formData.is_featured);
//     data.append("is_best_seller", formData.is_best_seller);
//     data.append("is_published", formData.is_published);
//     if (formData.supplier_cost) data.append("supplier_cost", Number(formData.supplier_cost));
//     data.append("weight", Number(formData.weight));
//     data.append("length", Number(formData.length));
//     data.append("width", Number(formData.width));
//     data.append("height", Number(formData.height));

//     if (formData.image) data.append("image", formData.image);

//     // new product-level gallery files (only where the backend uses a product gallery)
//     if (usesProductGallery) {
//       formData.gallery.forEach((file) => data.append("images", file));
//     }

//     // edit mode only: tell the server what to keep
//     if (initialData) {
//       // backend reads `remove_main_image`
//       if (removeMainImage && !formData.image) data.append("remove_main_image", "true");

//       // saved gallery images that should remain; anything not listed is deleted
//       if (keptGalleryIds !== null) {
//         data.append("existing_gallery_image_ids", JSON.stringify(keptGalleryIds));
//       }
//     }

//     try {
//       if (initialData) {
//         await updateProductNew(initialData.id, data);
//         toast.success("Product updated successfully");
//       } else {
//         await addProduct(data);
//         toast.success("Product added successfully");
//       }
//       queryClient.invalidateQueries({ queryKey: ['products'] });
//       onSuccess();
//       onClose();
//     } catch (error) {
//       toast.error(getApiErrorMessage(error, "Failed to save product"));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     formData,
//     specs,
//     sizes,
//     colors,
//     selectedFrameIds,
//     selectedMaterialIds,
//     preview,
//     categories,
//     brands,
//     subCategories,
//     frames,
//     materials,
//     suppliers,
//     loading,
//     galleryPreview,
//     variants,
//     // size-based pricing
//     hasSizePricing,
//     setHasSizePricing,
//     sizePricingMode,
//     setSizePricingMode,
//     sizePricingLocked,
//     derivedBasePrice,
//     pricedSizes,
//     addPricedSize,
//     updatePricedSize,
//     removePricedSize,
//     sizeColors,
//     addSizeColor,
//     removeSizeColor,
//     updateSizeColorName,
//     setSizeColorImage,
//     clearSizeColorImage,
//     addSizeColorGallery,
//     removeSizeColorGallery,
//     addSizeColorSize,
//     updateSizeColorSize,
//     removeSizeColorSize,
//     handleChange,
//     handleToggleFlag,
//     handleImageChange,
//     handleRemoveImage,
//     handleGalleryChange,
//     handleRemoveGalleryImage,
//     addSpecRow,
//     updateSpecRow,
//     removeSpecRow,
//     addSizeRow,
//     updateSizeRow,
//     removeSizeRow,
//     addColorRow,
//     updateColorRow,
//     updateColorImage,
//     removeColorRow,
//     clearColorImage,
//     setSelectedFrameIds,
//     setSelectedMaterialIds,
//     addVariant,
//     updateVariant,
//     removeVariant,
//     addVariantOption,
//     updateVariantOption,
//     removeVariantOption,
//     handleVariantImagesChange,
//     handleRemoveVariantImage,
//     handleSubmit,
//   };
// }





import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  addProduct,
  updateProductNew,
  getCategories,
  getBrands,
  getSubCategories,
  getFrames,
  getMaterials,
  getSuppliers,
} from "../../api/api";
import { getApiErrorMessage } from "../../utils/apiError";

const DEFAULT_FORM_DATA = {
  name: "",
  category: "",
  subcategory: "",
  brand: "",
  supplier: "",
  price: "",
  supplier_cost: "",
  description: "",
  stock: "",
  status: "In Stock",
  image: null,
  gallery: [],
  is_featured: false,
  is_best_seller: false,
  is_published: true,
  weight: "",
  length: "",
  width: "",
  height: "",
};

const EMPTY_SPEC_ROW = { key: "", value: "" };
const EMPTY_SIZE_ROW = { id: "", size: "", price: "", stock: "" };
const EMPTY_COLOR_ROW = { color_name: "", image: null, preview: "" };
const EMPTY_VARIANT = { id: "", sku: "", stock: "", options: [{ option_name: "", option_value: "" }], images: [], existing_images: [], images_preview: [] };

// ---- Size-based pricing helpers (new flow) ----
const str = (v) => (v === undefined || v === null ? "" : String(v));

// one size row: name, price, stock, optional cost. `id` only exists for saved sizes.
const makeSizeRow = () => ({ id: "", size: "", price: "", stock: "", supplier_cost: "" });

// one colour card (colour + its own sizes + images)
const makeSizeColor = () => ({
  id: "",
  color_name: "",
  image: null, // newly picked primary image
  preview: "", // primary image preview (saved URL or new file)
  has_existing_image: false,
  remove_image: false,
  gallery: [], // newly picked gallery files
  existing_gallery: [], // saved gallery images [{ id, image }]
  images_preview: [], // saved first, then new
  sizes: [makeSizeRow()],
});

const mapApiSize = (item) => ({
  id: item.id || "",
  size: item.size || "",
  price: str(item.price),
  stock: str(item.stock),
  supplier_cost: str(item.supplier_cost),
});

const isFilledSize = (r) => r.size.trim() || r.price !== "" || r.stock !== "";

// validates size rows and returns { payload } or { error }
const buildSizePayload = (rows, where = "") => {
  const filled = rows.filter(isFilledSize);
  if (filled.length === 0) return { error: `Add at least one size${where}` };

  const seen = new Set();
  const payload = [];
  for (const r of filled) {
    const name = r.size.trim();
    if (!name) return { error: `Every size needs a name${where}` };
    if (!(Number(r.price) > 0)) return { error: `Price for "${name}"${where} must be greater than zero` };
    if (r.stock === "" || !Number.isInteger(Number(r.stock)) || Number(r.stock) < 0) {
      return { error: `Stock for "${name}"${where} must be a whole number, 0 or more` };
    }
    if (r.supplier_cost !== "" && !(Number(r.supplier_cost) >= 0)) {
      return { error: `Cost for "${name}"${where} must be 0 or more` };
    }
    const key = name.toLowerCase();
    if (seen.has(key)) return { error: `Size "${name}"${where} is added twice` };
    seen.add(key);

    payload.push({
      ...(r.id ? { id: r.id } : {}), // existing size keeps its id, new size has none
      size: name,
      price: Number(r.price),
      stock: Number(r.stock),
      ...(r.supplier_cost !== "" ? { supplier_cost: Number(r.supplier_cost) } : {}),
    });
  }
  return { payload };
};

const isBlankSizeColor = (c) =>
  !c.id && !c.color_name.trim() && !c.image && c.gallery.length === 0 && !c.sizes.some(isFilledSize);

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

// gallery items can be plain URLs or objects ({ id, image })
const galleryKey = (g) => (g && typeof g === "object" ? g.id ?? g.image ?? g.url : g);
const gallerySrc = (g) => (g && typeof g === "object" ? g.image || g.url : g);

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
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [galleryPreview, setGalleryPreview] = useState([]);
  const [variants, setVariants] = useState([EMPTY_VARIANT]);

  // NEW: size-based pricing state
  const [hasSizePricing, setHasSizePricing] = useState(false);
  const [sizePricingMode, setSizePricingMode] = useState("sizes"); // "sizes" (size-only) | "colors" (colour + sizes)
  const [pricedSizes, setPricedSizes] = useState([makeSizeRow()]);
  const [sizeColors, setSizeColors] = useState([makeSizeColor()]);

  // The backend does not allow converting an existing product to or from size pricing,
  // so the toggle and the mode are locked in edit mode.
  const sizePricingLocked = Boolean(initialData);

  // track saved gallery images separately from newly picked files
  const [existingGallery, setExistingGallery] = useState([]);
  const [removedGallery, setRemovedGallery] = useState([]);
  const [removeMainImage, setRemoveMainImage] = useState(false);

  const queryClient = useQueryClient();

  const { data: catRes, isLoading: isCatLoading } = useQuery({ queryKey: ['categories'], queryFn: getCategories, enabled: open });
  const { data: brandRes, isLoading: isBrandLoading } = useQuery({ queryKey: ['brands'], queryFn: getBrands, enabled: open });
  const { data: subCatRes, isLoading: isSubCatLoading } = useQuery({ queryKey: ['subcategories'], queryFn: getSubCategories, enabled: open });
  const { data: frameRes, isLoading: isFrameLoading } = useQuery({ queryKey: ['frames'], queryFn: getFrames, enabled: open });
  const { data: materialRes, isLoading: isMaterialLoading } = useQuery({ queryKey: ['materials'], queryFn: getMaterials, enabled: open });
  const { data: supplierRes, isLoading: isSupplierLoading } = useQuery({ queryKey: ['suppliers'], queryFn: getSuppliers, enabled: open });

  useEffect(() => {
    if (catRes) setCategories(catRes.data.categories || []);
    if (brandRes) setBrands(brandRes.data.brands || []);
    if (supplierRes) setSuppliers(supplierRes.data || []);

    if (subCatRes) {
      const subList = subCatRes.data.subcategories || subCatRes.data.sub_categories || (Array.isArray(subCatRes.data) ? subCatRes.data : []);
      setSubCategories(subList);
    }

    if (frameRes) setFrames(Array.isArray(frameRes.data) ? frameRes.data : frameRes.data.frames || []);
    if (materialRes) setMaterials(Array.isArray(materialRes.data) ? materialRes.data : materialRes.data.materials || []);
  }, [catRes, brandRes, subCatRes, frameRes, materialRes, supplierRes]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        category: initialData.category?.id || "",
        subcategory: initialData.subcategory?.id || "",
        brand: initialData.brand?.id || "",
        supplier: initialData.supplier?.id || "",
        price: initialData.price || "",
        description: initialData.description || "",
        stock: initialData.stock || "",
        status: initialData.stock > 0 ? "In Stock" : "Out of Stock",
        image: null,
        gallery: [],
        is_featured: initialData.is_featured || false,
        is_best_seller: initialData.is_best_seller || false,
        is_published: initialData.is_published !== undefined ? initialData.is_published : true,
        supplier_cost: initialData.supplier_cost || "",
        weight: initialData.weight || "",
        length: initialData.length || "",
        width: initialData.width || "",
        height: initialData.height || "",
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

      if (initialData.has_size_pricing) {
        // NEW: size-priced product. Saved ids are kept so the backend updates instead of recreating.
        setHasSizePricing(true);
        setSizes([EMPTY_SIZE_ROW]);

        const apiColors = Array.isArray(initialData.colors) ? initialData.colors : [];
        // size-only sizes come from product_sizes (colour sizes live under each colour)
        const flatSizes = Array.isArray(initialData.product_sizes) ? initialData.product_sizes : existingSizes;

        if (apiColors.length > 0) {
          setSizePricingMode("colors");
          setSizeColors(
            apiColors.map((c) => {
              const gallery = Array.isArray(c.gallery) ? c.gallery : [];
              const colorSizes = Array.isArray(c.sizes) ? c.sizes : [];
              return {
                id: c.id || "",
                color_name: c.color_name || "",
                image: null,
                preview: c.image || "",
                has_existing_image: Boolean(c.image),
                remove_image: false,
                gallery: [],
                existing_gallery: gallery,
                images_preview: gallery.map(gallerySrc),
                sizes: colorSizes.length > 0 ? colorSizes.map(mapApiSize) : [makeSizeRow()],
              };
            }),
          );
          setPricedSizes([makeSizeRow()]);
        } else {
          setSizePricingMode("sizes");
          const ownSizes = flatSizes.filter((s) => !s.color_id);
          setPricedSizes(ownSizes.length > 0 ? ownSizes.map(mapApiSize) : [makeSizeRow()]);
          setSizeColors([makeSizeColor()]);
        }
      } else {
        setHasSizePricing(false);
        setSizePricingMode("sizes");
        setPricedSizes([makeSizeRow()]);
        setSizeColors([makeSizeColor()]);
        if (existingSizes.length > 0) {
          // Fine Art sizes keep their id (so the backend updates them in place) and their own stock
          setSizes(
            existingSizes.map((item) => ({
              id: item.id || "",
              size: item.size || "",
              price: str(item.price),
              stock: str(item.stock),
            })),
          );
        } else {
          setSizes([EMPTY_SIZE_ROW]);
        }
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

      // keep saved gallery images separate so removing one is tracked correctly
      const existing = Array.isArray(initialData.gallery) ? initialData.gallery : [];
      setExistingGallery(existing);
      setGalleryPreview(existing.map(gallerySrc));
      setRemovedGallery([]);
      setRemoveMainImage(false);

      if (initialData.product_type === "variant" || (Array.isArray(initialData.variants) && initialData.variants.length > 0)) {
        // fall back to [] so a variant product with no variants array does not crash
        const existingVariants = Array.isArray(initialData.variants) ? initialData.variants : [];
        if (existingVariants.length > 0) {
          setVariants(existingVariants.map(v => ({
            id: v.id || "",
            sku: v.sku || "",
            stock: v.stock !== undefined && v.stock !== null ? String(v.stock) : "",
            options: Array.isArray(v.options) && v.options.length > 0 ? v.options : [{ option_name: "", option_value: "" }],
            images: [],
            existing_images: v.images || [],
            images_preview: Array.isArray(v.images) ? v.images.map(img => img.image || img.url || img) : []
          })));
        } else {
          setVariants([EMPTY_VARIANT]);
        }
      } else {
        setVariants([EMPTY_VARIANT]);
      }
    } else {
      setFormData(DEFAULT_FORM_DATA);
      setSpecs([EMPTY_SPEC_ROW]);
      setSizes([EMPTY_SIZE_ROW]);
      setHasSizePricing(false); // NEW
      setSizePricingMode("sizes"); // NEW
      setPricedSizes([makeSizeRow()]); // NEW
      setSizeColors([makeSizeColor()]); // NEW
      setColors([EMPTY_COLOR_ROW]);
      setSelectedFrameIds([]);
      setSelectedMaterialIds([]);
      setPreview(null);
      setGalleryPreview([]);
      setExistingGallery([]);
      setRemovedGallery([]);
      setRemoveMainImage(false);
      setVariants([EMPTY_VARIANT]);
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleFlag = (name, checked) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  // reset the input so the same file can be picked again after removing it
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setFormData((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
    setRemoveMainImage(false);
  };

  // also tells the server to delete the saved image in edit mode
  const handleRemoveImage = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    setPreview(null);
    setFormData((prev) => ({ ...prev, image: null }));
    if (initialData?.image) setRemoveMainImage(true);
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setFormData((prev) => ({ ...prev, gallery: [...prev.gallery, ...files] }));
    setGalleryPreview((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))]);
    e.target.value = "";
  };

  // saved images come first in the preview, new files come after them
  const handleRemoveGalleryImage = (index) => {
    const existingCount = existingGallery.length;

    if (index < existingCount) {
      // a saved image: remember it so the server can delete it
      setRemovedGallery((prev) => [...prev, galleryKey(existingGallery[index])]);
      setExistingGallery((prev) => prev.filter((_, i) => i !== index));
    } else {
      // a newly picked file: just drop it from the upload list
      const newIndex = index - existingCount;
      setFormData((prev) => ({
        ...prev,
        gallery: prev.gallery.filter((_, i) => i !== newIndex),
      }));
    }

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

  // legacy sizes (Fine Art)
  const addSizeRow = () => {
    setSizes((prev) => [...prev, { id: "", size: "", price: "", stock: "" }]);
  };

  const updateSizeRow = (index, field, value) => {
    setSizes((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };

  const removeSizeRow = (index) => {
    setSizes((prev) =>
      prev.length === 1 ? [EMPTY_SIZE_ROW] : prev.filter((_, i) => i !== index),
    );
  };

  // NEW: size-only rows
  const addPricedSize = () => {
    setPricedSizes((prev) => [...prev, makeSizeRow()]);
  };

  const updatePricedSize = (index, field, value) => {
    setPricedSizes((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };

  const removePricedSize = (index) => {
    setPricedSizes((prev) =>
      prev.length === 1 ? [makeSizeRow()] : prev.filter((_, i) => i !== index),
    );
  };

  // NEW: colour + sizes cards
  const addSizeColor = () => {
    setSizeColors((prev) => [...prev, makeSizeColor()]);
  };

  const removeSizeColor = (ci) => {
    // a removed saved colour is simply left out of the payload, so the backend deletes it
    setSizeColors((prev) => (prev.length === 1 ? [makeSizeColor()] : prev.filter((_, i) => i !== ci)));
  };

  const updateSizeColorName = (ci, value) => {
    setSizeColors((prev) => prev.map((c, i) => (i === ci ? { ...c, color_name: value } : c)));
  };

  const setSizeColorImage = (ci, file) => {
    if (!file) return;
    const nextPreview = URL.createObjectURL(file);
    setSizeColors((prev) =>
      prev.map((c, i) => (i === ci ? { ...c, image: file, preview: nextPreview, remove_image: false } : c)),
    );
  };

  const clearSizeColorImage = (ci) => {
    setSizeColors((prev) =>
      prev.map((c, i) =>
        i === ci ? { ...c, image: null, preview: "", remove_image: c.has_existing_image } : c,
      ),
    );
  };

  const addSizeColorGallery = (ci, e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (files.length === 0) return;
    setSizeColors((prev) =>
      prev.map((c, i) =>
        i === ci
          ? {
              ...c,
              gallery: [...c.gallery, ...files],
              images_preview: [...c.images_preview, ...files.map((f) => URL.createObjectURL(f))],
            }
          : c,
      ),
    );
  };

  // saved images come first in the preview, new files come after them
  const removeSizeColorGallery = (ci, imageIndex) => {
    setSizeColors((prev) =>
      prev.map((c, i) => {
        if (i !== ci) return c;
        const savedCount = c.existing_gallery.length;
        if (imageIndex < savedCount) {
          return {
            ...c,
            existing_gallery: c.existing_gallery.filter((_, j) => j !== imageIndex),
            images_preview: c.images_preview.filter((_, j) => j !== imageIndex),
          };
        }
        const newIndex = imageIndex - savedCount;
        return {
          ...c,
          gallery: c.gallery.filter((_, j) => j !== newIndex),
          images_preview: c.images_preview.filter((_, j) => j !== imageIndex),
        };
      }),
    );
  };

  const addSizeColorSize = (ci) => {
    setSizeColors((prev) => prev.map((c, i) => (i === ci ? { ...c, sizes: [...c.sizes, makeSizeRow()] } : c)));
  };

  const updateSizeColorSize = (ci, si, field, value) => {
    setSizeColors((prev) =>
      prev.map((c, i) =>
        i === ci
          ? { ...c, sizes: c.sizes.map((s, j) => (j === si ? { ...s, [field]: value } : s)) }
          : c,
      ),
    );
  };

  const removeSizeColorSize = (ci, si) => {
    setSizeColors((prev) =>
      prev.map((c, i) => {
        if (i !== ci) return c;
        return { ...c, sizes: c.sizes.length === 1 ? [makeSizeRow()] : c.sizes.filter((_, j) => j !== si) };
      }),
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

  const addVariant = () => {
    setVariants((prev) => [...prev, { id: "", sku: "", stock: "", options: [{ option_name: "", option_value: "" }], images: [], existing_images: [], images_preview: [] }]);
  };

  const updateVariant = (index, field, value) => {
    setVariants((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };

  const removeVariant = (index) => {
    setVariants((prev) => prev.length === 1 ? [EMPTY_VARIANT] : prev.filter((_, i) => i !== index));
  };

  const addVariantOption = (variantIndex) => {
    setVariants((prev) => prev.map((row, i) => {
      if (i === variantIndex) {
        return { ...row, options: [...row.options, { option_name: "", option_value: "" }] };
      }
      return row;
    }));
  };

  const updateVariantOption = (variantIndex, optionIndex, field, value) => {
    setVariants((prev) => prev.map((row, i) => {
      if (i === variantIndex) {
        const newOptions = row.options.map((opt, j) => (j === optionIndex ? { ...opt, [field]: value } : opt));
        return { ...row, options: newOptions };
      }
      return row;
    }));
  };

  const removeVariantOption = (variantIndex, optionIndex) => {
    setVariants((prev) => prev.map((row, i) => {
      if (i === variantIndex) {
        const newOptions = row.options.length === 1 ? [{ option_name: "", option_value: "" }] : row.options.filter((_, j) => j !== optionIndex);
        return { ...row, options: newOptions };
      }
      return row;
    }));
  };

  const handleVariantImagesChange = (variantIndex, e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setVariants((prev) => prev.map((row, i) => {
      if (i === variantIndex) {
        return {
          ...row,
          images: [...row.images, ...files],
          images_preview: [...row.images_preview, ...files.map(file => URL.createObjectURL(file))]
        };
      }
      return row;
    }));
    e.target.value = "";
  };

  const handleRemoveVariantImage = (variantIndex, imageIndex, isExisting) => {
    setVariants((prev) => prev.map((row, i) => {
      if (i === variantIndex) {
        if (isExisting) {
          return {
            ...row,
            existing_images: row.existing_images.filter((_, j) => j !== imageIndex),
            images_preview: row.images_preview.filter((_, j) => j !== imageIndex)
          };
        } else {
          // It's a new uploaded image
          // imageIndex for new uploaded image is relative to existing_images.length
          const newImageIdx = imageIndex - row.existing_images.length;
          return {
            ...row,
            images: row.images.filter((_, j) => j !== newImageIdx),
            images_preview: row.images_preview.filter((_, j) => j !== imageIndex)
          };
        }
      }
      return row;
    }));
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
          ...(item.id ? { id: item.id } : {}), // saved size keeps its id, new size has none
          size: item.size.trim(),
          price: Number(item.price),
          stock: Number(item.stock) || 0,
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

  // NEW: base product price = smallest size price (across all colours in colour mode)
  const derivedBasePrice = useMemo(() => {
    const rows = sizePricingMode === "colors" ? sizeColors.flatMap((c) => c.sizes) : pricedSizes;
    const prices = rows.map((r) => Number(r.price)).filter((n) => n > 0);
    return prices.length ? Math.min(...prices) : "";
  }, [sizePricingMode, sizeColors, pricedSizes]);

  const handleSubmit = async () => {
    // Determine category characteristics (whole-word match, so "Smart Watches" is not Fine Art)
    const selectedCategoryObj = categories.find((c) => String(c.id) === String(formData.category));
    const catName = selectedCategoryObj?.name?.toLowerCase() || "";
    const isArt = /\bart(s|work)?\b/.test(catName);
    const useSizePricing = !isArt && hasSizePricing; // size pricing is for Variant products only

    // The product-level gallery is only used by Fine Art and size-only products
    const showGallery = isArt || (useSizePricing && sizePricingMode === "sizes");

    // base price comes from the sizes when size pricing is on
    if (!formData.name || (!useSizePricing && !formData.price)) {
      toast.error("Name and Price are required");
      return;
    }

    if (!formData.weight || !formData.length || !formData.width || !formData.height) {
      toast.error("Weight, Length, Width, and Height are required");
      return;
    }

    if (Number(formData.weight) <= 0 || Number(formData.length) <= 0 || Number(formData.width) <= 0 || Number(formData.height) <= 0) {
      toast.error("Weight, Length, Width, and Height must be greater than zero");
      return;
    }

    const validVariants = variants.filter((v) => v.sku.trim() !== "");

    // size-priced products have no SKU variants
    if (!isArt && !useSizePricing && validVariants.length === 0) {
      toast.error("Please add at least one product variant");
      return;
    }

    // Fine Art: every size needs a name, a price and its own stock
    if (isArt) {
      const filledRows = sizes.filter((r) => r.size.trim() || r.price !== "" || r.stock !== "");
      if (filledRows.length === 0) {
        toast.error("Add at least one size");
        return;
      }
      const seenArtSizes = new Set();
      for (const r of filledRows) {
        const name = r.size.trim();
        const label = name ? `"${name}"` : "a size";
        if (!name) { toast.error("Every size needs a name"); return; }
        if (!(Number(r.price) > 0)) { toast.error(`Price for ${label} must be greater than zero`); return; }
        if (r.stock === "" || !Number.isInteger(Number(r.stock)) || Number(r.stock) < 0) {
          toast.error(`Stock for ${label} must be a whole number, 0 or more`);
          return;
        }
        const key = name.toLowerCase();
        if (seenArtSizes.has(key)) { toast.error(`Size ${label} is added twice`); return; }
        seenArtSizes.add(key);
      }
    }

    // NEW: validate and build the size-pricing payload
    let sizeOnlyPayload = [];
    let colorPricingPayload = [];
    let colorPricingRows = []; // same order as colorPricingPayload, used to attach images by index
    let basePrice = Number(formData.price);

    if (useSizePricing) {
      if (sizePricingMode === "sizes") {
        const result = buildSizePayload(pricedSizes);
        if (result.error) { toast.error(result.error); return; }
        sizeOnlyPayload = result.payload;
        basePrice = Math.min(...sizeOnlyPayload.map((s) => s.price));
      } else {
        const rows = sizeColors.filter((c) => !isBlankSizeColor(c));
        if (rows.length === 0) {
          toast.error("Add at least one colour");
          return;
        }

        const seenColors = new Set();
        const allPrices = [];
        for (const c of rows) {
          const name = c.color_name.trim();
          if (!name) { toast.error("Every colour needs a name"); return; }
          const colorKey = name.toLowerCase();
          if (seenColors.has(colorKey)) { toast.error(`Colour "${name}" is added twice`); return; }
          seenColors.add(colorKey);

          const result = buildSizePayload(c.sizes, ` (${name})`);
          if (result.error) { toast.error(result.error); return; }
          result.payload.forEach((s) => allPrices.push(s.price));

          colorPricingPayload.push({
            ...(c.id ? { id: c.id } : {}), // saved colour keeps its id, new colour has none
            color_name: name,
            existing_gallery_image_ids: c.existing_gallery.map((g) => g.id), // saved gallery images to keep
            ...(c.remove_image && !c.image ? { remove_image: true } : {}),
            sizes: result.payload,
          });
          colorPricingRows.push(c);
        }
        basePrice = Math.min(...allPrices);
      }
    }

    setLoading(true);
    const data = new FormData();
    data.append("name", formData.name);
    if (formData.category) data.append("category", formData.category);
    if (formData.subcategory) data.append("subcategory", formData.subcategory);
    if (formData.brand) data.append("brand", formData.brand);
    if (formData.supplier) data.append("supplier", formData.supplier);
    data.append("price", basePrice);
    data.append("description", formData.description);
    data.append("specification", JSON.stringify(specificationPayload));

    // Always send the product type
    data.append("product_type", isArt ? "fine_art" : "variant");

    if (isArt) {
      data.append("sizes", JSON.stringify(sizesPayload));
      data.append("colors", JSON.stringify(colorsPayload.map(({ color_name }) => ({ color_name }))));
      // product stock = total of the size stocks (checkout checks each size's own stock)
      data.append("stock", sizesPayload.reduce((sum, s) => sum + s.stock, 0));
      data.append("frame_ids", JSON.stringify(selectedFrameIds));
      data.append("material_ids", JSON.stringify(selectedMaterialIds));
      colors.forEach((color, index) => {
        if (color.image) {
          data.append(`color_image_${index}`, color.image);
        }
      });
    } else if (useSizePricing) {
      // NEW: size-pricing product. Size-only sends sizes and colors = []; colour mode sends sizes = [] and colors.
      data.append("has_size_pricing", "true");
      data.append("sizes", JSON.stringify(sizePricingMode === "sizes" ? sizeOnlyPayload : []));
      data.append("colors", JSON.stringify(sizePricingMode === "colors" ? colorPricingPayload : []));

      if (sizePricingMode === "colors") {
        // the number in the key is the colour's position in the colors JSON array
        colorPricingRows.forEach((c, index) => {
          if (c.image) data.append(`color_image_${index}`, c.image);
          c.gallery.forEach((file) => data.append(`color_images_${index}`, file));
        });
      }
    } else {
      const payloadVariants = validVariants.map((v) => {
        const payloadV = {
          sku: v.sku.trim(),
          stock: Number(v.stock) || 0,
          options: v.options
            .filter((opt) => opt.option_name.trim() !== "" && opt.option_value.trim() !== "")
            .map((opt) => ({
              option_name: opt.option_name.trim(),
              option_value: opt.option_value.trim(),
            })),
        };
        if (v.id) {
          payloadV.id = v.id;
          payloadV.existing_images = v.existing_images;
        }
        return payloadV;
      });
      data.append("variants", JSON.stringify(payloadVariants));

      validVariants.forEach((v, index) => {
        v.images.forEach((file) => {
          data.append(`variant_images_${index}`, file);
        });
      });
    }

    data.append("is_featured", formData.is_featured);
    data.append("is_best_seller", formData.is_best_seller);
    data.append("is_published", formData.is_published);
    if (formData.supplier_cost) data.append("supplier_cost", Number(formData.supplier_cost));
    data.append("weight", Number(formData.weight));
    data.append("length", Number(formData.length));
    data.append("width", Number(formData.width));
    data.append("height", Number(formData.height));

    if (formData.image) data.append("image", formData.image);

    // new gallery files: only for Fine Art and size-only products
    if (showGallery) {
      formData.gallery.forEach((file) => data.append("images", file));
    }

    // edit mode only
    if (initialData) {
      if (removeMainImage && !formData.image) {
        data.append("remove_image", "true");
        data.append("remove_main_image", "true"); // the update view reads this name
      }

      if (showGallery) {
        if (removedGallery.length > 0) {
          data.append("removed_gallery", JSON.stringify(removedGallery));
        }

        // Send the IDs of the saved gallery images to KEEP.
        // The backend deletes every saved image that is not in this list.
        // Skipped when the saved images have no ids, so nothing is deleted by mistake.
        const allHaveIds = existingGallery.every(
          (g) => g && typeof g === "object" && g.id !== undefined && g.id !== null,
        );
        if (allHaveIds) {
          data.append(
            "existing_gallery_image_ids",
            JSON.stringify(existingGallery.map((g) => g.id)),
          );
        }
      }
    }

    try {
      if (initialData) {
        await updateProductNew(initialData.id, data);
        toast.success("Product updated successfully");
      } else {
        await addProduct(data);
        toast.success("Product added successfully");
      }
      queryClient.invalidateQueries({ queryKey: ['products'] });
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
    suppliers,
    loading,
    galleryPreview,
    variants,
    // NEW: size-based pricing
    hasSizePricing,
    setHasSizePricing,
    sizePricingMode,
    setSizePricingMode,
    sizePricingLocked,
    derivedBasePrice,
    pricedSizes,
    addPricedSize,
    updatePricedSize,
    removePricedSize,
    sizeColors,
    addSizeColor,
    removeSizeColor,
    updateSizeColorName,
    setSizeColorImage,
    clearSizeColorImage,
    addSizeColorGallery,
    removeSizeColorGallery,
    addSizeColorSize,
    updateSizeColorSize,
    removeSizeColorSize,
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
  };
}