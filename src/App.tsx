import { CartProvider } from "./state/CartContext";
import { Layout } from "./components/Layout/Layout";

export default function App() {
  return (
    <CartProvider>
      <Layout />
    </CartProvider>
  );
}
