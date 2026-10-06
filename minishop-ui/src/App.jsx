import { useEffect, useState } from "react";
import "./App.css";

import ProductCard from "./components/ProductCard";

import {
  getProducts,
  createOrder
} from "./services/api";

function App() {

  const [products, setProducts] = useState([]);

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");

  const loadProducts = async () => {

    try {

      const data = await getProducts();

      setProducts(data);

    } catch (error) {

      setMessage(error.message);

    }

  };

  useEffect(() => {

    loadProducts();

  }, []);

  const isValidEmail = (value) => {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  };

  const handleOrder = async (product) => {

    if (!isValidEmail(email)) {

      setMessage(
        "Please enter a valid email before ordering."
      );

      return;
    }

    const quantityText = window.prompt(
      `How many ${product.name} do you want?`,
      "1"
    );

    if (!quantityText)
      return;

    const quantity = Number(quantityText);

    if (
      Number.isNaN(quantity) ||
      quantity <= 0
    ) {

      setMessage(
        "Please enter a valid quantity."
      );

      return;
    }

    try {

      setLoading(true);

      setMessage("");

      const order = await createOrder(
        product.id,
        quantity,
        email
      );

      setMessage(
        `Order #${order.id} created successfully. Total: ${order.totalPrice} AZN. Confirmation email sent to ${email}`
      );

      await loadProducts();

    } catch (error) {

      setMessage(
        `Error: ${error.message}`
      );

    } finally {

      setLoading(false);

    }

  };

  return (
    <div className="app">

      <header>
        <h1>MiniShop</h1>

        <p>
          Microservices Demo
        </p>
      </header>

      <div style={{ margin: "20px 0" }}>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "10px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
        />

      </div>

      {message && (
        <div className="message">
          {message}
        </div>
      )}

      {loading && (
        <p>
          Creating order...
        </p>
      )}

      <div className="product-grid">

        {products.map(product => (

          <ProductCard
            key={product.id}
            product={product}
            onOrder={handleOrder}
          />

        ))}

      </div>

    </div>
  );
}

export default App;
