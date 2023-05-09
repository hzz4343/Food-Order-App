import { useReducer } from "react";
import CartContext from "./cart-context";

const defaultCartState = {
  items: [],
  totalAmount: 0,
};

const cartReducer = (state, action) => {
  if (action.type === "ADD") {
    // 总金额的算法=目前有的总金额 + 新加的物品价格 * 新加的物品数量
    const updatedTotalAmount =
      state.totalAmount + action.item.price * action.item.amount;

    // 寻找到新加的物品是排在数组的第几个，如果这里筛选不到，就表示是未出现的物品，返回0
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );

    // 原来那一项物品的数据
    const existingCartItem = state.items[existingCartItemIndex];

    // 新加两个变量
    let updatedItems;

    if (existingCartItem) {
      //updatedItem指的是那一项物品的信息改变，原来基础不变的情况下，增加新加的数量
      const updatedItem = {
        ...existingCartItem,
        amount: existingCartItem.amount + action.item.amount,
      };
      //原来整个清单的数据
      updatedItems = [...state.items];
      //在清单的新增物品那一列进行修改
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      updatedItems = state.items.concat(action.item);
    }
    //返回更新后的内容
    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }

  if (action.type === "REMOVE") {
    //要删减的物品在第几位
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.id
    );

    //该物品原来的数据
    const existingItem = state.items[existingCartItemIndex];
    //总价先减去
    const updatedTotalAmount = state.totalAmount - existingItem.price;
    let updatedItems;

    //如果该物品只剩下一件，把物品去掉
    if (existingItem.amount === 1) {
      updatedItems = state.items.filter((item) => item.id !== action.id);
    }
    //如果该物品剩下大于一件，物品数量在原有基础上减1
    else {
      const updatedItem = { ...existingItem, amount: existingItem.amount - 1 };
      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updatedItem;
    }

    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }

  return defaultCartState;
};

const CartProvider = (props) => {
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState
  );

  const addItemToCartHandler = (item) => {
    dispatchCartAction({ type: "ADD", item: item });
  };

  const removeItemFromCartHandler = (id) => {
    dispatchCartAction({ type: "REMOVE", id: id });
  };

  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemToCartHandler,
    removeItem: removeItemFromCartHandler,
  };

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};

export default CartProvider;
