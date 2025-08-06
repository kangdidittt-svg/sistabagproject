import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/layout/Layout";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import Categories from "./pages/Categories";
import CategoryProducts from "./pages/CategoryProducts";
import Promos from "./pages/Promos";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminPromos from "./pages/admin/AdminPromos";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";
import ProductForm from "./pages/admin/ProductForm";
import CategoryForm from "./pages/admin/CategoryForm";
import PromoForm from "./pages/admin/PromoForm";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes with Layout */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/catalog" element={<Layout><Catalog /></Layout>} />
          <Route path="/product/:slug" element={<Layout><ProductDetail /></Layout>} />
          <Route path="/categories" element={<Layout><Categories /></Layout>} />
          <Route path="/category/:slug" element={<Layout><CategoryProducts /></Layout>} />
          <Route path="/promos" element={<Layout><Promos /></Layout>} />
          
          {/* Admin Routes */}
           <Route path="/admin/login" element={<AdminLogin />} />
           <Route path="/admin" element={
             <ProtectedRoute>
               <AdminLayout />
             </ProtectedRoute>
           }>
             <Route path="dashboard" element={<AdminDashboard />} />
             <Route path="products" element={<AdminProducts />} />
             <Route path="products/new" element={<ProductForm />} />
             <Route path="products/edit/:id" element={<ProductForm />} />
             <Route path="categories" element={<AdminCategories />} />
             <Route path="categories/new" element={<CategoryForm />} />
             <Route path="categories/edit/:id" element={<CategoryForm />} />
             <Route path="promos" element={<AdminPromos />} />
             <Route path="promos/new" element={<PromoForm />} />
             <Route path="promos/edit/:id" element={<PromoForm />} />
             <Route path="reports" element={<AdminReports />} />
             <Route path="settings" element={<AdminSettings />} />
           </Route>
          
          {/* 404 Page */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
