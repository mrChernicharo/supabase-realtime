import { Match, Switch } from "solid-js";
import Icon from "./Icon";

export default function Button(props) {
  return (
    <Switch>
      <Match when={props.type === "open"}>
        <button class="btn" onClick={props.onClick}>
          <Icon chevronDown />
        </button>
      </Match>
      <Match when={props.type === "close"}>
        <button class="btn" onClick={props.onClick}>
          <Icon close />
        </button>
      </Match>
      <Match when={props.type === "delete"}>
        <button class="btn text-danger" onClick={props.onClick}>
          <Icon trash />
        </button>
      </Match>
      <Match when={props.type === "trash"}>
        <button class="btn text-danger" onClick={props.onClick}>
          <Icon trash />
        </button>
      </Match>

      <Match when={props.type === "light"}>
        <button class="btn btn-light" onClick={props.onClick}>
          {props.text}
        </button>
      </Match>

      <Match when={props.type === "CTA"}>
        <button class="btn btn-primary" onClick={props.onClick}>
          {props.text}
        </button>
      </Match>
      <Match when={props.type === "success"}>
        <button class="btn btn-success" onClick={props.onClick}>
          {props.text}
        </button>
      </Match>
    </Switch>
  );
}

{
  /* <button type="button" class="btn btn-primary">Primary</button>
<button type="button" class="btn btn-secondary">Secondary</button>
<button type="button" class="btn btn-success">Success</button>
<button type="button" class="btn btn-danger">Danger</button>
<button type="button" class="btn btn-warning">Warning</button>
<button type="button" class="btn btn-info">Info</button>
<button type="button" class="btn btn-light">Light</button>
<button type="button" class="btn btn-dark">Dark</button>
<button type="button" class="btn btn-link">Link</button> */
}
