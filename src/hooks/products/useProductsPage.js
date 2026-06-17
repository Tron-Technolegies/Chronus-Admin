import { useMemo, useState } from "react";

export default function useProductsPage() {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    subcategory: "",
    min_price: "",
    max_price: "",
    is_published: "",
    is_featured: "",
    is_best_seller: "",
    low_stock: "",
  });
  const [filterInputs, setFilterInputs] = useState({
    category: "",
    subcategory: "",
    min_price: "",
    max_price: "",
    is_published: "",
    is_featured: "",
    is_best_seller: "",
    low_stock: "",
  });

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const openCreateModal = () => {
    setOpen(true);
  };

  const closeCreateModal = () => {
    setOpen(false);
  };

  const openEditModal = (row) => {
    setEditData(row);
  };

  const closeEditModal = () => {
    setEditData(null);
  };

  const handleEditSuccess = () => {
    handleSuccess();
    closeEditModal();
  };

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const updateCategoryFilter = (value) => {
    setFilterInputs((prev) => ({ ...prev, category: value }));
  };

  const updateSubCategoryFilter = (value) => {
    setFilterInputs((prev) => ({ ...prev, subcategory: value }));
  };

  const updateMinPriceFilter = (value) => {
    setFilterInputs((prev) => ({ ...prev, min_price: value }));
  };

  const updateMaxPriceFilter = (value) => {
    setFilterInputs((prev) => ({ ...prev, max_price: value }));
  };

  const updateDropdownFilter = (key, value) => {
    setFilterInputs((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setFilters({
      category: filterInputs.category.trim(),
      subcategory: filterInputs.subcategory.trim(),
      min_price: filterInputs.min_price.trim(),
      max_price: filterInputs.max_price.trim(),
      is_published: filterInputs.is_published,
      is_featured: filterInputs.is_featured,
      is_best_seller: filterInputs.is_best_seller,
      low_stock: filterInputs.low_stock,
    });
  };

  const clearFilters = () => {
    const empty = {
      category: "",
      subcategory: "",
      min_price: "",
      max_price: "",
      is_published: "",
      is_featured: "",
      is_best_seller: "",
      low_stock: "",
    };
    setFilters(empty);
    setFilterInputs(empty);
  };

  const activeFilterCount = useMemo(
    () => Object.values(filters).filter(Boolean).length,
    [filters],
  );

  return {
    open,
    editData,
    refreshKey,
    showFilters,
    filters,
    filterInputs,
    activeFilterCount,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    handleSuccess,
    handleEditSuccess,
    toggleFilters,
    updateCategoryFilter,
    updateSubCategoryFilter,
    updateMinPriceFilter,
    updateMaxPriceFilter,
    updateDropdownFilter,
    applyFilters,
    clearFilters,
  };
}
