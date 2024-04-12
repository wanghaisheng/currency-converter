import { useEffect, useState } from "react";
import CurrencyDropDown from "./CurrencyDropDown";
import { HiArrowsRightLeft } from "react-icons/hi2";

const CurrencyConverter = () => {
  const [currencies, setCurrencies] = useState([]);
  const [amount, setAmount] = useState(1);

  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, settoCurrency] = useState("INR");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [converting, setConverting] = useState(false);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || ["INR", "EUR"]
  );

  //Currencies-> https://api.frankfurter.app/currencies
  //fetch currencies function
  const fetchCurrencies = async () => {
    try {
      const res = await fetch("https://api.frankfurter.app/currencies");
      const data = await res.json();

      setCurrencies(Object.keys(data));
    } catch (error) {
      console.error("Error fetching", error);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  console.log(currencies);


  //Currencies-> https://api.frankfurter.app/latest?amount=1&from=USD&to=INR
  // Convert Currencies
  const convertCurrency = async () => {
    if (!amount) return;
    setConverting(true);
    try {
      const res = await fetch(
        `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
      );
      const data = await res.json();

      setConvertedAmount(data.rates[toCurrency] + " " + toCurrency);
    } catch (error) {
      console.error("Error fetching", error);
    } finally {
      setConverting(false);
    }
  };


  const handleFavorites = (currency) => {
    // Toggle favorite currency
    if (favorites.includes(currency)) {
      setFavorites(favorites.filter((fav) => fav !== currency));
    } else {
      setFavorites([...favorites, currency]);
    }
  };

  useEffect(() => {
    // Save favorites to local storage when favorites change
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);


  // Swap Currencies
  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    settoCurrency(fromCurrency);
  };
  

  return (
    <div className="max-w-xl mx-auto my-10 p-5 bg-white rounded-lg shadow-md">
      <h2 className="mb-5 text-3xl font-semibold text-gray-700">
        Currency Converter
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <CurrencyDropDown
          favorites={favorites}
          currencies={currencies}
          currency={fromCurrency}
          setCurrency={setFromCurrency}
          title="From"
          handleFavorites={handleFavorites}
        />
        {/* swap currency button */}
        <div className="flex justify-center -mb-5 sm:mb-0">
          <button className="p-2 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300">
            <HiArrowsRightLeft
              className="text-xl text-gray-700"
              onClick={swapCurrencies}
            />
          </button>
        </div>

        <CurrencyDropDown
          favorites={favorites}
          currencies={currencies}
          currency={toCurrency}
          setCurrency={settoCurrency}
          title="To"
          handleFavorites={handleFavorites}
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700"
        >
          Amount
        </label>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={convertCurrency}
          className={`px-5 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
       ${converting ? "animate-pulse" : ""}
        `}
        >
          Convert
        </button>
      </div>

      {convertedAmount && (
        <div className="mt-4 text-lg font-medium text-right text-green-600">
          {amount} {fromCurrency} = {convertedAmount}
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;
