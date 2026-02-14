import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // change to your backend
});

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

// --- Products (Updated with correct paths if needed) ---
// The original getProducts was /products/, but user request implies /view_products/ based on the pattern, 
// OR we can keep /products/ if that's what the backend actually server. 
// However, the user provided paths: path('view_products/', views.view_products, name='view_products'),
// So I should probably align with those if I strictly follow the user's provided URLs.
// But the existing code had /products/. I will add the new ones and uncomment/comment as needed or just append.
// The user provided: path('view_products/', views.view_products, name='view_products')
// Let's override the existing ones to match the user's request precisely.

export const getProductsView = () => API.get("/view_products/"); // Naming it getProductsView to differentiate if needed, or just replace getProducts
export const addProduct = (data) => API.post("/add_products/", data, {
    headers: { "Content-Type": "multipart/form-data" },
});
export const updateProductNew = (id, data) => API.put(`/update_product/${id}/`, data, {
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
export const getCustomers = () => API.get("/view_customers/");
export const deleteCustomer = (id) => API.delete(`/delete_customer/${id}/`);
