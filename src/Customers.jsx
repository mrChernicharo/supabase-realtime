import { createSignal, Show, createEffect, createMemo } from "solid-js";
import { store, addCustomer, removeCustomer } from "./store";
import CustomerDetails from "./CustomerDetails";
import CustomersList from "./CustomersList";
import Badge from "./Badge";

export default function Customers() {
  createEffect(() => {});

  return (
    <div>
      <label>Customer Email</label>
      <input
        type="email"
        onChange={(e) => {
          if (!e.currentTarget.validity.valid) {
            console.log("invalid email!");
            return;
          }
          const newCustomer = {
            name: e.currentTarget.value.split("@")[0],
            email: e.currentTarget.value,
          };
          addCustomer(newCustomer);
        }}
      />

      <CustomersList />
    </div>
  );
}
