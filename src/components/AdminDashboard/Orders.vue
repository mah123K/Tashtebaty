<template>
  <div class="bg-white dark:bg-[#1f2937] dark:text-gray-100 shadow-lg rounded-2xl p-6">
    <!-- Section Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-[#5984C6] dark:text-[#8db4ff]">
        {{ texts[lang].adminDashboard.orders.title }}
      </h2>
      <p class="text-gray-600 dark:text-gray-300 mt-2">
        {{ texts[lang].adminDashboard.orders.subtitle }}
      </p>
    </div>

    <!-- Title + Search + Filter -->
    <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 w-full">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 px-4 pt-4 gap-4">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100">
          {{ texts[lang].adminDashboard.orders.allOrders }}
        </h3>

        <div class="flex items-center gap-4">
          <!-- Search Input -->
          <div class="relative w-full sm:w-64">
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="texts[lang].adminDashboard.orders.searchPlaceholder"
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
              {{ texts[lang].adminDashboard.orders.filter }}
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
                  {{ option === 'All'
                      ? texts[lang].adminDashboard.orders.allOrders
                      : texts[lang].adminDashboard.orders[option]
                  }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-6 text-gray-400 dark:text-gray-300">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5984C6] mx-auto mb-3"></div>
        {{ texts[lang].adminDashboard.orders.loading }}
      </div>

      <!-- Orders Table - Desktop -->
      <div v-else class="hidden md:block">
        <div v-if="filteredOrders.length > 0">
          <table class="min-w-full text-xs sm:text-sm text-gray-700 dark:text-gray-200">
            <thead class="bg-[#5984C6] text-white">
              <tr>
                <th class="py-3 px-4" :class="lang === 'ar' ? 'text-right' : 'text-left'">{{ texts[lang].adminDashboard.orders.orderId }}</th>
                <th class="py-3 px-4" :class="lang === 'ar' ? 'text-right' : 'text-left'">{{ texts[lang].adminDashboard.orders.customer }}</th>
                <th class="py-3 px-4" :class="lang === 'ar' ? 'text-right' : 'text-left'">{{ texts[lang].adminDashboard.orders.service }}</th>
                <th class="py-3 px-4" :class="lang === 'ar' ? 'text-right' : 'text-left'">{{ texts[lang].adminDashboard.orders.provider }}</th>
                <th class="py-3 px-4" :class="lang === 'ar' ? 'text-right' : 'text-left'">{{ texts[lang].adminDashboard.orders.amount }}</th>
                <th class="py-3 px-4" :class="lang === 'ar' ? 'text-right' : 'text-left'">{{ texts[lang].adminDashboard.orders.date }}</th>
                <th class="py-3 px-4" :class="lang === 'ar' ? 'text-right' : 'text-left'">{{ texts[lang].adminDashboard.orders.status }}</th>
                <th class="py-3 px-8" :class="lang === 'ar' ? 'text-right' : 'text-left'">{{ texts[lang].adminDashboard.orders.actions }}</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="order in filteredOrders"
                :key="order.id"
                class="border-t border-gray-200 dark:border-gray-700 hover:bg-[#f3f9fc] dark:hover:bg-gray-500 transition"
              >
                <td class="py-3 px-4" :class="lang === 'ar' ? 'text-right' : 'text-left'">{{ order.id }}</td>
                <td class="py-3 px-4" :class="lang === 'ar' ? 'text-right' : 'text-left'">{{ order.customer }}</td>
                <td class="py-3 px-4" :class="lang === 'ar' ? 'text-right' : 'text-left'">{{ order.service }}</td>
                <td class="py-3 px-4" :class="lang === 'ar' ? 'text-right' : 'text-left'">{{ order.provider }}</td>

                <td class="py-3 px-4 font-semibold" :class="lang === 'ar' ? 'text-right' : 'text-left'">
                  {{ order.amount }} EGP
                </td>

                <td class="py-3 px-4" :class="lang === 'ar' ? 'text-right' : 'text-left'">
                  <div class="flex flex-col">
                    <span class="font-medium">{{ order.date }}</span>
                    <span class="text-xs text-gray-500 dark:text-gray-400">{{ order.time }}</span>
                  </div>
                </td>

                <td class="py-3 px-4" :class="lang === 'ar' ? 'text-right' : 'text-left'">
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-xs font-semibold',
                      order.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : order.status === 'unconfirmed'
                        ? 'bg-amber-100 text-amber-700'
                        : order.status === 'upcoming'
                        ? 'bg-sky-100 text-sky-700'
                        : order.status === 'new'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-rose-100 text-rose-700'
                    ]"
                  >
                    {{ texts[lang].adminDashboard.orders[order.status] }}
                  </span>
                </td>

                <td class="py-3 px-4 flex space-x-2" :class="lang === 'ar' ? 'flex-row-reverse' : ''">
                  <button @click="openModal('view', order)" class="p-2 text-blue-500 hover:bg-blue-100 rounded-lg">
                    <i class="bi bi-eye"></i>
                  </button>
        <div class="h-3 border-l border-gray-300 mt-3"></div>
                  <button @click="openModal('edit', order)" class="p-2 text-yellow-500 hover:bg-yellow-100 rounded-lg">
                    <i class="bi bi-pencil"></i>
                  </button>
        <div class="h-3 border-l border-gray-300 mt-3"></div>
                  <button @click="openModal('delete', order)" class="p-2 text-red-500 hover:bg-red-100 rounded-lg">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-center py-6 text-gray-400 dark:text-gray-300">
          {{ texts[lang].adminDashboard.orders.noOrders }}
        </div>
      </div>

      <!-- Orders Cards - Mobile -->
      <div class="md:hidden">
        <div v-if="filteredOrders.length > 0" class="space-y-4">
          <div
            v-for="order in filteredOrders"
            :key="order.id"
            class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <div class="flex justify-between items-start mb-3" :class="lang === 'ar' ? 'flex-row-reverse' : ''">
              <div :class="lang === 'ar' ? 'text-right' : ''">
                <h3 class="font-semibold text-gray-900 dark:text-gray-100">{{ order.id }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-300">{{ order.customer }}</p>
              </div>
              <span
                :class="[
                  'px-2 py-1 rounded-full text-xs font-semibold',
                  order.status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : order.status === 'unconfirmed'
                    ? 'bg-amber-100 text-amber-700'
                    : order.status === 'upcoming'
                    ? 'bg-sky-100 text-sky-700'
                    : order.status === 'new'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-rose-100 text-rose-700'
                ]"
              >
                {{ texts[lang].adminDashboard.orders[order.status] }}
              </span>
            </div>

            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">{{ texts[lang].adminDashboard.orders.service }}:</span>
                <span class="font-medium">{{ order.service }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">{{ texts[lang].adminDashboard.orders.provider }}:</span>
                <span class="font-medium">{{ order.provider }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">{{ texts[lang].adminDashboard.orders.amount }}:</span>
                <span class="font-semibold text-[#5984C6]">{{ order.amount }} EGP</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">{{ texts[lang].adminDashboard.orders.date }}:</span>
                <div :class="lang === 'ar' ? 'text-left' : 'text-right'">
                  <div class="font-medium">{{ order.date }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">{{ order.time }}</div>
                </div>
              </div>
            </div>

            <div class="flex justify-end space-x-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
              <button @click="openModal('view', order)" class="p-2 text-blue-500 hover:bg-blue-100 rounded-lg">
                <i class="bi bi-eye"></i>
              </button>
              <button @click="openModal('edit', order)" class="p-2 text-yellow-500 hover:bg-yellow-100 rounded-lg">
                <i class="bi bi-pencil"></i>
              </button>
              <button @click="openModal('delete', order)" class="p-2 text-red-500 hover:bg-red-100 rounded-lg">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-6 text-gray-400 dark:text-gray-300">
          {{ texts[lang].adminDashboard.orders.noOrders }}
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
                  ? texts[lang].adminDashboard.orders.viewModalTitle
                  : modalType === 'edit'
                  ? texts[lang].adminDashboard.orders.editModalTitle
                  : texts[lang].adminDashboard.orders.deleteModalTitle
              }}
            </h3>

            <!-- VIEW -->
            <div v-if="modalType === 'view'" class="space-y-3">
              <div>
                <div class="text-sm text-gray-500">
                  {{ texts[lang].adminDashboard.orders.orderId }}
                </div>
                <div class="font-medium">{{ selectedOrder.id }}</div>
              </div>

              <div>
                <div class="text-sm text-gray-500">
                  {{ texts[lang].adminDashboard.orders.customerLabel }}
                </div>
                <div class="font-medium">{{ selectedOrder.customer }}</div>
              </div>

              <div>
                <div class="text-sm text-gray-500">
                  {{ texts[lang].adminDashboard.orders.serviceLabel }}
                </div>
                <div class="font-medium">{{ selectedOrder.service }}</div>
              </div>

              <div>
                <div class="text-sm text-gray-500">
                  {{ texts[lang].adminDashboard.orders.providerLabel }}
                </div>
                <div class="font-medium">{{ selectedOrder.provider }}</div>
              </div>

              <div>
                <div class="text-sm text-gray-500">
                  {{ texts[lang].adminDashboard.orders.amountLabel }}
                </div>
                <div class="font-medium">{{ selectedOrder.amount }} EGP</div>
              </div>

              <div>
                <div class="text-sm text-gray-500">
                  {{ texts[lang].adminDashboard.orders.dateTimeLabel }}
                </div>
                <div class="font-medium">
                  {{ selectedOrder.date }}
                  <span class="text-xs text-gray-500">{{ selectedOrder.time }}</span>
                </div>
              </div>

              <div>
                <div class="text-sm text-gray-500">
                  {{ texts[lang].adminDashboard.orders.statusLabel }}
                </div>

                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold',
                    selectedOrder.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : selectedOrder.status === 'unconfirmed'
                      ? 'bg-amber-100 text-amber-700'
                      : selectedOrder.status === 'upcoming'
                      ? 'bg-sky-100 text-sky-700'
                      : selectedOrder.status === 'new'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-rose-100 text-rose-700'
                  ]"
                >
                  {{ texts[lang].adminDashboard.orders[selectedOrder.status] }}
                </span>
              </div>
            </div>

            <!-- EDIT -->
            <div v-else-if="modalType === 'edit'" class="space-y-3">
              <div>
                <label class="text-sm text-gray-600 dark:text-gray-100">
                  {{ texts[lang].adminDashboard.orders.customerLabel }}
                </label>
                <input v-model="selectedOrder.customer"
                  class="w-full p-2 border rounded-lg text-sm bg-white dark:bg-gray-800 dark:border-gray-600"
                />
              </div>

              <div>
                <label class="text-sm text-gray-600 dark:text-gray-100">
                  {{ texts[lang].adminDashboard.orders.serviceLabel }}
                </label>
                <input v-model="selectedOrder.service"
                  class="w-full p-2 border rounded-lg text-sm bg-white dark:bg-gray-800 dark:border-gray-600"
                />
              </div>

              <div>
                <label class="text-sm text-gray-600 dark:text-gray-100">
                  {{ texts[lang].adminDashboard.orders.providerLabel }}
                </label>
                <input v-model="selectedOrder.provider"
                  class="w-full p-2 border rounded-lg text-sm bg-white dark:bg-gray-800 dark:border-gray-600"
                />
              </div>

              <div>
                <label class="text-sm text-gray-600 dark:text-gray-100">
                  {{ texts[lang].adminDashboard.orders.amountLabel }}
                </label>
                <input v-model="selectedOrder.amount"
                  class="w-full p-2 border rounded-lg text-sm bg-white dark:bg-gray-800 dark:border-gray-600"
                />
              </div>

              <div>
                <label class="text-sm text-gray-600 dark:text-gray-100">
                  {{ texts[lang].adminDashboard.orders.statusLabel }}
                </label>
                <select v-model="selectedOrder.status"
                  class="w-full p-2 border rounded-lg text-sm bg-white dark:bg-gray-800 dark:border-gray-600"
                >
                  <option v-for="s in statusOptions" :key="s" :value="s.toLowerCase()">
                    {{ s === 'All'
                        ? texts[lang].adminDashboard.orders.allOrders
                        : texts[lang].adminDashboard.orders[s]
                    }}
                  </option>
                </select>
              </div>

              <div class="flex justify-end">
                <button @click="saveChanges"
                  class="bg-[#5984C6] text-white px-4 py-2 rounded-lg hover:bg-[#4369a4] text-sm"
                >
                  {{ texts[lang].adminDashboard.orders.saveChanges }}
                </button>
              </div>
            </div>

            <!-- DELETE -->
            <div v-else class="text-center">
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                {{ texts[lang].adminDashboard.orders.deleteConfirmText }}
              </p>

              <div class="flex justify-center gap-3">
                <button @click="confirmDelete"
                  class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm"
                >
                  {{ texts[lang].adminDashboard.orders.delete }}
                </button>

                <button @click="closeModal"
                  class="bg-gray-200 dark:bg-gray-700 dark:text-gray-100 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  {{ texts[lang].adminDashboard.orders.cancel }}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  
</template>



<script>

import { ref, computed, onMounted } from "vue";
import { collection, getDocs, doc, onSnapshot, updateDoc, deleteDoc, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useTestLang } from "@/langTest/useTestLang";

export default {
  setup() {
    const { lang, texts } = useTestLang();

    const orders = ref([]);
    const searchQuery = ref("");
    const filterStatus = ref("All");
    const showFilter = ref(false);
    const showModal = ref(false);
    const modalType = ref("");
    const selectedOrder = ref({});
    const statusOptions = ['All', 'completed', 'unconfirmed', 'upcoming', 'declined', 'cancelled', 'new'];
    const loading = ref(true);

   const fetchOrdersRealtime = () => {
  loading.value = true;
      const q = query(collection(db, "orders"), orderBy("appointmentDate", "desc"));


  onSnapshot(q, (snapshot) => {
    orders.value = snapshot.docs.map((docItem) => {
      const data = docItem.data();
      return {
        id: docItem.id,
        customer: data.clientName || '',
        service: data.description || '',
        provider: data.technicianName || '',
        amount: data.price || 0,
        date: data.appointmentDate.toDate().toLocaleDateString(),
        time: data.appointmentDate.toDate().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: data.status || '',
        timestamp: data.appointmentDate.toDate().getTime(),
      };
    });
    loading.value = false;
  });
};

onMounted(fetchOrdersRealtime);

    const filteredOrders = computed(() => {
      const searchTerm = searchQuery.value.toLowerCase().trim();

      let filtered = orders.value.filter((order) => {
        const matchesSearch = searchTerm === '' || (
          order.id.toLowerCase().includes(searchTerm) ||
          order.customer.toLowerCase().includes(searchTerm) ||
          order.service.toLowerCase().includes(searchTerm) ||
          order.provider.toLowerCase().includes(searchTerm) ||
          order.amount.toString().toLowerCase().includes(searchTerm) ||
          order.date.toLowerCase().includes(searchTerm) ||
          order.time.toLowerCase().includes(searchTerm) ||
          order.status.toLowerCase().includes(searchTerm)
        );

        const matchesStatus =
          filterStatus.value === "All" || order.status === filterStatus.value;

        return matchesSearch && matchesStatus;
      });


      return filtered.sort((a, b) => b.timestamp - a.timestamp);
    });

    const toggleFilter = () => (showFilter.value = !showFilter.value);

    const openModal = (type, order) => {
      modalType.value = type;
      selectedOrder.value = { ...order };
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
    };

    const saveChanges = async () => {
      try {
        const orderRef = doc(db, "orders", selectedOrder.value.id);
        await updateDoc(orderRef, {
          clientName: selectedOrder.value.customer,
          description: selectedOrder.value.service,
          technicianName: selectedOrder.value.provider,
          price: selectedOrder.value.amount,
          status: selectedOrder.value.status,
        });

        const index = orders.value.findIndex((o) => o.id === selectedOrder.value.id);
        if (index !== -1) {
          orders.value[index] = { ...selectedOrder.value };
        }

        closeModal();
      } catch (error) {
        console.error("Error updating order:", error);
      }
    };

    const confirmDelete = async () => {
      try {
        const orderRef = doc(db, "orders", selectedOrder.value.id);
        await deleteDoc(orderRef);

        orders.value = orders.value.filter((o) => o.id !== selectedOrder.value.id);

        closeModal();
      } catch (error) {
        console.error("Error deleting order:", error);
      }
    };

    return {
      lang,
      texts,
      orders,
      loading,
      filteredOrders,
      searchQuery,
      filterStatus,
      showFilter,
      showModal,
      modalType,
      selectedOrder,
      statusOptions,
      toggleFilter,
      openModal,
      closeModal,
      saveChanges,
      confirmDelete,
    };
  },
};
</script>
