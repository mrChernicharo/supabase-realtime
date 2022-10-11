import { Routes, Route, Outlet } from "solid-app-router";
import EntryPoint from "./EntryPoint";
import Admin from "./Admin";
import Professional from "./Professional";
import Customer from "./Customer";
import NotFound from "./NotFound";

import Login from "./Login";

export default function Router() {
  const Layout = () => (
    <div>
      <header>🌺 Laços</header>

      <Outlet />
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={<h1>Hello Laços</h1>} />

      <Route path="/login" component={Login} />

      <Route path="/admin" component={Layout}>
        <Route path="/" component={Admin} />
      </Route>

      <Route path="/customer" component={Layout}>
        <Route path="/" component={Customer} />
      </Route>

      <Route path="/professional" component={Layout}>
        <Route path="/" component={Professional} />
      </Route>

      <Route path="/v1" component={EntryPoint} />
      <Route path="/**" component={NotFound} />
    </Routes>
  );
}
