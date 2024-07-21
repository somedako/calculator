import { ref } from "vue";
import axios from "axios";

const exchangeRates = ref(null);

async function fetchExchangeRate(currency) {
  try {
    const response = await axios.get(
      `https://api.exchangerate-api.com/v4/latest/${currency}`
    );

    exchangeRates.value = response.data.rates;
  } catch (error) {
    console.error(error);
  }
}

export { exchangeRates, fetchExchangeRate };
