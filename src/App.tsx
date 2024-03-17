/// <reference types="react/experimental" />

import { useState } from 'react';
import { useOptimistic } from 'react';
// import { useOptimistic } from './useOptimistic';
import './App.css';

interface AddToCartFormProps {
  id: string;
  title: string;
  addToCart: (id: string, title: string) => Promise<{ id: string }>;
  optimisticAddToCart: (item: Item) => void;
}

const AddToCartForm = ({ id, title, addToCart, optimisticAddToCart }: AddToCartFormProps) => {
  const formAction = async (formData: FormData) => {
    // If we remove async/await "useOptimistic" will stop working. At the same handmade useOptimistic function will work.
    // It seems during "async" operation we can update state only with "useOptimistic" hook, because useState hook doesn't work.
    // Does it work only inside "formAction" function?
    console.log(formData)
    const itemId = String(formData.get('itemID'));
    optimisticAddToCart({ id, title });
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
      <input type="hidden" name="itemID" value={id} />
      <button type="submit">Add to Cart</button>
    </form>
  );
};

type Item = {
  id: string;
  title: string;
};

const Cart = ({ cart }: { cart: Item[] }) => {
  if (cart.length == 0) {
    return null;
  }

  console.log('Cart');
  console.log(cart);

  return (
    <div>
      <hr />
      Cart content:
      <ul>
        {cart.map((item, index) => (
          <li key={index}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
};

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

  return (
    <>
      <div>
        <AddToCartForm
          id="1"
          title="JavaScript: The Definitive Guide"
          addToCart={addToCart}
          optimisticAddToCart={optimisticAddToCart}
        />
        <AddToCartForm
          id="2"
          title="JavaScript: The Good Parts"
          addToCart={addToCart}
          optimisticAddToCart={optimisticAddToCart}
        />
      </div>
      <Cart cart={optimisticCart} />
    </>
  );
};
