// ================================
// src/main.js (FINAL FIXED VERSION — STATIC i18n)
// ================================

// 🔥 Firebase Imports
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import "@fortawesome/fontawesome-free/css/all.min.css";

// 🌐 Vue Imports
import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./assets/App.vue";
import "./assets/main.css";

// Toast
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

// STATIC i18n (no fetch, no errors, works on Vercel 100%)
import  i18n from "./i18n";

// ================================
// Component Imports
// ================================
import HomePage from "./components/HomePage.vue";
import OfferPage from "./components/OfferPage.vue";
import LoginPage from "./components/LoginPage.vue";
import SignUp from "./components/SignUp/SignUp.vue";
import ContactUs from "./components/ContactUs.vue";
import AboutUs from "./components/AboutUs.vue";
import ProfilesPage from "./components/ProfilesPage.vue";
import TechnicianProfile from "./components/technicianProfile.vue";
import ChatPage from "./components/ChatPage.vue";
import ManageUserProfile from "./components/MannageUserProfile.vue";
import forgotpassword from "./components/ForgotPassword.vue";

// Admin Dashboard
import DashboardLayout from "./components/AdminDashboard/Sisebar.vue";
import Dashboard from "./components/AdminDashboard/Dashboard.vue";
import Users from "./components/AdminDashboard/UsersTable.vue";
import Providers from "./components/AdminDashboard/ProvidersTable.vue";
import ServicesPage from "./components/AdminDashboard/ServicesPage.vue";
import Orders from "./components/AdminDashboard/Orders.vue";
import Payments from "./components/AdminDashboard/Payments.vue";
import Support from "./components/AdminDashboard/Support.vue";
import Settings from "./components/AdminDashboard/Settings.vue";
import AdminProfile from "./components/AdminDashboard/AdminProfile.vue";
import AddOffer from "./components/AdminDashboard/AddOffers.vue";

// Technician Dashboard
import TechncionDashboard from "./components/Technicion Dashboard/TechncionDashboard.vue";

// Company Dashboard
import CompanyDashboard from "./components/companyDashboard/CompanyDashboard.vue";

// User Pages
import UserOrders from "./components/UserOrders.vue";
import PaymentSuccess from "./components/PaymentSuccess.vue";
import PaymentFailed from "./components/PaymentFailed.vue";
import PaymentPage from "./components/PaymentPage.vue";
import CompanyProfile from "./components/CompanyProfile.vue";

// ================================
// Firebase Config
// ================================
const firebaseConfig = {
  apiKey: "AIzaSyCoEkOce-LY7cXvtJHzvyVaygMAjPIzU3k",
  authDomain: "tashteb-36a40.firebaseapp.com",
  projectId: "tashteb-36a40",
  storageBucket: "tashteb-36a40.firebasestorage.app",
  messagingSenderId: "716229351637",
  appId: "1:716229351637:web:5be022a580bcd8a67a6a5c",
  measurementId: "G-S9GFQC17GB",
};

initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();

// ================================
// Router Setup
// ================================
const routes = [
  { path: "/", component: HomePage },
  { path: "/offers", component: OfferPage },
  { path: "/login", component: LoginPage },
  { path: "/signup", component: SignUp },
  { path: "/about", component: AboutUs },
  { path: "/profiles/:service", name: "ProfilesPage", component: ProfilesPage },
  { path: "/profile/:id", component: TechnicianProfile },
  { path: "/company-profile/:id", component: CompanyProfile },
  { path: "/contactus", component: ContactUs },
  { path: "/chat", component: ChatPage },
  { path: "/manageUserProfile", component: ManageUserProfile },
  { path: "/forgot-password", component: forgotpassword, alias: "/forgotpassword" },
  { path: "/my-orders", name: "MyOrders", component: UserOrders, meta: { requiresAuth: true } },
  { path: "/payment", name: "PaymentPage", component: PaymentPage, meta: { requiresAuth: true } },
  { path: "/payment-success", name: "PaymentSuccess", component: PaymentSuccess },
  { path: "/payment-failed", name: "PaymentFailed", component: PaymentFailed },

  {
    path: "/dashboard",
    component: DashboardLayout,
    meta: { requiresAdmin: true },
    children: [
      { path: "", name: "DashboardHome", component: Dashboard },
      { path: "users", name: "Users", component: Users },
      { path: "providers", name: "Providers", component: Providers },
      { path: "services", name: "Services", component: ServicesPage },
      { path: "orders", name: "Orders", component: Orders },
      { path: "payments", name: "Payments", component: Payments },
      { path: "support", name: "Support", component: Support },
      { path: "settings", name: "Settings", component: Settings },
      { path: "addoffer", name: "AddOffer", component: AddOffer },
      {
        path: "adminprofile",
        name: "AdminProfile",
        component: AdminProfile,
        meta: { requiresAdmin: true },
      },
    ],
  },

  { path: "/technician-dashboard", component: TechncionDashboard, meta: { requiresTechnician: true } },
  { path: "/company-dashboard", name: "CompanyDashboard", component: CompanyDashboard, meta: { requiresCompany: true } },
  { path: "/technician-chat", name: "TechnicianChat", component: ChatPage, meta: { requiresTechnician: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

let authReady = false;

onAuthStateChanged(auth, () => {
  authReady = true;
});


// ================================
// Navigation Guards
// ================================
router.beforeEach(async (to, from, next) => {
  if (!authReady) {
    next();
    return;
  }
  const user = auth.currentUser;
  
  if (!user) {
    if (to.meta.requiresAuth || to.meta.requiresAdmin || to.meta.requiresTechnician || to.meta.requiresCompany) {
      next('/login');
    } else {
      next();
    }
    return;
  }

  try {
    const [adminDoc, techDoc, companyDoc, clientDoc] = await Promise.all([
      getDoc(doc(db, "admin", user.uid)),
      getDoc(doc(db, "technicians", user.uid)),
      getDoc(doc(db, "companies", user.uid)),
      getDoc(doc(db, "clients", user.uid))
    ]);

    // التحقق من حالة الحظر
    if ((techDoc.exists() && techDoc.data().status === "banned") ||
        (companyDoc.exists() && companyDoc.data().status === "banned") ||
        (adminDoc.exists() && adminDoc.data().status === "banned") ||
        (clientDoc.exists() && clientDoc.data().status === "banned")) {
      await auth.signOut();
      next('/login');
      return;
    }

    // 🔥 تحقق إضافي: منع الـ client من الدخول لـ dashboard routes حتى لو حاول يدخل مباشر
    if ((to.path.startsWith("/dashboard") || 
         to.path.startsWith("/technician-dashboard") || 
         to.path.startsWith("/company-dashboard")) && 
        clientDoc.exists()) {
      next('/'); // إرجاع العميل للصفحة الرئيسية
      return;
    }

    // التحقق من الصلاحيات
    if (to.meta.requiresAdmin && !adminDoc.exists()) {
      next('/');
      return;
    }
    if (to.meta.requiresTechnician && !techDoc.exists()) {
      next('/');
      return;
    }
    if (to.meta.requiresCompany && !companyDoc.exists()) {
      next('/');
      return;
    }

    next();
  } catch (error) {
    console.error("Navigation guard error:", error);
    next('/');
  }
});



// Save last dashboard route
// router.afterEach((to) => {
//   if (
//     to.path.startsWith("/dashboard") ||
//     to.path.startsWith("/technician-dashboard") ||
//     to.path.startsWith("/company-dashboard")
//   ) {
//     localStorage.setItem("lastDashboardRoute", to.fullPath);
//   }
// });
// Save last dashboard route
router.afterEach((to) => {
  if (
    to.path.startsWith("/dashboard") ||
    to.path.startsWith("/technician-dashboard") ||
    to.path.startsWith("/company-dashboard")
  ) {
    localStorage.setItem("lastDashboardRoute", to.fullPath);
  }
});

// ================================
// 🚀 Start App
// ================================
const app = createApp(App);
app.use(i18n);
app.use(router);



app.use(Toast, {
  position: "top-center",
  timeout: 5000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
});

app.mount("#app");

// ================================
// ================================
// Firebase Auth Listener
// ================================
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    localStorage.removeItem("lastDashboardRoute");
    if (
      router.currentRoute.value.meta.requiresAdmin ||
      router.currentRoute.value.meta.requiresTechnician ||
      router.currentRoute.value.meta.requiresCompany
    ) {
      router.push("/login");
    }
    return;
  }

  try {
    const [adminDoc, techDoc, companyDoc, clientDoc] = await Promise.all([
      getDoc(doc(db, "admin", user.uid)),
      getDoc(doc(db, "technicians", user.uid)),
      getDoc(doc(db, "companies", user.uid)),
      getDoc(doc(db, "clients", user.uid))
    ]);

    const currentPath = router.currentRoute.value.path;
    let lastRoute = localStorage.getItem("lastDashboardRoute");

    // التحقق من حالة الحظر أولاً
    if ((techDoc.exists() && techDoc.data().status === "banned") ||
        (companyDoc.exists() && companyDoc.data().status === "banned") ||
        (adminDoc.exists() && adminDoc.data().status === "banned") ||
        (clientDoc.exists() && clientDoc.data().status === "banned")) {
      await auth.signOut();
      router.push("/login");
      return;
    }

    // 🔥 التوجيه بناءً على نوع المستخدم - مع منع الـ client من الدخول للـ dashboards
    if (techDoc.exists()) {
      // technician
      if (!lastRoute || !lastRoute.startsWith("/technician-dashboard")) {
        lastRoute = "/technician-dashboard";
        localStorage.setItem("lastDashboardRoute", lastRoute);
      }
      if (["/", "/login", "/signup"].includes(currentPath) || 
          currentPath.startsWith("/dashboard") || 
          currentPath.startsWith("/company-dashboard")) {
        router.replace(lastRoute);
      }
    } else if (adminDoc.exists()) {
      // admin
      if (!lastRoute || !lastRoute.startsWith("/dashboard")) {
        lastRoute = "/dashboard";
        localStorage.setItem("lastDashboardRoute", lastRoute);
      }
      if (["/", "/login", "/signup"].includes(currentPath) ||
          currentPath.startsWith("/technician-dashboard") ||
          currentPath.startsWith("/company-dashboard")) {
        router.replace(lastRoute);
      }
    } else if (companyDoc.exists()) {
      // company
      if (!lastRoute || !lastRoute.startsWith("/company-dashboard")) {
        lastRoute = "/company-dashboard";
        localStorage.setItem("lastDashboardRoute", lastRoute);
      }
      if (["/", "/login", "/signup"].includes(currentPath) ||
          currentPath.startsWith("/dashboard") ||
          currentPath.startsWith("/technician-dashboard")) {
        router.replace(lastRoute);
      }
    } else if (clientDoc.exists()) {
      // 🔥 العميل العادي - امنعه من الدخول لأي dashboard
      if (currentPath.startsWith("/dashboard") || 
          currentPath.startsWith("/technician-dashboard") || 
          currentPath.startsWith("/company-dashboard")) {
        router.replace("/"); // إرجعه للصفحة الرئيسية
      }
      // احفظ آخر route للعميل (ولكن ليس dashboard)
      if (!currentPath.startsWith("/dashboard") && 
          !currentPath.startsWith("/technician-dashboard") && 
          !currentPath.startsWith("/company-dashboard")) {
        localStorage.setItem("lastClientRoute", currentPath);
      }
    } else {
      // إذا لم يكن المستخدم موجود في أي مجموعة
      await auth.signOut();
      router.push("/login");
    }
  } catch (error) {
    console.error("Error restoring dashboard route:", error);
  }
});