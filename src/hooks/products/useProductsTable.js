import { useCallback, useEffect, useMemo, useState } from "react";
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

export default function useProductsTable({ filters = {}, refreshKey }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);

  useEffect(() => {
    setPage(1);
  }, [search, filters.category, filters.subcategory, filters.min_price, filters.max_price]);

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

    return params;
  }, [page, search, filters.category, filters.subcategory, filters.min_price, filters.max_price]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProductsView(queryParams);
      const responseData = res.data || {};
      const products = Array.isArray(responseData.products) ? responseData.products : [];
      const currentPage = Number(responseData.page) || page;
      const totalPages = Math.max(Number(responseData.total_pages) || 1, 1);
      const totalProducts = Number(responseData.total_products) || 0;
      const limit = Number(responseData.limit) || 12;

      setRows(products);
      setPagination({
        current_page: currentPage,
        total_pages: totalPages,
        total_products: totalProducts,
        limit,
        has_next: currentPage < totalPages,
        has_previous: currentPage > 1,
      });

      if (currentPage > totalPages) {
        setPage(totalPages);
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to fetch products"));
    } finally {
      setLoading(false);
    }
  }, [queryParams, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, refreshKey]);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteProductNew(deleteId);
      toast.success("Product deleted successfully");
      setDeleteId(null);

      if (rows.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        fetchProducts();
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
    loading,
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
