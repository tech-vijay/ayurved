import { CartProvider } from '@/context/CartContext';
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext';
import { UserAuthProvider } from '@/context/UserAuthContext';
import { useHashRoute, parseRoute } from '@/lib/router';
import { ToastContainer } from '@/components/Toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import HomePage from '@/pages/HomePage';
import MedicinesPage from '@/pages/MedicinesPage';
import MedicineDetailPage from '@/pages/MedicineDetailPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import AppointmentPage from '@/pages/AppointmentPage';
import ContactPage from '@/pages/ContactPage';
import CategoriesPage from '@/pages/CategoriesPage';
import UserLoginPage from '@/pages/UserLoginPage';
import UserSignupPage from '@/pages/UserSignupPage';
import MyOrdersPage from '@/pages/MyOrdersPage';

import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import AdminLayout from '@/pages/admin/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminMedicines from '@/pages/admin/AdminMedicines';
import AdminCategories from '@/pages/admin/AdminCategories';
import AdminAppointments from '@/pages/admin/AdminAppointments';
import AdminOrders from '@/pages/admin/AdminOrders';

function AppRoutes() {
  const path = useHashRoute();
  const { segments } = parseRoute(path);
  const { session, isAdmin, loading: authLoading } = useAdminAuth();

  // Admin routes
  if (segments[0] === 'admin') {
    if (authLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }
    if (!session || !isAdmin) {
      return <AdminLoginPage />;
    }
    if (!segments[1] || segments[1] === 'dashboard') {
      return <AdminLayout><AdminDashboard /></AdminLayout>;
    }
    if (segments[1] === 'medicines') {
      return <AdminLayout><AdminMedicines /></AdminLayout>;
    }
    if (segments[1] === 'categories') {
      return <AdminLayout><AdminCategories /></AdminLayout>;
    }
    if (segments[1] === 'appointments') {
      return <AdminLayout><AdminAppointments /></AdminLayout>;
    }
    if (segments[1] === 'orders') {
      return <AdminLayout><AdminOrders /></AdminLayout>;
    }
    return <AdminLayout><AdminDashboard /></AdminLayout>;
  }

  // Auth pages (no header/footer)
  if (segments[0] === 'login') {
    return <UserLoginPage />;
  }
  if (segments[0] === 'signup') {
    return <UserSignupPage />;
  }

  // Patient routes
  let page: React.ReactNode;
  if (segments.length === 0) {
    page = <HomePage />;
  } else if (segments[0] === 'medicines') {
    page = <MedicinesPage />;
  } else if (segments[0] === 'medicine' && segments[1]) {
    page = <MedicineDetailPage id={segments[1]} />;
  } else if (segments[0] === 'cart') {
    page = <CartPage />;
  } else if (segments[0] === 'checkout') {
    page = <CheckoutPage />;
  } else if (segments[0] === 'appointment') {
    page = <AppointmentPage />;
  } else if (segments[0] === 'contact') {
    page = <ContactPage />;
  } else if (segments[0] === 'categories') {
    page = <CategoriesPage />;
  } else if (segments[0] === 'my-orders') {
    page = <MyOrdersPage />;
  } else {
    page = <HomePage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">{page}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AdminAuthProvider>
      <UserAuthProvider>
        <CartProvider>
          <AppRoutes />
          <ToastContainer />
        </CartProvider>
      </UserAuthProvider>
    </AdminAuthProvider>
  );
}
