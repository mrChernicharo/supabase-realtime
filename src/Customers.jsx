import { createSignal, Show, createEffect, createMemo } from "solid-js";
import { store, addCustomer, removeCustomer } from "./store";
import CustomerDetails from "./CustomerDetails";
import CustomersList from "./CustomersList";
import Button from "./Button";

export default function Customers() {
  const [showList, setShowList] = createSignal(false);

  return (
    <div>
      <h2>Customers</h2>

      <div class="form-control">
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
      </div>
      <Show when={showList()} fallback={<Button kind="open" onClick={(e) => setShowList(true)} />}>
        <Button kind="close" onClick={(e) => setShowList(false)} />
        <CustomersList />
      </Show>
    </div>
  );
}
