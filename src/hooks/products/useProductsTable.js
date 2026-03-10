import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { deleteProductNew, getProductsView } from "../../api/api";
import { getApiErrorMessage } from "../../utils/apiError";

const DEFAULT_PAGINATION = {
  current_page: 1,
  total_pages: 1,
  total_products: 0,
  has_next: false,
  has_previous: false,
};

export default function useProductsTable({ filters = {}, refreshKey }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("-id");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);

  useEffect(() => {
    setPage(1);
  }, [search, sortBy, filters.category, filters.brand]);

  const queryParams = useMemo(() => {
    const params = {
      page,
      limit: 10,
      ordering: sortBy,
    };

    if (search) params.search = search;
    if (filters.category) params.category = filters.category;
    if (filters.brand) params.brand = filters.brand;

    return params;
  }, [page, sortBy, search, filters.category, filters.brand]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProductsView(queryParams);
      const responseData = res.data || {};
      const products = Array.isArray(responseData.products) ? responseData.products : [];
      const serverPagination = responseData.pagination || {};

      setRows(products);
      setPagination({
        current_page: serverPagination.current_page || page,
        total_pages: serverPagination.total_pages || 1,
        total_products: serverPagination.total_products || products.length,
        has_next: Boolean(serverPagination.has_next),
        has_previous: Boolean(serverPagination.has_previous),
      });
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
      fetchProducts();
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
    sortBy,
    setSortBy,
    page,
    setPage,
    pagination,
  };
}
