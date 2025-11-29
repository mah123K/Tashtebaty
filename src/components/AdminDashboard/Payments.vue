<template>
  <div class="bg-white dark:bg-[#1f2937] dark:text-gray-100 shadow-lg rounded-2xl p-6">

    <!-- Section Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-[#5984C6] dark:text-[#8db4ff]">
        {{ texts[lang].adminDashboard.payments.title }}
      </h2>

      <p class="text-gray-600 dark:text-gray-300 mt-2">
        {{ texts[lang].adminDashboard.payments.subtitle }}
      </p>
    </div>

    <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 w-full">

        <!-- Header Row (Title + Search + Filter) -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 px-4 pt-4 gap-4">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100">
          {{ texts[lang].adminDashboard.payments.allTransactions }}
        </h3>

        <div class="flex items-center gap-4">

          <!-- Search -->
          <div class="relative w-full sm:w-64">
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="texts[lang].adminDashboard.payments.searchPlaceholder"
              class="w-full py-2 pl-9 pr-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5984C6]"
            />
            <i class="bi bi-search absolute left-3 top-2.5 text-gray-500 text-sm"></i>
          </div>

          <!-- Filter -->
          <div class="relative">
            <button
              @click="toggleFilter"
              class="flex items-center gap-2 bg-[#1E293B] dark:bg-[#111827] text-white px-4 py-2 rounded-lg hover:bg-[#334155] dark:hover:bg-gray-800 transition text-sm"
            >
              <i class="bi bi-funnel"></i>
              {{ texts[lang].adminDashboard.payments.filter }}
            </button>

            <div
              v-if="showFilter"
              class="absolute right-0 mt-2 w-44 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10"
            >
              <ul>
                <li
                  v-for="option in statusOptions"
                  :key="option"
                  @click="filterStatus = option; showFilter = false"
                  class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
                >
                  {{ texts[lang].adminDashboard.payments.statuses[option.toLowerCase()] }}
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-6 text-gray-400 dark:text-gray-300">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5984C6] mx-auto mb-3"></div>
        {{ texts[lang].adminDashboard.payments.loading }}
      </div>

      <!-- No Payments -->
      <div v-else-if="filteredPayments.length === 0" class="text-center py-6 text-gray-400 dark:text-gray-300">
        {{ texts[lang].adminDashboard.payments.noPayments }}
      </div>

      <!-- TABLE - Desktop -->
      <div v-else class="hidden md:block">
        <table class="min-w-full text-xs sm:text-sm text-gray-700 dark:text-gray-200">
          <thead class="bg-[#5984C6] text-white">
            <tr>
              <th class="py-3 px-4" :class="lang === 'ar' ? 'text-right' : 'text-left'">{{ texts[lang].adminDashboard.payments.paymentId }}</th>
              <th class="py-3 px-4" :class="lang === 'ar' ? 'text-right' : 'text-left'">{{ texts[lang].adminDashboard.payments.customer }}</th>
              <th class="py-3 px-4" :class="lang === 'ar' ? 'text-right' : 'text-left'">{{ texts[lang].adminDashboard.payments.orderId }}</th>
              <th class="py-3 px-4" :class="lang === 'ar' ? 'text-right' : 'text-left'">{{ texts[lang].adminDashboard.payments.amount }}</th>
              <th class="py-3 px-4" :class="lang === 'ar' ? 'text-right' : 'text-left'">{{ texts[lang].adminDashboard.payments.date }}</th>
              <th class="py-3 px-4" :class="lang === 'ar' ? 'text-right' : 'text-left'">{{ texts[lang].adminDashboard.payments.status }}</th>
              <th class="py-3 px-8" :class="lang === 'ar' ? 'text-right' : 'text-left'">{{ texts[lang].adminDashboard.payments.actions }}</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="payment in filteredPayments"
              :key="payment.id"
              class="border-t border-gray-200 dark:border-gray-700 hover:bg-[#f3f9fc] dark:hover:bg-gray-500 transition"
            >
              <td class="py-3 px-4" :class="lang === 'ar' ? 'text-right' : 'text-left'">{{ payment.id }}</td>
              <td class="py-3 px-4" :class="lang === 'ar' ? 'text-right' : 'text-left'">{{ payment.customer }}</td>
              <td class="py-3 px-4" :class="lang === 'ar' ? 'text-right' : 'text-left'">{{ payment.orderId }}</td>

              <td class="py-3 px-4 font-semibold" :class="lang === 'ar' ? 'text-right' : 'text-left'">{{ payment.amount }} EGP</td>

              <td class="py-3 px-4" :class="lang === 'ar' ? 'text-right' : 'text-left'">
                <div class="flex flex-col">
                  <span class="font-medium">{{ payment.date }}</span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ payment.time }}</span>
                </div>
              </td>

              <td class="py-3 px-4" :class="lang === 'ar' ? 'text-right' : 'text-left'">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold',
                    payment.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : payment.status === 'unconfirmed'
                      ? 'bg-amber-100 text-amber-700'
                      : payment.status === 'upcoming'
                      ? 'bg-sky-100 text-sky-700'
                      : payment.status === 'new'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-rose-100 text-rose-700'
                  ]"
                >
                  {{ texts[lang].adminDashboard.payments.statuses[payment.status] }}
                </span>
              </td>

              <!-- Actions -->
              <td class="py-3 px-4 flex space-x-2" :class="lang === 'ar' ? 'flex-row-reverse' : ''">
                <button @click="openModal('view', payment)" class="p-2 text-blue-500 hover:bg-blue-100 rounded-lg">
                  <i class="bi bi-eye"></i>
                </button>
                      <div class="h-3 border-l border-gray-300 mt-3"></div>
                <button @click="openModal('edit', payment)" class="p-2 text-yellow-500 hover:bg-yellow-100 rounded-lg">
                  <i class="bi bi-pencil"></i>
                </button>
                      <div class="h-3 border-l border-gray-300 mt-3"></div>
                <button @click="openModal('delete', payment)" class="p-2 text-red-500 hover:bg-red-100 rounded-lg">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- CARDS - Mobile -->
          <div class="md:hidden space-y-4">
        <div
          v-for="payment in filteredPayments"
          :key="payment.id"
          class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <div class="flex justify-between items-start mb-3" :class="lang === 'ar' ? 'flex-row-reverse' : ''">
            <div :class="lang === 'ar' ? 'text-right' : ''">
              <h3 class="font-semibold text-gray-900 dark:text-gray-100">{{ payment.id }}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-300">{{ payment.customer }}</p>
            </div>
            <span
              :class="[
                'px-2 py-1 rounded-full text-xs font-semibold',
                payment.status === 'completed'
                  ? 'bg-green-100 text-green-700'
                  : payment.status === 'unconfirmed'
                  ? 'bg-amber-100 text-amber-700'
                  : payment.status === 'upcoming'
                  ? 'bg-sky-100 text-sky-700'
                  : payment.status === 'new'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-rose-100 text-rose-700'
              ]"
            >
              {{ texts[lang].adminDashboard.payments.statuses[payment.status] }}
            </span>
          </div>

          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">{{ texts[lang].adminDashboard.payments.orderId }}:</span>
              <span class="font-medium">{{ payment.orderId }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">{{ texts[lang].adminDashboard.payments.amount }}:</span>
              <span class="font-semibold text-[#5984C6]">{{ payment.amount }} EGP</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">{{ texts[lang].adminDashboard.payments.method }}:</span>
              <span class="font-medium">{{ payment.method }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">{{ texts[lang].adminDashboard.payments.date }}:</span>
              <div :class="lang === 'ar' ? 'text-left' : 'text-right'">
                <div class="font-medium">{{ payment.date }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ payment.time }}</div>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <button @click="openModal('view', payment)" class="p-2 text-blue-500 hover:bg-blue-100 rounded-lg">
              <i class="bi bi-eye"></i>
            </button>
            <button @click="openModal('edit', payment)" class="p-2 text-yellow-500 hover:bg-yellow-100 rounded-lg">
              <i class="bi bi-pencil"></i>
            </button>
            <button @click="openModal('delete', payment)" class="p-2 text-red-500 hover:bg-red-100 rounded-lg">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      >
        <div class="bg-white dark:bg-[#111827] dark:text-gray-100 w-full max-w-md mx-auto rounded-xl shadow-xl p-4 sm:p-6 relative">
          <button @click="closeModal" class="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
            <i class="bi bi-x-lg"></i>
          </button>

          <h3 class="text-lg font-semibold text-[#5984C6] mb-4">
            {{
              modalType === 'view'
                ? texts[lang].adminDashboard.payments.viewModalTitle
                : modalType === 'edit'
                ? texts[lang].adminDashboard.payments.editModalTitle
                : texts[lang].adminDashboard.payments.deleteModalTitle
            }}
          </h3>

          <!-- VIEW -->
          <div v-if="modalType === 'view'" class="space-y-3">
            <div class="grid grid-cols-1 gap-2">
              <div>
                <div class="text-sm text-gray-500">{{ texts[lang].adminDashboard.payments.paymentId }}</div>
                <div class="font-medium">{{ selectedPayment.id }}</div>
              </div>

              <div>
                <div class="text-sm text-gray-500">{{ texts[lang].adminDashboard.payments.customer }}</div>
                <div class="font-medium">{{ selectedPayment.customer }}</div>
              </div>

              <div>
                <div class="text-sm text-gray-500">{{ texts[lang].adminDashboard.payments.orderId }}</div>
                <div class="font-medium">{{ selectedPayment.orderId }}</div>
              </div>

              <div>
                <div class="text-sm text-gray-500">{{ texts[lang].adminDashboard.payments.amount }}</div>
                <div class="font-medium">{{ selectedPayment.amount }} EGP</div>
              </div>

              <div>
                <div class="text-sm text-gray-500">{{ texts[lang].adminDashboard.payments.method }}</div>
                <div class="font-medium">{{ selectedPayment.method || '—' }}</div>
              </div>

              <div>
                <div class="text-sm text-gray-500">{{ texts[lang].adminDashboard.payments.dateTimeLabel }}</div>
                <div class="font-medium">
                  {{ selectedPayment.date }}
                  <span class="text-xs text-gray-500">{{ selectedPayment.time }}</span>
                </div>
              </div>

              <div>
                <div class="text-sm text-gray-500">{{ texts[lang].adminDashboard.payments.status }}</div>
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold',
                    selectedPayment.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : selectedPayment.status === 'unconfirmed'
                      ? 'bg-amber-100 text-amber-700'
                      : selectedPayment.status === 'upcoming'
                      ? 'bg-sky-100 text-sky-700'
                      : selectedPayment.status === 'new'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-rose-100 text-rose-700'
                  ]"
                >
                  {{
                    texts[lang].adminDashboard.payments.statuses[
                      selectedPayment.status
                    ]
                  }}
                </span>
              </div>
            </div>
          </div>

          <!-- EDIT -->
          <div v-else-if="modalType === 'edit'" class="space-y-3 " >

            <div>
              <label class="text-sm">{{ texts[lang].adminDashboard.payments.customer }}</label>
              <input
                v-model="selectedPayment.customer"
                class="w-full p-2 border rounded-lg dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-gray-100"
              />
            </div>

            <div>
              <label class="text-sm">{{ texts[lang].adminDashboard.payments.orderId }}</label>
              <input
                v-model="selectedPayment.orderId"
                class="w-full p-2 border rounded-lg dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-gray-100"
              />
            </div>

            <div>
              <label class="text-sm">{{ texts[lang].adminDashboard.payments.amount }}</label>
              <input
                v-model="selectedPayment.amount"
                class="w-full p-2 border rounded-lg dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-gray-100"
              />
            </div>

            <div>
              <label class="text-sm">{{ texts[lang].adminDashboard.payments.status }}</label>
              <select
                v-model="selectedPayment.status"
                class="w-full p-2 border rounded-lg dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-gray-100 text-sm"
              >
                <option
                  v-for="option in statusOptions"
                  :key="option"
                  :value="option.toLowerCase()"
                >
                  {{ option === 'All' ? texts[lang].adminDashboard.payments.statuses.all : texts[lang].adminDashboard.payments.statuses[option.toLowerCase()] }}
                </option>
              </select>
            </div>

            <div class="flex justify-end pt-2">
              <button
                @click="saveChanges"
                class="bg-[#5984C6] text-white px-4 py-2 rounded-lg hover:bg-[#4369a4] text-sm"
              >
                {{ texts[lang].adminDashboard.payments.saveChanges }}
              </button>
            </div>
          </div>

          <!-- DELETE -->
          <div v-else class="text-center">
            <p class="text-gray-600 dark:text-gray-300 mb-4">
              {{ texts[lang].adminDashboard.payments.deleteConfirmText }}
            </p>

            <div class="flex justify-center gap-3">
              <button
                @click="confirmDelete"
                class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm"
              >
                {{ texts[lang].adminDashboard.payments.delete }}
              </button>

              <button
                @click="closeModal"
                class="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                {{ texts[lang].adminDashboard.payments.cancel }}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>


<script>
import { db } from '../../firebase/firebase.js';
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';

import { useTestLang } from "@/langTest/useTestLang";

export default {
  setup() {
    const { lang, texts } = useTestLang();
    return { lang, texts };
  },

  data() {
    return {
      payments: [],
      loading: true,
      unsubscribeOrders: null,

      showModal: false,
      modalType: '',
      selectedPayment: {},

      searchQuery: '',
      filterStatus: 'All',
      showFilter: false,

      statusOptions: ['All', 'completed', 'unconfirmed', 'upcoming', 'declined', 'cancelled', 'new'],
    };
  },

  created() {
    this.loading = true;

    const ordersCol = query(collection(db, 'orders'), orderBy('appointmentDate', 'desc'));

    this.unsubscribeOrders = onSnapshot(
      ordersCol,
      (snapshot) => {
        const orders = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

        this.payments = orders.map((o) => {
          const rawStatus = o.status || 'new';

          return {
            id: `PAY-${String(o.id).padStart(3, '0')}`,
            customer: o.clientName || o.customer || 'Unknown',
            orderId: `ORD-${String(o.id).padStart(3, '0')}`,
            amount: o.price ?? o.amount ?? 0,
            method: o.paymentMethod || 'Cash',

            date: o.appointmentDate && o.appointmentDate.toDate
              ? o.appointmentDate.toDate().toLocaleDateString()
              : (o.date || ''),

            time: o.appointmentDate && o.appointmentDate.toDate
              ? o.appointmentDate.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : (o.time || ''),

            status: rawStatus.toString().toLowerCase(),
            timestamp: o.appointmentDate && o.appointmentDate.toDate ? o.appointmentDate.toDate().getTime() : 0,
          };
        });

        this.syncPaymentsToFirestore();
        this.loading = false;
      },
      (err) => {
        console.error('orders onSnapshot error', err);
        this.loading = false;
      }
    );
  },

  beforeUnmount() {
    if (this.unsubscribeOrders) this.unsubscribeOrders();
  },

  computed: {
    filteredPayments() {
      const searchTerm = this.searchQuery.toLowerCase().trim();

      return this.payments
        .filter((payment) => {
          const matchesSearch = searchTerm === '' || (
            payment.id.toLowerCase().includes(searchTerm) ||
            payment.customer.toLowerCase().includes(searchTerm) ||
            payment.orderId.toLowerCase().includes(searchTerm) ||
            payment.amount.toString().toLowerCase().includes(searchTerm) ||
            payment.method.toLowerCase().includes(searchTerm) ||
            payment.date.toLowerCase().includes(searchTerm) ||
            payment.time.toLowerCase().includes(searchTerm) ||
            payment.status.toLowerCase().includes(searchTerm)
          );

          const matchesStatus =
            this.filterStatus === "All" || payment.status === this.filterStatus;

          return matchesSearch && matchesStatus;
        })
        .sort((a, b) => b.timestamp - a.timestamp);
    },
  },

  methods: {
    toggleFilter() {
      this.showFilter = !this.showFilter;
    },

    async syncPaymentsToFirestore() {
      try {
        for (const p of this.payments) {
          await setDoc(doc(db, 'payments', p.id), p, { merge: true });
        }
      } catch (err) {
        console.error('Failed to sync payments to Firestore', err);
      }
    },

    openModal(type, payment) {
      this.modalType = type;
      this.selectedPayment = { ...payment };
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
    },

    async saveChanges() {
      try {
        await setDoc(
          doc(db, 'payments', this.selectedPayment.id),
          this.selectedPayment,
          { merge: true }
        );

        const idx = this.payments.findIndex(
          (p) => p.id === this.selectedPayment.id
        );
        if (idx !== -1) {
          this.payments[idx] = { ...this.selectedPayment };
        }

        this.closeModal();
      } catch (err) {
        console.error('Failed to save payment changes', err);
      }
    },

    async confirmDelete() {
      try {
        await deleteDoc(doc(db, 'payments', this.selectedPayment.id));

        this.payments = this.payments.filter(
          (p) => p.id !== this.selectedPayment.id
        );

        this.closeModal();
      } catch (err) {
        console.error('Failed to delete payment', err);
      }
    },
  },
};
</script>

