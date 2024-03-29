/// <reference types="react/experimental" />

import { useState } from 'react';
import { useOptimistic } from 'react';
// import { useOptimistic } from './useOptimistic';
import './App.css';


export const App = () => {
  const [cart, setCart] = useState<Item[]>([]);

  const [optimisticCart, optimisticAddToCart] = useOptimistic<Item[], Item>(
    cart,
    (state, item) => [...state, item]
  );

  const addToCart = async (id: string, title: string) => {
    // simulate an AJAX call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setCart((cart: Item[]) => [...cart, { id, title }]);

    return { id };
  };

  console.log({
    cart,
    optimisticCart,
  });

  return (
    <>
      <div>
        <AddToCartForm
          title="JavaScript: The Definitive Guide"
          addToCart={addToCart}
          optimisticAddToCart={optimisticAddToCart}
        />
        <AddToCartForm
          title="JavaScript: The Good Parts"
          addToCart={addToCart}
          optimisticAddToCart={optimisticAddToCart}
        />
      </div>
      <Cart cart={optimisticCart} />
    </>
  );
};


type Item = {
  id: string;
  title: string;
  pending?: boolean;
};

const Cart = ({ cart }: { cart: Item[] }) => {
  if (cart.length == 0) {
    return null;
  }

  return (
    <div>
      <hr />
      Cart content:
      <ul>
        {cart.map((item, index) => (
          <li key={index} style={{ opacity: item.pending ? 0.5 : 1 }}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
};

interface AddToCartFormProps {
  title: string;
  addToCart: (id: string, title: string) => Promise<{ id: string }>;
  optimisticAddToCart: (item: Item) => void;
}

const AddToCartForm = ({ title, addToCart, optimisticAddToCart }: AddToCartFormProps) => {
  const formAction = async (formData: FormData) => {
    // If we remove async/await "useOptimistic" will stop working. At the same handmade useOptimistic function will work.
    // It seems during "async" operation we can update state only with "useOptimistic" hook, because useState hook doesn't work.
    // Does it work only inside "formAction" function?
    const itemId = String(formData.get('itemID'));
    optimisticAddToCart({ id: itemId, title, pending: true });
    try {
      await addToCart(itemId, title);
    } catch (e) {
      console.log(e);
      // show error notification
    }
  };

  return (
    <form action={formAction}>
      <h2>{title}</h2>
      <input type="hidden" name="itemID" value={crypto.randomUUID()} />
      <button type="submit">Add to Cart</button>
    </form>
  );
};
