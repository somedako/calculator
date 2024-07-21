<script setup>
import { ref, onMounted } from "vue";
import { fetchExchangeRate, exchangeRates } from "../utils/currency";

onMounted(async () => {
  await fetchExchangeRate(selectedCurrency.value);
});

const selectedTariff = ref(null);
const selectedCurrency = ref("RUB");
const selectedPeriod = ref("monthly");
const totalAmount = ref(null);
const discountAmount = ref(0);

const tariffs = [
  { id: 1, name: "Стандартный", monthlyPrice: 100, yearlyPrice: 1000 },
  { id: 2, name: "Продвинутый", monthlyPrice: 150, yearlyPrice: 1400 },
];

const currencies = ref(["CNY", "KZT"]);

const formatCurrency = (amount) => {
  if (!exchangeRates.value) return `${amount} ${selectedCurrency.value}`;

  const rate = exchangeRates.value[selectedCurrency.value];
  const formattedAmount = (amount * rate).toFixed(2);
  return `${formattedAmount} ${selectedCurrency.value}`;
};

const calculateTotal = () => {
  if (selectedTariff.value && selectedCurrency.value && selectedPeriod.value) {
    totalAmount.value =
      selectedPeriod.value === "monthly"
        ? selectedTariff.value.monthlyPrice
        : selectedTariff.value.yearlyPrice;

    if (selectedPeriod.value === "yearly") {
      discountAmount.value =
        selectedTariff.value.monthlyPrice * 12 -
        selectedTariff.value.yearlyPrice;
    } else {
      discountAmount.value = 0;
    }
  }
};
</script>

<template>
  <div class="calculator-tariff">
    <div class="calculator-tariff-sections">
      <label for="tariff" class="calculator-tariff-label">Выбрать тариф:</label>
      <select
        id="tariff"
        class="calculator-tariff-select"
        v-model="selectedTariff"
      >
        <option v-for="tariff in tariffs" :key="tariff.id" :value="tariff">
          {{ tariff.name }}
        </option>
      </select>
    </div>

    <div class="calculator-tariff-sections">
      <label for="currency" class="calculator-tariff-label"
        >Выбрать валюту:</label
      >
      <select
        id="currency"
        class="calculator-tariff-select"
        v-model="selectedCurrency"
      >
        <option
          v-for="currency in currencies"
          :key="currency"
          :value="currency"
        >
          {{ currency }}
        </option>
      </select>
    </div>

    <div class="calculator-tariff-sections">
      <label for="period" class="calculator-tariff-label"
        >Выбрать платежный период:</label
      >
      <select
        id="period"
        class="calculator-tariff-select"
        v-model="selectedPeriod"
      >
        <option value="monthly">За месяц</option>
        <option value="yearly">За год</option>
      </select>
    </div>

    <div class="calculator-tariff-sections">
      <button class="tariff-btn" @click="calculateTotal">Рассчитать</button>
    </div>

    <div class="calculator-tariff-sections">
      <div class="calculator-tariff-prices" v-show="totalAmount !== null">
        <p>Сумма для оплаты: {{ formatCurrency(totalAmount) }}</p>
        <p v-if="discountAmount > 0">
          Сумма скидки: {{ formatCurrency(discountAmount) }}
        </p>
      </div>
    </div>
  </div>
</template>
