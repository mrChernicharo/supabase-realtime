import { Match, Switch } from "solid-js";
import Icon from "./Icon";

export default function Button(props) {
  return (
    <Switch>
      <Match when={props.kind === "open"}>
        <button class="btn" {...props}>
          <Icon chevronDown />
        </button>
      </Match>
      <Match when={props.kind === "close"}>
        <button class="btn" {...props}>
          <Icon close />
        </button>
      </Match>
      <Match when={props.kind === "delete"}>
        <button class="btn text-danger" {...props}>
          <Icon trash />
        </button>
      </Match>
      <Match when={props.kind === "trash"}>
        <button class="btn text-danger" {...props}>
          <Icon trash />
        </button>
      </Match>
      <Match when={props.kind === "logout"}>
        <button class="btn" {...props}>
          <Icon logout />
        </button>
      </Match>

      <Match when={props.kind === "light"}>
        <button class="btn btn-light" {...props}>
          {props.text}
        </button>
      </Match>

      <Match when={props.kind === "CTA"}>
        <button class="btn btn-primary" {...props}>
          {props.text}
        </button>
      </Match>
      <Match when={props.kind === "success"}>
        <button class="btn btn-success" {...props}>
          {props.text}
        </button>
      </Match>
    </Switch>
  );
}

{
  /* <Button kind="button" class="btn btn-primary">Primary</button>
<Button kind="button" class="btn btn-secondary">Secondary</button>
<Button kind="button" class="btn btn-success">Success</button>
<Button kind="button" class="btn btn-danger">Danger</button>
<Button kind="button" class="btn btn-warning">Warning</button>
<Button kind="button" class="btn btn-info">Info</button>
<Button kind="button" class="btn btn-light">Light</button>
<Button kind="button" class="btn btn-dark">Dark</button>
<Button kind="button" class="btn btn-link">Link</button> */
}
