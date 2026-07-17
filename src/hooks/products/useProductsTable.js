import { useMemo, useState, useEffect } from "react";
import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteProductNew, getProductsView } from "../../api/api";
import { getApiErrorMessage } from "../../utils/apiError";

const DEFAULT_PAGINATION = {
  current_page: 1,
  total_pages: 1,
  total_products: 0,
  limit: 12,
  has_next: false,
  has_previous: false,
};

export default function useProductsTable({ filters = {} }) {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Reset page when filters or search change
  useEffect(() => {
    setPage(1);
  }, [
    search,
    filters.category,
    filters.subcategory,
    filters.min_price,
    filters.max_price,
    filters.is_published,
    filters.is_featured,
    filters.is_best_seller,
    filters.low_stock,
  ]);

  const queryParams = useMemo(() => {
    const params = {
      page,
      limit: 12,
    };

    if (search) params.search = search;
    if (filters.category) params.category = filters.category;
    if (filters.subcategory) params.subcategory = filters.subcategory;
    if (filters.min_price) params.min_price = filters.min_price;
    if (filters.max_price) params.max_price = filters.max_price;
    if (filters.is_published) params.is_published = filters.is_published;
    if (filters.is_featured) params.is_featured = filters.is_featured;
    if (filters.is_best_seller) params.is_best_seller = filters.is_best_seller;
    if (filters.low_stock) params.low_stock = filters.low_stock;

    return params;
  }, [
    page,
    search,
    filters.category,
    filters.subcategory,
    filters.min_price,
    filters.max_price,
    filters.is_published,
    filters.is_featured,
    filters.is_best_seller,
    filters.low_stock,
  ]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['products', queryParams],
    queryFn: async () => {
      const res = await getProductsView(queryParams);
      return res.data || {};
    },
    placeholderData: keepPreviousData,
  });

  if (isError) {
    toast.error(getApiErrorMessage(error, "Failed to fetch products"));
  }

  const rows = useMemo(() => Array.isArray(data?.products) ? data.products : [], [data]);
  
  const pagination = useMemo(() => {
    if (!data) return DEFAULT_PAGINATION;
    const currentPage = Number(data.page) || page;
    const totalPages = Math.max(Number(data.total_pages) || 1, 1);
    const totalProducts = Number(data.total_products) || 0;
    const limit = Number(data.limit) || 12;

    return {
      current_page: currentPage,
      total_pages: totalPages,
      total_products: totalProducts,
      limit,
      has_next: currentPage < totalPages,
      has_previous: currentPage > 1,
    };
  }, [data, page]);

  // Handle case where current page exceeds total pages
  useEffect(() => {
    if (data && data.total_pages) {
      const totalPages = Math.max(Number(data.total_pages) || 1, 1);
      const currentPage = Number(data.page) || page;
      if (currentPage > totalPages && totalPages > 0) {
        setPage(totalPages);
      }
    }
  }, [data, page]);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteProductNew(deleteId);
      toast.success("Product deleted successfully");
      setDeleteId(null);
      
      // Invalidate products query to trigger a background refetch
      queryClient.invalidateQueries({ queryKey: ['products'] });

      // If it was the last item on the page, go to previous page
      if (rows.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Delete failed"));
    }
  };

  const handleSearchSubmit = () => {
    setSearch(searchInput.trim());
    setPage(1);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  return {
    rows,
    loading: isLoading,
    deleteId,
    setDeleteId,
    handleDelete,
    searchInput,
    setSearchInput,
    handleSearchSubmit,
    clearSearch,
    page,
    setPage,
    pagination,
  };
}
