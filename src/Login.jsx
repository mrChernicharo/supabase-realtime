import { Show, For, createSignal } from "solid-js";
import { useNavigate } from "solid-app-router";
import Button from "./Button";
import { login } from "./userStore";

export default function Login() {
  const navigate = useNavigate();

  const [userCategory, setUserCategory] = createSignal("admin");
  const [userEmail, setUserEmail] = createSignal("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (userCategory() !== "admin" && !userEmail()) return;

    const routePath = await login(userCategory(), userEmail());

    navigate(routePath);
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Login as
          <select value={userCategory()} onChange={(e) => setUserCategory(e.target.value)}>
            <For each={["admin", "professional", "customer"]}>
              {(category) => <option>{category}</option>}
            </For>
          </select>
        </label>
        <Show when={userCategory() !== "admin"}>
          <label>
            Email
            <input
              type="email"
              value={userEmail()}
              onChange={(e) => setUserEmail(e.currentTarget.value)}
            />
          </label>
        </Show>

        <Button text="Login" kind="CTA" />
      </form>
    </div>
  );
}
