import { userStore } from "./userStore";

export default function Admin() {
  return (
    <div>
      <h1>Admin</h1>

      <pre>{JSON.stringify(userStore, null, 2)}</pre>
    </div>
  );
}
