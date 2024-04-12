import CurrencyConverter from "./components/CurrencyConverter";
import "./index.css";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="container">
        <CurrencyConverter />
      </div>

      <a href="https://www.linkedin.com/in/bright-anyasi-a88a90174/" className="font-sm text-gray-400">
        &copy; Kidochukwu Bright Anyasi
      </a>
    </div>
  );
}

export default App;
