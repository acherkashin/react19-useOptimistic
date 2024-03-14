/// <reference types="react/experimental" />

import { useState } from 'react';
import { useOptimistic } from 'react';
// import { useOptimistic } from './useOptimistic';


interface AddToCartFormProps {
  id: string;
  title: string;
  addToCart: (formData: FormData, title: string) => Promise<{ id: string }>;
  optimisticAddToCart: (item: Item) => void;
}

const AddToCartForm = ({ id, title, addToCart, optimisticAddToCart }: AddToCartFormProps) => {
  const formAction = async (formData: FormData) => {
    // If we remove async/await "useOptimistic" will stop working. At the same handmade useOptimistic function will work.
    // It seems during "async" operation we can update state only with "useOptimistic" hook, because useState hook doesn't work.
    // Does it work only inside "formAction" function?
    optimisticAddToCart({ id, title });
    try {
      await addToCart(formData, title);
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
    <>
      Cart content:
      <ul>
        {cart.map((item, index) => (
          <li key={index}>{item.title}</li>
        ))}
      </ul>
      <hr />
    </>
  );
};

export const App = () => {
  const [cart, setCart] = useState<Item[]>([]);

  const [optimisticCart, optimisticAddToCart] = useOptimistic<Item[], Item>(
    cart,
    (state, item) => [...state, item]
  );

  console.log(`card == optimisticCard: ${cart == optimisticCart}`)

  const addToCart = async (formData: FormData, title: string) => {
    const id = String(formData.get('itemID'));
    // simulate an AJAX call
    await new Promise((resolve) => setTimeout(resolve, 5000));
    setCart((cart: Item[]) => [...cart, { id, title }]);

    return { id };
  };

  return (
    <>
      <Cart cart={optimisticCart} />
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
    </>
  );
};
