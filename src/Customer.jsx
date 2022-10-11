import { onMount, createEffect } from "solid-js";
import { userStore, setUserStore } from "./userStore";

export default function Customer() {
  onMount(() => {
    if (!userStore.user_id) {
      setUserStore(JSON.parse(localStorage.getItem("user")));
    }
  });

  createEffect(() => {
    console.log(userStore);
  });
  return (
    <div>
      <h1>customer</h1>

      <pre>{JSON.stringify(userStore, null, 2)}</pre>
    </div>
  );
}
