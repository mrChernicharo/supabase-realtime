import { s } from "./styles";
import { Show } from "solid-js";

export default function Badge(props) {
  return (
    <>
      <Show when={props.success}>
        <div style={{ ...s.badge, background: "#1eecb5" }}></div>
      </Show>
      <Show when={props.warn}>
        <div style={{ ...s.badge, background: "#ffc506" }}></div>
      </Show>
      <Show when={props.danger}>
        <div style={{ ...s.badge, background: "#ea2020" }}></div>
      </Show>
    </>
  );
}
