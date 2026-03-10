import { useMemo, useState } from "react";

export default function useProductsPage() {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ category: "", brand: "" });
  const [filterInputs, setFilterInputs] = useState({ category: "", brand: "" });

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

  const updateBrandFilter = (value) => {
    setFilterInputs((prev) => ({ ...prev, brand: value }));
  };

  const applyFilters = () => {
    setFilters({
      category: filterInputs.category.trim(),
      brand: filterInputs.brand.trim(),
    });
  };

  const clearFilters = () => {
    setFilters({ category: "", brand: "" });
    setFilterInputs({ category: "", brand: "" });
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
    updateBrandFilter,
    applyFilters,
    clearFilters,
  };
}
