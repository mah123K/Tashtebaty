<script setup>
import { uploadImageOnly } from "@/composables/useImageUpload";
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { db, auth } from "@/firebase/firebase";
import ChatBot from "./chatbot/ChatBot.vue";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  updateDoc, 
  serverTimestamp,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// 🟩 Import card component
import UserServiceCard from "../components/UserServiceCard.vue";
// NEW: Import the custom alert popup
import AlertPopup from "../components/AlertPopup.vue"; // <-- Adjust path if needed

// -------------------- Robust Dark-mode detection --------------------
const isDark = ref(false);

// helper to read current state (try html then body)
const readDarkClass = () =>
  document.documentElement.classList.contains("dark") ||
  document.body.classList.contains("dark");

// MutationObserver and matchMedia refs
let observer = null;
let mq = null;
let pollIntervalId = null;

onMounted(() => {
  // initial
  isDark.value = readDarkClass();
  console.log("[dark-detect] initial isDark =", isDark.value);

  // observer
  observer = new MutationObserver(() => {
    const val = readDarkClass();
    if (isDark.value !== val) {
      isDark.value = val;
      console.log("[dark-detect] MutationObserver set isDark =", val);
    }
  });

  try {
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
  } catch (e) {
    console.warn("[dark-detect] observer.observe failed:", e);
  }

  // matchMedia fallback (only update when no explicit class present)
  try {
    mq = window.matchMedia("(prefers-color-scheme: dark)");
    const mqHandler = (ev) => {
      const explicit = document.documentElement.classList.contains("dark") || document.body.classList.contains("dark");
      if (!explicit) {
        isDark.value = !!ev.matches;
        console.log("[dark-detect] matchMedia change -> isDark =", isDark.value);
      }
    };
    mq.addEventListener ? mq.addEventListener("change", mqHandler) : mq.addListener(mqHandler);
    mq.__handler = mqHandler;
  } catch (e) {
    console.warn("[dark-detect] matchMedia not supported", e);
  }

  // POLL fallback (مهم جداً في بعض الحالات)
  pollIntervalId = setInterval(() => {
    const val = readDarkClass();
    if (isDark.value !== val) {
      isDark.value = val;
      console.log("[dark-detect] Poll set isDark =", val);
    }
  }, 150);
});

onUnmounted(() => {
  try { if (observer) observer.disconnect(); } catch (e) { /* ignore */ }
  try {
    if (mq && mq.__handler) {
      mq.removeEventListener ? mq.removeEventListener("change", mq.__handler) : mq.removeListener(mq.__handler);
    }
  } catch (e) { /* ignore */ }
  try { if (pollIntervalId) clearInterval(pollIntervalId); } catch (e) { /* ignore */ }
  console.log("[dark-detect] cleaned up");
});
// -------------------- End dark-mode detection --------------------

const couponDark = new URL('../images/coupon.png', import.meta.url).href;
const couponLight = new URL('../images/coupon light.png', import.meta.url).href;


// NEW: Refs for the custom alert popup
const showPopupMessage = ref(false);
const popupMessageContent = ref("");

// 🟦 Work Gallery images from Firestore
const galleryImages = ref([]);
const isCustomService = ref(false);

// NEW: Helper functions for custom alert popup
const triggerAlert = (message) => {
  popupMessageContent.value = message;
  showPopupMessage.value = true;
};
const closeAlert = () => {
  showPopupMessage.value = false;
  popupMessageContent.value = "";
};

// 🟦 Dynamic service list from Firestore
const serviceList = ref([]);

// Completed orders count for this technician
const completedCount = ref(0);

let _ordersUnsub = null;

const showPopup = ref(false);
const uploadedFiles = ref([]);
const selectedDayInfo = ref(null);
const selectedTime = ref("");
const currentIndex = ref(0);

const route = useRoute();
const router = useRouter();
const technician = ref(null);
const isLoading = ref(true);
const isSubmitting = ref(false);

// Stores the fetched availability schedule from Firebase
const availabilitySchedule = ref([]);

// Live orders for this technician (to mark booked appointments)
const technicianOrders = ref([]);

// Holds the currently logged-in user (client)
const clientUser = ref(null);
const clientData = ref(null);

const serviceTitle = ref("");
const servicePrice = ref("");
const isPriceLocked = ref(false);
const orderDescription = ref("");
const availableOffers = ref([]);
const selectedOffer = ref(null);

// --- NEW: computed filtered offers for the current technician's section ---
// helper to normalize section/skill strings to the offer targetType values
const normalizeSectionKey = (str) => {
  if (!str) return "";
  const s = String(str).trim().toLowerCase();
  if (s.includes("plumb")) return "plumbing";
  if (s.includes("elect") || s.includes("electric")) return "electrical";
  if (s.includes("carpen") || s.includes("carpentry")) return "carpentry";
  if (s.includes("finish") || s.includes("finishing") || s.includes("painting")) return "finishing";
  // fallback: return raw lowercase
  return s;
};

// compute techSectionKey once technician is loaded
const technicianSectionKey = computed(() => normalizeSectionKey(technician.value?.skill || technician.value?.category || ""));

// filtered list: only offers that match technicianSectionKey (or offers that target "all" or multiple categories containing the key)
const filteredAvailableOffers = computed(() => {
  const key = technicianSectionKey.value;
  if (!key) return availableOffers.value || [];

  return (availableOffers.value || []).filter((o) => {
    // handle different offer structures safely
    const target = (o.targetType || "").toString().toLowerCase();
    if (target && target === key) return true;
    if (target === "all") return true;
    // support multiple-categories array
    const cats = o.targetCategories || o.categories || [];
    if (Array.isArray(cats) && cats.length > 0) {
      // compare normalized category values
      return cats.some((c) => {
        const cc = (c && c.toString().toLowerCase()) || "";
        return cc === key || cc.includes(key);
      });
    }
    // fallback: if offer has a 'section' or 'category' field
    const alt = (o.section || o.category || "").toString().toLowerCase();
    if (alt && alt === key) return true;

    return false;
  });
});
// --- END NEW computed ---
// Helper to format an offer's discount into a percentage string (e.g., "10%")
const formatOfferPercent = (offer) => {
  if (!offer) return "";
  // try multiple possible fields
  const raw =
    offer.discountValue ??
    offer.discount ??
    offer.value ??
    offer.discount_amount ??
    "";
  let s = String(raw ?? "").trim();
  if (!s) {
    // try title fallback (e.g., "10% off Electrical")
    const t = (offer.title || "").match(/(\d+(\.\d+)?%?)/);
    if (t) s = t[1];
  }
  // remove % if present
  s = s.replace("%", "").trim();
  let num = Number(s);
  if (!Number.isFinite(num)) {
    // try parse as fraction like 0.1
    const maybeFrac = Number(String(raw).trim());
    if (Number.isFinite(maybeFrac)) {
      num = maybeFrac;
    } else {
      return String(offer.discountValue ?? offer.discount ?? offer.title ?? "");
    }
  }
  if (Math.abs(num) <= 1 && num !== 0) {
    num = num * 100;
  }
  // ensure integer if whole, else keep one decimal
  const formatted = Number.isInteger(num) ? String(num) : Number(num.toFixed(1)).toString();
  return `${formatted}%`;
};
// --- Live Feedbacks from Firestore Ratings ---
const feedbacks = ref([]);

// ===== Carousel for Services =====
const currentSlide = ref(0);
// Hide arrows if there are fewer than 4 real services (custom not counted)
const showArrows = computed(() => serviceList.value.length >= 4);

const chunkedServices = computed(() => {
  const chunkSize = 4; // Always 4 per slide
  const services = [...serviceList.value]; // copy array
  // Add the custom service as the first card
  services.unshift({ id: "custom-service" });
  const chunks = [];
  for (let i = 0; i < services.length; i += chunkSize) {
    chunks.push(services.slice(i, i + chunkSize));
  }
  return chunks;
});

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return null;
  const numeric = Number(amount);
  if (!Number.isFinite(numeric)) return null;
  const formatted = Number.isInteger(numeric)
    ? numeric.toString()
    : numeric.toFixed(2);
  return `${formatted} EGP`;
};

const parsePriceInput = (value) => {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  const numericString = String(value)
    .replace(/,/g, "")
    .replace(/[^\d.]/g, "");
  if (!numericString) return null;
  const parsed = parseFloat(numericString);
  return Number.isFinite(parsed) ? parsed : null;
};

const offerTotals = computed(() => {
  const basePrice = parsePriceInput(servicePrice.value);

  if (basePrice === null) {
    return { basePrice: null, discountAmount: 0, finalPrice: null };
  }

  if (!selectedOffer.value) {
    return { basePrice, discountAmount: 0, finalPrice: basePrice };
  }

  const sel = selectedOffer.value;
  let discountAmount = 0;

  // ---- FLAT DISCOUNT (EGP) ----
  if ((sel.discountType || "").toLowerCase() === "flat") {
    const flat = Number(sel.discountValue) || 0;
    // يخصم 50 EGP أو أي قيمة لكن مش أكتر من السعر الأساسي
    discountAmount = Math.min(Math.max(flat, 0), basePrice);
  }

  // ---- PERCENTAGE DISCOUNT ----
  else {
    const rawVal = String(sel.discountValue ?? "").replace("%", "").trim();
    let num = Number(rawVal);

    if (!Number.isFinite(num)) {
      // fallback لو المستخدم كتب نص غلط
      const maybeFrac = Number(String(sel.discountValue).trim());
      if (Number.isFinite(maybeFrac)) num = maybeFrac;
      else num = 0;
    }

    // لو مكتوبة 0.2 يخليها 20%
    let discountPercent = num;
    if (Math.abs(discountPercent) <= 1 && discountPercent !== 0) {
      discountPercent = discountPercent * 100;
    }

    // يمنع أخطاء الإدخال: 0 → 100
    discountPercent = Math.min(Math.max(discountPercent, 0), 100);

    // حساب نسبة الخصم
    discountAmount = (basePrice * discountPercent) / 100;

    // clamp
    discountAmount = Math.min(Math.max(discountAmount, 0), basePrice);
  }

  const finalPrice = Number((basePrice - discountAmount).toFixed(2));

  return {
    basePrice,
    discountAmount,
    finalPrice,
  };
});




const priceSummary = computed(() => {
  const { basePrice, discountAmount, finalPrice } = offerTotals.value;

  if (basePrice === null) {
    return {
      show: false,
      originalLabel: null,
      discountLabel: null,
      finalLabel: null,
    };
  }

  return {
    show: true,
    originalLabel: formatCurrency(basePrice),
    discountLabel: discountAmount > 0 ? formatCurrency(discountAmount) : null,
    finalLabel: formatCurrency(finalPrice ?? basePrice),
  };
});

const nextSlide = () => {
  if (currentSlide.value < chunkedServices.value.length - 1) {
    currentSlide.value++;
  }
};

// --- Feedback carousel controls ---
const nextFeedback = () => {
  if (feedbacks.value.length === 0) return;
  currentIndex.value = (currentIndex.value + 1) % feedbacks.value.length;
};

const prevFeedback = () => {
  if (feedbacks.value.length === 0) return;
  currentIndex.value = (currentIndex.value - 1 + feedbacks.value.length) % feedbacks.value.length;
};

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--;
  }
};

// --- Computed Properties ---
const technicianName = computed(() => technician.value?.name || "Technician");
const technicianSkill = computed(() => technician.value?.skill || "Specialty");
const technicianLocation = computed(() => technician.value?.address.city || "Not Specified");
const technicianRating = computed(() => Math.round(technician.value?.ratingAverage || 0));
const technicianReviews = computed(() => technician.value?.ratingCount || 0);
const technicianProfileImage = computed(
  () => (typeof technician.value?.profileImage === 'string' && technician.value?.profileImage) ? technician.value?.profileImage : "/images/engineerligt.png"
); 
const technicianMemberSince = computed(() => {
  const ca = technician.value?.createdAt;
  if (!ca) return "N/A";

  let date;
  // Firestore Timestamp object (has toDate)
  if (ca && typeof ca.toDate === "function") {
    date = ca.toDate();
  }
  // Plain object with seconds (e.g., { seconds, nanoseconds })
  else if (ca && typeof ca === "object" && ("seconds" in ca || "_seconds" in ca)) {
    const seconds = ca.seconds ?? ca._seconds;
    date = new Date(seconds * 1000);
  }
  // ISO string or numeric
  else {
    date = new Date(ca);
  }

  if (!(date instanceof Date) || isNaN(date.getTime())) return "N/A";
  // Return readable full date: e.g. "Oct 24, 2025"
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
});


// 🧠 Analyze uploaded image using Google Gemini Vision API
const analyzeImageWithAI = async () => {
  try {
    if (uploadedFiles.value.length === 0) {
      triggerAlert("Please upload a photo first.");
      return;
    }

    const file = uploadedFiles.value[0];
    if (!file.type.startsWith("image/")) {
      triggerAlert("Invalid file type. Please select an image.");
      return;
    }

    // 🔹 Convert image to Base64
    const reader = new FileReader();
    const base64Image = await new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    triggerAlert("Analyzing image, please wait...");

    // 🔹 Call backend Gemini proxy
    const response = await fetch("https://tashtebaty.vercel.app/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        base64: base64Image,
        mimeType: file.type,
        prompt: "صف المشكلة الموجودة في الصورة بجملة قصيرة وواضحة بالعربية.",
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const aiText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "تعذر تحليل الصورة، حاول مرة أخرى.";

    orderDescription.value = aiText;
    triggerAlert("AI description generated successfully!");
  } catch (err) {
    console.error("AI analysis error:", err);
    triggerAlert("Failed to analyze image.");
  }
};



// ✅ Converts "09:00 AM" → "09:00 PM" into 12-hour slot list (every 30 mins)
const generateTimeSlots = (startStr, endStr, intervalMinutes = 30) => {
  const slots = [];
  if (!startStr || !endStr) return slots;

  try {
    // parse 12h strings with AM/PM
    const parse12h = (str) => {
      const [time, period] = str.split(" ");
      let [hours, minutes] = time.split(":").map(Number);
      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;
      return { hours, minutes };
    };

    const { hours: startH, minutes: startM } = parse12h(startStr);
    const { hours: endH, minutes: endM } = parse12h(endStr);

    const current = new Date();
    current.setHours(startH, startM, 0, 0);
    const end = new Date();
    end.setHours(endH, endM, 0, 0);

    // if end < start (invalid), skip
    if (end <= current) return slots;

    while (current <= end) {
      slots.push(
        current.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
      current.setMinutes(current.getMinutes() + intervalMinutes);
    }
  } catch (e) {
    console.error("Error generating time slots:", e);
  }
  return slots;
};


const activeAvailableDays = computed(() => {
  const available = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    const schedule = availabilitySchedule.value.find((d) => d.name === dayName && d.active);
    if (schedule) {
      available.push({
        date: date,
        name: dayName,
        display: date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
        }),
      });
    }
  }
  return available;
});

const availableTimeSlots = computed(() => {
  if (!selectedDayInfo.value) return [];
  const dayName = selectedDayInfo.value.name;
  const schedule = availabilitySchedule.value.find((d) => d.name === dayName && d.active);
  if (schedule && schedule.start && schedule.end) {
    return generateTimeSlots(schedule.start, schedule.end, 30);
  }
  return [];
});

// Set of booked times for currently selected day (based on existing orders)
const bookedTimesForSelectedDay = computed(() => {
  if (!selectedDayInfo.value || technicianOrders.value.length === 0) return new Set();
  const dayDisplay = selectedDayInfo.value.display;
  const times = technicianOrders.value
    .filter((o) => o.appointmentDay === dayDisplay)
    .map((o) => o.appointmentTime)
    .filter(Boolean);
  return new Set(times);
});

// --- Popup, Form & Order Submission ---
const openPopup = (service = null, price = null) => {
  if (!clientUser.value) {
    triggerAlert("Please select an available day and time.");
    router.push("/login");
    return;
  }

  showPopup.value = true;
  selectedDayInfo.value = null;
  selectedTime.value = "";
  uploadedFiles.value = [];
  orderDescription.value = "";
  selectedOffer.value = null;

  if (service && price) {
    // 🔹 Predefined technician service
    serviceTitle.value = service;
    servicePrice.value = price;
    orderDescription.value = service;
    isPriceLocked.value = true;
    isCustomService.value = false; // hide AI button
  } else {
    // 🔹 Custom service
    serviceTitle.value = "Custom Service Request";
    servicePrice.value = "";
    orderDescription.value = "";
    isPriceLocked.value = false;
    isCustomService.value = true; // show AI button
  }
};


const closePopup = () => {
  showPopup.value = false;
  selectedOffer.value = null;
};

// ✅ Add below your existing uploadedFiles ref
const previewUrls = ref([]);
const uploadStatus = ref("");

const handleFileUpload = async (event) => {
  const files = Array.from(event.target.files || []);
  uploadedFiles.value = files;
  previewUrls.value = [];
  uploadStatus.value = "";

  // 🟦 Step 1: show previews first
  for (const file of files) {
    if (file && file.type && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewUrls.value.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  // 🟦 Step 2: upload (after short wait to render previews)
  if (files.length > 0) {
    uploadStatus.value = "Uploading image...";
    await new Promise((resolve) => setTimeout(resolve, 200)); // let DOM render
    try {
      const urls = await uploadImagesToCloudinary(files);
      uploadStatus.value = "Image uploaded successfully!";
      console.log("✅ Uploaded URLs:", urls);
    } catch (err) {
      console.error("Upload failed:", err);
      uploadStatus.value = "Upload failed. Please try again.";
    }
  }
};



// 🟩 Upload images using Cloudinary (same as WorkGallery)
const uploadImagesToCloudinary = async (files) => {
  const urls = [];
  for (const file of files) {
    const imageUrl = await uploadImageOnly(file); // ✅ same Cloudinary method
    urls.push(imageUrl);
  }
  return urls;
};

const fetchAvailableOffers = async (uidParam, techSectionParam) => {
  // uidParam: uid of client (claimedOffers are stored per client)
  // techSectionParam: e.g. 'electrical' - the technician's section/skill (normalized)
  const targetUid = uidParam || clientUser.value?.uid;
  if (!targetUid) {
    availableOffers.value = [];
    return;
  }

  // normalize technician section (lowercase, trim)
  const techSec = (techSectionParam || technician.value?.skill || "")
    .toString()
    .toLowerCase()
    .trim();

  try {
    const offersCol = collection(db, "clients", targetUid, "claimedOffers");
    const snapshot = await getDocs(offersCol);

    const list = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() || {};

      // skip if already used
      if (data.used === true) return;

      // skip if explicitly inactive or deleted
      if (data.active === false) return;
      if (data.deletedAt) return;

      // determine offer's target (normalize)
      const offerTarget = (data.targetType || "")
        .toString()
        .toLowerCase()
        .trim();

      // If offer uses 'targetCategories' array, normalize values
      const offerCats = Array.isArray(data.targetCategories)
        ? data.targetCategories.map((c) => (c || "").toString().toLowerCase().trim())
        : [];

      // Accept offer if:
      // - targetType === 'all'
      // - targetType explicitly matches technician section
      // - targetCategories includes technician section
      // - OR offer has no targeting (treat as global)
      let matchesSection = false;
      if (!offerTarget || offerTarget === "all") matchesSection = true;
      if (offerTarget && techSec && offerTarget === techSec) matchesSection = true;
      if (offerCats.length > 0 && techSec && offerCats.includes(techSec)) matchesSection = true;

      if (!matchesSection) return;

      // all checks passed => include
      list.push({ docId: docSnap.id, ...data });
    });

    availableOffers.value = list;
  } catch (error) {
    console.error("Error fetching claimed offers:", error);
    availableOffers.value = [];
  }
};


const markOfferAsUsed = async ({
  offer,
  orderId,
  priceBefore,
  priceAfter,
  discountAmount,
}) => {
  try {
    const targetUid = clientUser.value?.uid;
    if (!targetUid || !offer) return;

    const offerDocId = offer.docId || offer.id;
    if (!offerDocId) return;

    const offerRef = doc(db, "clients", targetUid, "claimedOffers", offerDocId);
    await updateDoc(offerRef, {
      used: true,
      usedAt: serverTimestamp(),
      orderId,
      priceBeforeDiscount: priceBefore ?? null,
      finalPrice: priceAfter ?? null,
      discountAmount: discountAmount ?? null,
    });
  } catch (error) {
    console.error("Error marking offer as used:", error);
  }
};

watch(
  clientUser,
  (user) => {
    if (user?.uid) {
      const techSection = (technician.value?.skill || "").toLowerCase().trim();
      fetchAvailableOffers(user.uid, techSection);
    } else {
      availableOffers.value = [];
      selectedOffer.value = null;
    }
  },
  { immediate: true }
);


watch(
  availableOffers,
  (offers) => {
    if (!selectedOffer.value) return;
    const selectedId = selectedOffer.value.docId || selectedOffer.value.id;
    if (!selectedId) {
      selectedOffer.value = null;
      return;
    }
    const stillExists = offers.some(
      (offer) => (offer.docId || offer.id) === selectedId
    );
    if (!stillExists) {
      selectedOffer.value = null;
    }
  },
  { deep: true }
);



const submitOrder = async () => {
  if (!selectedDayInfo.value || !selectedTime.value || !clientUser.value || !technician.value) {
    triggerAlert("Please select an available day and time.");
    return;
  }

  if (isCustomService.value) {
  if (!orderDescription.value.trim()) {
    triggerAlert("Please provide a description for your custom service.");
    isSubmitting.value = false;
    return;
  }
  if (!servicePrice.value.trim()) {
    triggerAlert("Please enter an estimated price or budget.");
    isSubmitting.value = false;
    return;
  }
} 
  const totals = offerTotals.value;
  if (selectedOffer.value && totals.basePrice === null) {
    triggerAlert("Please enter a valid price before applying an offer.");
    return;
  }

  isSubmitting.value = true;

  try {
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const selectedDate = new Date(selectedDayInfo.value.date);
    const [time, period] = selectedTime.value.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    selectedDate.setHours(hours, minutes, 0, 0);

    const fallbackPriceNumber = parsePriceInput(servicePrice.value);
    const basePriceNumber = totals.basePrice ?? fallbackPriceNumber ?? null;
    const finalPriceNumber =
      totals.finalPrice !== null
        ? totals.finalPrice
        : basePriceNumber;
    const orderPriceValue = finalPriceNumber ?? fallbackPriceNumber ?? null;
    const discountAmountValue =
      totals.discountAmount > 0
        ? Number(totals.discountAmount.toFixed(2))
        : null;
    const storedPrice =
      orderPriceValue ?? (servicePrice.value || "Pending Quote");

    const orderData = {
      clientId: clientUser.value.uid,
      clientName: clientData.value?.name || clientUser.value.email.split("@")[0],
      clientEmail: clientUser.value.email,
      technicianId: route.params.id,
      technicianName: technician.value.name || "Technician",
      technicianSkill: technician.value.skill || "General",
      serviceTitle: serviceTitle.value || "Custom Service Request",
      description: orderDescription.value || serviceTitle.value || "",
      price: storedPrice,
      priceBeforeDiscount: basePriceNumber,
      discountAmount: discountAmountValue,
      discountedPrice: finalPriceNumber ?? basePriceNumber,
      appliedOffer: selectedOffer.value
        ? {
            docId: selectedOffer.value.docId || selectedOffer.value.id,
            title: selectedOffer.value.title,
            discountType: selectedOffer.value.discountType || "flat",
            discountValue: selectedOffer.value.discountValue || 0,
          }
        : null,
      appointmentDate: selectedDate,
      appointmentDay: selectedDayInfo.value.display,
      appointmentTime: selectedTime.value,
      status: "new",
      createdAt: serverTimestamp(),

      descreption: orderDescription.value || serviceTitle.value || "",
      date: selectedDayInfo.value.display || "",
      time: selectedTime.value || "",
      location: clientData.value?.address || "Not Specified",
      customer: clientData.value?.name || clientUser.value.email.split("@")[0],
      orderCode: verificationCode,
    };

    // Add order first
    const docRef = await addDoc(collection(db, "orders"), orderData);

    // 🔹 Upload any attached images to Firebase
    // 🔹 Upload any attached images to Firebase (same logic as WorkGallery)
    if (uploadedFiles.value.length > 0) {
      const imageUrls = await uploadImagesToCloudinary(uploadedFiles.value);
      await updateDoc(docRef, { imageUrls });
    }

    if (selectedOffer.value) {
      await markOfferAsUsed({
        offer: selectedOffer.value,
        orderId: docRef.id,
        priceBefore: basePriceNumber,
        priceAfter: finalPriceNumber ?? basePriceNumber ?? orderPriceValue,
        discountAmount: discountAmountValue,
      });
      if (clientUser.value?.uid) {
        await fetchAvailableOffers(clientUser.value.uid);
      }
      selectedOffer.value = null;
    }



    console.log("Order submitted with ID:", docRef.id);
    triggerAlert("Order submitted successfully!");
    closePopup();
  } catch (error) {
    console.error("Error submitting order:", error);
    triggerAlert("Failed to submit order. Please try again.");
  } finally {
    isSubmitting.value = false;
  }
};

// --- Fetch Technician, Client, and Services ---
const fetchTechnicianServices = async (technicianId) => {
  try {
    const servicesRef = collection(db, "technicians", technicianId, "services");
    const snapshot = await getDocs(servicesRef);
    serviceList.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching technician services:", error);
  }
};

// 🟩 NEW: Fetch Technician Gallery
const fetchTechnicianGallery = async (technicianId) => {
  try {
    const galleryRef = collection(db, "technicians", technicianId, "gallery");
    const snapshot = await getDocs(galleryRef);
    galleryImages.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching technician gallery:", error);
    galleryImages.value = [];
  }
};

onMounted(async () => {
  isLoading.value = true;

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      clientUser.value = user;
      const clientDocRef = doc(db, "clients", user.uid);
      const clientDocSnap = await getDoc(clientDocRef);
      if (clientDocSnap.exists()) {
        clientData.value = clientDocSnap.data();
      } else {
        clientData.value = { name: user.email.split("@")[0] };
      }
    } else {
      clientUser.value = null;
      clientData.value = null;
    }
  });

  const technicianIdParam = route.params.id;
  if (!technicianIdParam) {
    console.error("No technician ID found in route.");
    isLoading.value = false;
    return;
  }
  try {
    const docRef = doc(db, "technicians", technicianIdParam);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      technician.value = docSnap.data();
      const techSection = (technician.value?.skill || "").toLowerCase().trim();
      // if user already logged in:
      if (clientUser.value?.uid) {
        await fetchAvailableOffers(clientUser.value.uid, techSection);
      }
      if (technician.value.availability && Array.isArray(technician.value.availability)) {
        availabilitySchedule.value = technician.value.availability;
      } else {
        availabilitySchedule.value = [];
      }

      // 🟩 Fetch technician services dynamically
      await fetchTechnicianServices(technicianIdParam);

      // 🟩 Fetch technician gallery dynamically
      await fetchTechnicianGallery(technicianIdParam);

      // 🟩 Listen for completed orders count (live)
      try {
        const ordersRef = collection(db, "orders");
        const q = query(
          ordersRef,
          where("technicianId", "==", technicianIdParam),
          where("status", "==", "completed")
        );
        _ordersUnsub = onSnapshot(q, (snap) => {
          completedCount.value = snap.size;
        });
      } catch (e) {
        console.error("Error listening for completed orders:", e);
      }

      // 🔹 Listen to all orders for this technician to disable booked slots
      try {
        const allOrdersRef = collection(db, "orders");
        const qAll = query(allOrdersRef, where("technicianId", "==", technicianIdParam));
        onSnapshot(qAll, (snap) => {
          technicianOrders.value = snap.docs.map((d) => d.data());
        });
      } catch (e) {
        console.error("Error listening for technician orders:", e);
      }
      
      // 🟩 Listen for Ratings for this technician (no orderBy; sort client-side)
      try {
        const mapRatings = (docs) =>
          docs
            .map((d) => ({ id: d.id, ...d.data() }))
            .filter((r) => {
              const techId = technicianIdParam;
              return (
                r.providerId === techId 
              );
            })
            .map((r) => ({
              id: r.id,
              name: r.clientName || "Client",
              image:
                r.clientImageUrl || new URL("../images/Ellipse 56.png", import.meta.url).href,
              text: r.comment || "",
              stars: Number(r.stars || r.rating || 0),
              createdAt: r.createdAt || null,
            }));

        const mergeAndSort = (arrA, arrB) => {
          const merged = [...arrA, ...arrB];
          merged.sort((a, b) => {
            const toMillis = (t) =>
              t && typeof t.toDate === "function"
                ? t.toDate().getTime()
                : t && typeof t === "object" && (t.seconds || t._seconds)
                ? (t.seconds || t._seconds) * 1000
                : 0;
            return toMillis(b.createdAt) - toMillis(a.createdAt);
          });
          return merged;
        };

        // 'Ratings' collection
        const ratingsRefA = collection(db, "Ratings");
        const rqAFallback = query(ratingsRefA, where("providerId", "==", technicianIdParam));
        onSnapshot(rqAFallback, (snapA) => {
          const itemsA = mapRatings(snapA.docs).map((x) => ({ ...x, __src: "RatingsA" }));
          feedbacks.value = mergeAndSort(itemsA, feedbacks.value.filter((x) => x.__src !== "RatingsA"));
          if (currentIndex.value >= feedbacks.value.length) currentIndex.value = 0;
        });
      } catch (e) {
        console.error("Error listening for ratings:", e);
      }
    } else {
      technician.value = null;
    }
  } catch (error) {
    console.error("Error fetching technician:", error);
    technician.value = null;
  } finally {
    isLoading.value = false;
  }
});

onUnmounted(() => {
  if (_ordersUnsub) _ordersUnsub();
});

watch(selectedDayInfo, () => {
  selectedTime.value = "";
});
</script>



<template>
  <div>
  <!-- Loading State -->
  <div v-if="isLoading" class="flex justify-center items-center min-h-screen">
    <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-accent-color"></div>
    <p class="ml-4 text-2xl text-accent-color">Loading Profile...</p>
  </div>

  <!-- Not Found State -->
  <div v-else-if="!technician" class="flex justify-center items-center min-h-screen">
    <p class="text-2xl text-red-500">Technician not found.</p>
  </div>

  <!-- Profile Content -->
  <div v-else>
    <div
      class="technichainProfile my-10 md:my-20 w-[90%] md:w-[80%] mx-auto flex flex-col lg:flex-row justify-between gap-8 lg:gap-12"
    >
      <!-- Left Card (Technician Info) -->
      <div class="card w-full lg:w-[35%] bg-gray-50 dark:bg-[#16222B] rounded-2xl shadow-lg self-start p-6">
        <div class="imgContainer flex flex-col items-center justify-center">
          <img
            :src="technicianProfileImage"
            class="mt-3 w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-4  shadow-md bg-[#fcfafa] dark:bg-gray-800 border-2 border-[#5984C6] dark:border-[#8db4ff]"
            alt="Technician Profile Photo"
          />
          <div class="nameContainer flex items-center mt-4">
            <h2 class="font-semibold text-2xl md:text-3xl text-gray-800 dark:text-white">
              {{ technicianName }}
            </h2>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              class="w-5 h-5 md:w-6 md:h-6 text-accent-color shrink-0 ml-2 fill-current"
            >
              <path
                d="M256 512a256 256 0 1 1 0-512 256 256 0 1 1 0 512zM374 145.7c-10.7-7.8-25.7-5.4-33.5 5.3L221.1 315.2 169 263.1c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l72 72c5 5 11.8 7.5 18.8 7s13.4-4.1 17.5-9.8L379.3 179.2c7.8-10.7 5.4-25.7-5.3-33.5z"
              />
            </svg>
          </div>
          <h3 class="text-lg md:text-xl text-gray-600 dark:text-white mt-1">
            {{ technicianSkill }}
          </h3>
          <div class="flex justify-center my-2 text-yellow-400 text-lg md:text-xl">
            <i v-for="n in technicianRating" :key="n" class="fas fa-star fill-current"></i>
            <i
              v-for="n in 5 - technicianRating"
              :key="'empty-' + n"
              class="far fa-star text-gray-300"
            ></i>
          </div>
          <p class="text-sm md:text-base mb-3 text-gray-500 dark:text-white">({{ technicianReviews }} reviews)</p>
          <div class="line w-full h-px bg-gray-300 my-4"></div>
        </div>

        <!-- bio data -->
         <div class="flex items-center gap-2">
              <i class="fa-solid fa-file md:px-2 w-5 text-center text-accent-color"></i>
              Bio
            </div>
        <p class="px-2 md:px-6 pb-4 text-sm md:text-base font-normal text-gray-600 dark:text-white">
          {{ technician.bio || "No bio available." }}
        </p>
        <div class="line w-full h-px bg-gray-300 my-4"></div>

        <div
          class="dataContainer flex justify-between px-2 md:px-1 pb-4 text-sm md:text-base font-medium text-gray-700 dark:text-white"
        >
          <div class="dataKey space-y-3">
            <div class="flex items-center gap-2">
              <i class="fas fa-map-marker-alt w-5 text-center text-accent-color"></i>
              Location
            </div>
            <div class="flex items-center gap-2">
              <i class="fas fa-user-check w-5 text-center text-accent-color"></i>
              Member Since
            </div>
            <div class="flex items-center gap-2">
              <i class="fas fa-clock w-5 text-center text-accent-color"></i>
              Response time
            </div>
            <div class="flex items-center gap-2">
              <i class="fas fa-briefcase w-5 text-center text-accent-color"></i>
              Orders Completed
            </div>
          </div>
          <div class="dataValue space-y-3 text-right text-gray-600 dark:text-white font-normal">
            <div>{{ technicianLocation }}</div>
            <div>{{ technicianMemberSince }}</div>
            <div>~35 Minutes</div>
            <div>{{ completedCount }}</div>
          </div>
        </div>
        <div class="flex justify-center mb-6 px-6">
          <router-link
            :to="{ path: '/chat', query: { uid: route.params.id } }"
            class="w-full bg-accent-color text-white text-center px-6 py-3 rounded-lg text-lg font-semibold hover:bg-[#4a74b3] transition cursor-pointer shadow-md"
          >
            Chat with {{ technicianName.split(" ")[0] }}
          </router-link>
        </div>
      </div>

      <!-- Right Section (Services) -->
      <div class="w-full lg:w-[60%] flex flex-col">
        <h1 class="main-header m-0">Services Offered</h1>

        <!-- ✅ Fixed Carousel (2 rows × 2 columns, 4 cards per slide) -->
        <div class="relative w-full flex justify-center">
          <!-- Outer Wrapper (allows arrows to show fully) -->
          <div class="relative w-[90%] overflow-hidden rounded-2xl">
            <!-- Inner Slides -->
            <div
              class="flex transition-transform duration-700 ease-in-out"
              :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
            >
              <!-- Each slide contains exactly 4 cards (2x2 grid) -->
              <div
                v-for="(chunk, index) in chunkedServices"
                :key="index"
                class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full shrink-0"
              >
                <div
                  v-for="(service, i) in chunk"
                  :key="service.id"
                  class="serviceCard rounded-2xl text-center p-6 bg-white dark:bg-[#16222B] flex flex-col items-center justify-between h-80 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <!-- ✅ Custom Service (First Card in First Slide Only) -->
                  <template v-if="index === 0 && i === 0">
                    <div
                      class="serviceCard rounded-2xl  transition-shadow p-6 bg-white dark:bg-[#16222B]  flex flex-col items-center justify-between h-80 w-full"
                    >
                      <div class="serviceImg mb-4">
                        <img
                          src="../images/custom.png"
                          class="w-full h-36 rounded-2xl"
                          alt="Custom Service"
                        />
                      </div>
                      <h2 class="font-bold mb-4 text-lg md:text-xl text-gray-800 dark:text-white">
                        Custom Service
                      </h2>
                      <button
                        @click="openPopup()"
                        class="w-full bg-accent-color text-white px-4 py-2 mt-auto rounded-lg font-semibold hover:bg-[#4a74b3] transition cursor-pointer"
                      >
                        Enter Details
                      </button>
                    </div>
                  </template>

                  <!-- ✅ Dynamic Services -->
                  <template v-else>
                    <UserServiceCard
                      :service="service"
                      :userType="'technician'"
                      class="h-full w-full"
                      @order="(srv) => openPopup(srv.descreption, srv.price)"
                    />
                  </template>
                </div>
              </div>
            </div>
          </div>

          <!-- ✅ Navigation Arrows (moved outside overflow) -->
          <button
            v-if="showArrows"
            @click="prevSlide"
            class="absolute left-2 md:left-[-30px] top-1/2 -translate-y-1/2 bg-accent-color text-white rounded-full p-3 shadow-lg hover:bg-[#4a74b3] transition z-30"
          >
            <i class="fas fa-chevron-left"></i>
          </button>

          <button
            v-if="showArrows"
            @click="nextSlide"
            class="absolute right-2 md:right-[-30px] top-1/2 -translate-y-1/2 bg-accent-color text-white rounded-full p-3 shadow-lg hover:bg-[#4a74b3] transition z-30"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Order Popup -->
    <div
      v-if="showPopup"
      class="orderDetails fixed inset-0 bg-[#00000084] flex justify-center items-center z-50 p-4"
      @click.self="closePopup"
    >
      <div
        class="bg-white dark:bg-[#16222B]  rounded-2xl p-6 md:p-8 w-full max-w-3xl text-center shadow-2xl relative max-h-[90vh] overflow-y-auto"
      >
        <button
          @click="closePopup"
          class="absolute top-3 right-4 text-gray-500 dark:text-white hover:text-red-600 text-2xl z-10"
        >
          &times;
        </button>
        <h2 class="text-2xl font-semibold mb-6 text-accent-color">Order Details</h2>
        <div class="subContainer flex flex-col md:flex-row gap-6">
          <div class="orderDetails w-full md:w-1/2 space-y-4">
            <div class="flex flex-col items-start">
              <label for="photoUpload" class="font-semibold mb-2 text-lg text-accent-color dark:text-white"
                >Upload Photos (optional)</label
              >
              <input
                id="photoUpload"
                type="file"
                multiple
                accept="image/*"
                class="hidden"
                @change="handleFileUpload"
              />
              <label
                for="photoUpload"
                class="flex items-center gap-2 bg-accent-color text-white px-4 py-2 rounded-lg shadow-md cursor-pointer hover:bg-[#4a74b3] transition"
              >
                <i class="fas fa-upload"></i><span>Select Photos</span>
              </label>
              <div v-if="uploadedFiles.length > 0" class="mt-2 text-sm text-gray-600 w-full">
                <p
                    v-for="(file, i) in uploadedFiles"
                    :key="i"
                    v-if="file && file.type && file.type.startsWith('image/')"
                    class="truncate"
                  >
                    {{ file.name }}
                  </p>

                <!-- ✅ New: small image preview -->
                <div class="flex flex-wrap gap-3 mt-3">
                  <img
                    v-for="(src, i) in previewUrls"
                    :key="i"
                    :src="src"
                    alt="Preview"
                    class="w-20 h-20 object-cover rounded-lg border border-gray-300 shadow-sm"
                  />
                </div>

                <!-- ✅ New: upload status -->
                <p
                  v-if="uploadStatus"
                  class="mt-2 text-sm font-medium"
                  :class="uploadStatus.includes('success') ? 'text-green-600' : uploadStatus.includes('Uploading') ? 'text-blue-600' : 'text-red-600'"
                >
                  {{ uploadStatus }}
                </p>
              </div>


            </div>
            <div>
              <label class="block text-left font-semibold text-gray-700 mb-1 dark:text-white">Description</label>
              <textarea
                v-model="orderDescription"
                placeholder="Describe your problem or custom request..."
                class="w-full h-32 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent-color "
                :disabled="isPriceLocked"
              ></textarea>
              <button
                v-if="isCustomService"
                @click="analyzeImageWithAI"
                class="mt-2 bg-accent-color text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#4a74b3] transition cursor-pointer flex items-center gap-2"
              >
                <i class="fa-solid fa-magic-wand-sparkles"></i>
                Generate with AI
              </button>

            </div>
            <div v-if="filteredAvailableOffers.length > 0" class="mt-4">
              <label class="font-semibold text-gray-700 dark:text-white">Available Offers:</label>

              <!-- NEW: Coupon-style clickable offers -->
              <!-- Coupon background image + overlayed text (clickable per-offer cards) -->
              <div class="coupon-list mt-3">

                <!-- dynamic offers: each uses the same PNG background with overlay text -->
                <div
                  v-for="offer in filteredAvailableOffers"
                  :key="offer.docId || offer.id"
                  class="coupon-wrapper"
                  :class="{ selected: selectedOffer && (selectedOffer.docId || selectedOffer.id) === (offer.docId || offer.id) }"
                  @click="selectedOffer = offer"
                  role="button"
                  tabindex="0"
                  :title="offer.title || ''"
                >
                  <img
                    :src="isDark ? couponDark : couponLight"
                    alt="Coupon background"
                    class="coupon-bg"
                  />
                  <div class="coupon-overlay">
                    <div class="coupon-top dark:text-white">
                      {{ offer.overlayTop ?? (offer.title ? offer.title.toString().toUpperCase() : "COUPON") }}
                    </div>

                    <div class="coupon-bottom dark:text-white">
                      {{
                        offer.overlayBottom
                          ?? (
                              (offer.discountType || "").toLowerCase() === "flat"
                                ? (offer.discountValue != null ? `${offer.discountValue} EGP` : "")
                                : `${formatOfferPercent(offer)} off`
                            )
                      }}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            
            <div>
              <label class="block text-left font-semibold text-gray-700 mb-1 dark:text-white">Price</label>
              <input
                v-model="servicePrice"
                :disabled="isPriceLocked"
                type="text"
                :placeholder="
                  isPriceLocked ? 'Price set by service' : 'Enter Your Budget ...'
                "
                class="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent-color disabled:bg-gray-100 dark:disabled:bg-transparent"
              />
            </div>

            <div
              v-if="priceSummary.show && (selectedOffer || availableOffers.length > 0)"
              class="mt-3 space-y-1 rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <div
                v-if="selectedOffer && priceSummary.discountLabel"
                class="flex items-center justify-between text-green-600 dark:text-green-400"
              >
                <span>Offer discount</span>
                <span>- {{ priceSummary.discountLabel }}</span>
              </div>
              <div class="flex items-center justify-between font-semibold text-accent-color dark:text-white">
                <span>Total after offer</span>
                <span>{{ priceSummary.finalLabel }}</span>
              </div>
            </div>

          </div>
          <div class="orderTime w-full md:w-1/2 flex flex-col items-center">
            <h3 class="text-xl font-semibold text-accent-color mb-4 dark:text-white">Choose Appointment</h3>
            <div class="w-[90%] md:w-[80%] space-y-4">
              <div>
                <label class="block text-left font-medium mb-1 text-accent-color dark:text-white"
                  >Select Available Day:</label
                >
                <select
                  v-model="selectedDayInfo"
                  class="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-accent-color dark:text-black dark:bg-white"
                  :disabled="activeAvailableDays.length === 0"
                >
                  <option :value="null" disabled>
                    {{
                      activeAvailableDays.length === 0
                        ? "Technician not available"
                        : "-- Select Day --"
                    }}
                  </option>
                  <option v-for="day in activeAvailableDays" :key="day.display" :value="day">
                    {{ day.display }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-left font-medium mb-1 text-accent-color dark:text-white"
                  >Select Time:</label
                >
                <select
                  v-model="selectedTime"
                  class="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-accent-color dark:text-black dark:bg-white"
                  :disabled="!selectedDayInfo || availableTimeSlots.length === 0"
                >
                  <option value="" disabled>
                    {{
                      !selectedDayInfo
                        ? "Select day first"
                        : availableTimeSlots.length === 0
                        ? "No slots"
                        : "-- Select Time --"
                    }}
                  </option>
                  <option
                    v-for="time in availableTimeSlots"
                    :key="time"
                    :value="time"
                    :disabled="bookedTimesForSelectedDay.has(time)"
                  >
                    {{ time }}
                    {{ bookedTimesForSelectedDay.has(time) ? "(Booked)" : "" }}
                  </option>
                </select>
              </div>
            </div>
            <div v-if="selectedDayInfo && selectedTime" class="mt-6 text-gray-700 dark:text-white text-center">
              <p>
                You selected: <br /><span class="font-semibold text-accent-color dark:text-white ">{{
                  selectedDayInfo.display
                }}</span>
                at
                <span class="font-semibold text-accent-color dark:text-white">{{ selectedTime }}</span>
              </p>
            </div>
            <div
              v-else-if="selectedDayInfo && availableTimeSlots.length === 0"
              class="mt-6 text-red-600 text-center"
            >
              <p>No available time slots for the selected day.</p>
            </div>
          </div>
        </div>
        <div class="flex justify-center gap-4 mt-8">
          <button
            @click="closePopup"
            class="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            @click="submitOrder"
            :disabled="!selectedDayInfo || !selectedTime || isSubmitting"
            class="bg-accent-color text-white px-6 py-2 rounded-lg hover:bg-[#4a74b3] transition cursor-pointer shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? "Submitting..." : "Submit Order" }}
          </button>
        </div>
      </div>
    </div>

    <!-- 🟦 Safe Dynamic Work Gallery -->
    <div
      v-if="technician && Array.isArray(galleryImages)"
      class="WorkGallery flex flex-col items-center justify-center w-[90%] md:w-[80%] mx-auto mt-16 md:mt-24"
    >
      <h1 class="main-header">Work Gallery</h1>

      <div
        v-if="galleryImages.length > 0"
        class="galleryContainer grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full"
      >
        <div
          v-for="(img, index) in galleryImages"
          :key="img.id || index"
          class="imgContainer dark:bg-[#1F2937] bg-[#e6e6e6] rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 aspect-square"
        >
          <img
            :src="img.url"
            :alt="`Work photo ${index + 1}`"
            class="w-full h-full object-contain"
          />
        </div>
      </div>

      <div v-else class="text-gray-500 mt-6 italic">
        This technician has not uploaded any work photos yet.
      </div>
    </div>

    <!-- Feedback Slider (Static) -->
    <div
      class="feedback relative flex flex-col items-center justify-center w-[90%] md:w-[70%] mx-auto my-16 md:my-24 text-center px-4"
    >
      <h1 class="main-header">Customer Feedback</h1>
      <div
        v-if="feedbacks.length > 0"
        :key="currentIndex"
        class="feedback-item w-full relative pt-12 min-h-[350px] flex flex-col items-center"
      >
        <button
          @click="prevFeedback"
          class="absolute -left-5 md:left-0 top-1/2 -translate-y-1/2 text-3xl md:text-4xl text-accent-color hover:text-[#4a74b3] transition z-10 p-2 md:p-4 opacity-70 hover:opacity-100"
        >
          &#10094;
        </button>
        <button
          @click="nextFeedback"
          class="absolute -right-5 md:right-0 top-1/2 -translate-y-1/2 text-3xl md:text-4xl text-accent-color hover:text-[#4a74b3] transition z-10 p-2 md:p-4 opacity-70 hover:opacity-100"
        >
          &#10095;
        </button>

        <div class="flex flex-col items-center max-w-2xl">
          <img
            :src="feedbacks[currentIndex].image"
            class="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-lg mb-4 border-4 border-white"
            alt="Customer photo"
          />
          <p class="text-xl md:text-2xl font-semibold text-(--accent)">
            {{ feedbacks[currentIndex].name }}
          </p>
          <div class="flex justify-center my-2 text-yellow-400 text-lg md:text-xl">
            <i v-for="n in (feedbacks[currentIndex].stars || 0)" :key="'f'+n" class="fas fa-star fill-current mx-0.5"></i>
            <i v-for="n in Math.max(0, 5 - (feedbacks[currentIndex].stars || 0))" :key="'e'+n" class="far fa-star text-gray-300 mx-0.5"></i>
          </div>
          <p class="text-base md:text-lg text-gray-600 leading-relaxed mt-4 italic px-4">
            "{{ feedbacks[currentIndex].text }}"`
          </p>
        </div>
      </div>
      <div v-else class="text-gray-500 mt-10">No feedback available yet.</div>

      <AlertPopup :show="showPopupMessage" :message="popupMessageContent" @close="closeAlert" />
    </div>
  </div>
  <chat-bot/>
  </div>
</template>

<style scoped>
.feedback-item {
  min-height: 350px; /* Adjust as needed */
}
/* Coupon image wrapper + overlay text styles (use the provided PNG as background) */
.coupon-list {
  display: flex;
  flex-direction: row;      /* lay items next to each other */
  flex-wrap: wrap;         /* wrap to next row when needed */
  gap: 10px 14px;          /* vertical gap 10px, horizontal 14px */
  width: 100%;
  align-items: flex-start; /* align to top so items don't add extra vertical space */
  padding: 0;              /* remove extra internal padding */
  margin: 6px 0 8px 0;     /* reduce top/bottom spacing around the whole list */
}

/* wrapper that holds the PNG and overlay */
.coupon-wrapper {
  position: relative;
  width: auto;
  max-width: 140px;       /* ticket size - adjust if you want slightly larger/smaller */
  height: auto;
  cursor: pointer;
  user-select: none;
  transition: transform .12s ease, box-shadow .12s ease;
  display: inline-block;  /* shrink to image width and allow horizontal flow */
  outline: none;
  border: none;
  padding: 0;             /* remove added padding that creates extra vertical space */
  margin: 0;              /* control spacing with .coupon-list gap instead */
  background: transparent;
  box-shadow: none;
  vertical-align: top;    /* keep items aligned at top when in a row */
}

/* remove lift on select; we only change text color now */
.coupon-wrapper.selected {
  transform: none;
  box-shadow: none;
}

/* the PNG background (the user's uploaded coupon image) */
.coupon-bg {
  width: 100%;
  height: auto;
  display: block;
  pointer-events: none; /* let parent handle clicks */
  object-fit: contain;
  border: none;
  background: transparent;
}

/* overlay container for text (centers content inside the ticket) */
.coupon-overlay {
  position: absolute;
  inset: 0; /* top:0; right:0; bottom:0; left:0 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  padding: 4px 6px;    /* smaller padding so text sits tighter inside the image */
  box-sizing: border-box;
  text-align: center;
}

/* big top label "COUPON" */
.coupon-top {
  font-weight: 900;
  font-size: 11px;        /* slightly larger than tiny but still compact */
  letter-spacing: 0.6px;
  text-transform: uppercase;
  line-height: 1;
  margin-top: 2px;
  text-shadow: 0 1px 4px rgba(0,0,0,0.45);
}

/* bottom offer text "20% OFF" */
.coupon-bottom {
  font-weight: 800;
  font-size: 14px;       /* compact size so it fits without extra vertical space */
  text-transform: uppercase;
  margin-top: 4px;
  text-shadow: 0 1px 6px rgba(0,0,0,0.45);
}

/* Muted look for 'no-offer' */
.coupon-wrapper.no-offer .coupon-bottom {
  color: #bfc3c8;
  font-weight: 700;
}

/* Selected state: DO NOT add border — change text color inside image to blue */
.coupon-wrapper.selected .coupon-top,
.coupon-wrapper.selected .coupon-bottom {
  color: #4A90E2; /* accent blue */
  text-shadow: none; /* remove heavy shadow for crisp colored text */
}

/* Remove any focus outline that appears */
.coupon-wrapper:focus {
  outline: none;
  box-shadow: none;
  transform: none;
}

/* small screens */
@media (max-width: 640px) {
  .coupon-list { gap: 8px 10px; }
  .coupon-wrapper { max-width: 120px; }
  .coupon-top { font-size: 11px; }
  .coupon-bottom { font-size: 13px; }
}




@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css");
</style>

