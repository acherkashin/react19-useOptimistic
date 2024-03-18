/// <reference types="react/experimental" />

import { useState } from 'react';
import { useOptimistic } from 'react';
// import { useOptimistic } from './useOptimistic';
import './App.css';


type OptimisticActionProps = { action: 'add' | 'remove', item: Item }

export const App = () => {
  const [cart, setCart] = useState<Item[]>([]);

  const [optimisticCart, optimisticCartUpdate] = useOptimistic<Item[], OptimisticActionProps>(
    cart,
    (state, { action, item }) => {
      switch (action) {
        case 'add': return [...state, item];
        case 'remove': return state.filter(item => item.id !== item.id);
      }

      return state;
    }
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
          optimisticUpdate={optimisticCartUpdate}
        />
        <AddToCartForm
          title="JavaScript: The Good Parts"
          addToCart={addToCart}
          optimisticUpdate={optimisticCartUpdate}
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
  optimisticUpdate: (props: OptimisticActionProps) => void;
}

const AddToCartForm = ({ title, addToCart, optimisticUpdate: optimisticAddToCart }: AddToCartFormProps) => {
  const formAction = async () => {
    const item: Item = { id: crypto.randomUUID(), title, pending: true };

    optimisticAddToCart({ action: 'add', item });
    try {
      await addToCart(item.id, item.title);
    } catch (e) {
      console.log(e); // show error popup
      optimisticAddToCart({ action: 'add', item });
    }
  };

  return (
    <form action={formAction}>
      <h2>{title}</h2>
      <input type="hidden" name="itemID" value={crypto.randomUUID()} />
      <button type="submit">Add to Cart</button>
    </form>
  );
}
