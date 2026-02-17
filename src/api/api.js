import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/admin/",
});

export const BASE_URL = "http://127.0.0.1:8000";

// GET products
export const getProducts = () => API.get("/products/");

// DELETE product
export const deleteProduct = (id) => API.delete(`/products/${id}/`);

// UPDATE product
export const updateProduct = (id, data) => API.put(`/products/${id}/`, data);

// --- Categories ---
export const getCategories = () => API.get("/view_categories/");
export const addCategory = (data) => API.post("/add_category/", data);
export const updateCategory = (id, data) => API.put(`/update_category/${id}/`, data);
export const deleteCategory = (id) => API.delete(`/delete_category/${id}/`);

// --- Brands ---
export const getBrands = () => API.get("/view_brands/");
export const addBrand = (data) => API.post("/add_brand/", data);
export const updateBrand = (id, data) => API.put(`/update_brand/${id}/`, data);
export const deleteBrand = (id) => API.delete(`/delete_brand/${id}/`);

export const getProductsView = () => API.get("/view_products/");
export const addProduct = (data) =>
  API.post("/add_products/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateProductNew = (id, data) =>
  API.post(`/update_product/${id}/`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteProductNew = (id) => API.delete(`/delete_product/${id}/`);

// --- Orders ---
export const getOrders = () => API.get("/view_orders/");
export const updateOrderStatus = (id, data) => API.put(`/update_order/${id}/`, data);

// --- Coupons ---
export const getCoupons = () => API.get("/view_coupons/");
export const addCoupon = (data) => API.post("/add_coupon/", data);
export const updateCoupon = (id, data) => API.put(`/update_coupon/${id}/`, data);
export const deleteCoupon = (id) => API.delete(`/delete_coupon/${id}/`);

// --- Customers ---
export const getCustomers = (params) => API.get("/view_users/", { params });
export const deleteCustomer = (id) => API.delete(`/delete_users/${id}/`);
