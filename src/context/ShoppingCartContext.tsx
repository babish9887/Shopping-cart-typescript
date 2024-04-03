import { createContext, ReactNode, useContext, useState } from "react";
import { ShoppingCart } from "../components/ShoppingCart";
import { useLocalStorage } from "../hooks/useLocalStorage";
type ShoppingCardProviderProps={
    children: ReactNode
}
type CartItem = {
    id: number
    quantity: number
}

type ShoppingCardContext={
    openCart:()=>void
    closeCart:()=>void
    cartQuantity: number
    cartItems: CartItem[]

    getItemQuantity: (id:number)=>number
    increaseCartQuantity: (id:number)=>void
    decreaseCartQuantity: (id:number)=>void
    removeFromCart: (id:number)=>void
}

const ShoppingCartContext=createContext({} as ShoppingCardContext)
export function useShoppingCart() {
  return useContext(ShoppingCartContext)
}


export function ShoppingCardProvider ({children}: ShoppingCardProviderProps){
    const [cartItems, setCartItems]=useLocalStorage<CartItem[]>("shopping-cart",[])
    const [isOpen, setIsOpen]=useState(false)

    const openCart=()=>setIsOpen(true)
    const closeCart=()=>setIsOpen(false)


    const cartQuantity=cartItems.reduce((quantity, item)=> item.quantity+ quantity, 0)

    function getItemQuantity(id: number){
        return cartItems.find(item=>item.id===id)?.quantity || 0
    }

    function increaseCartQuantity(id: number){
        setCartItems(item=>{
            if(item.find(item=>item.id===id)== null){
                return [...item, {id, quantity: 1}]
            } else{
                return item.map(item=>{
                    if(item.id===id){
                        return {...item, quantity: item.quantity+1}
                    } else{
                        return item
                    }
                })
            }
        })
    }

    function decreaseCartQuantity(id: number){
        setCartItems(item=>{
            if(item.find(item=>item.id===id)?.quantity=== 1){
                return item.filter(item=>item.id!== id)
            } else{
                return item.map(item=>{
                    if(item.id===id){
                        return {...item, quantity: item.quantity-1}
                    } else{
                        return item
                    }
                })
            }
        })
    }
    function removeFromCart(id: number){
        setCartItems(items=>{
            return items.filter(item=>item.id!==id)
        })
    }

    return (
        <ShoppingCartContext.Provider value={{
            getItemQuantity, increaseCartQuantity, decreaseCartQuantity, removeFromCart, cartItems, cartQuantity, openCart, closeCart
        }}>
            {children}
            <ShoppingCart isOpen={isOpen} />
        </ShoppingCartContext.Provider>
    )
}
