import { createEffect } from "solid-js";
import { onMount } from "solid-js";
import { setUserStore, userStore } from "./userStore";

export default function Professional() {
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
      <h1>professional</h1>

      <pre>{JSON.stringify(userStore, null, 2)}</pre>
    </div>
  );
}
