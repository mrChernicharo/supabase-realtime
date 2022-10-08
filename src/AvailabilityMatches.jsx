import { onMount, For, createMemo } from "solid-js";
import { store } from "./store";
import { parseWeekday } from "./helpers";

export default function AvailabilityMatches(props) {
  onMount(() => {
    console.log(store.professionals);
  });

  const getProfessional = (id) => store.professionals.find((p) => p.id === id);

  const availableMatches = createMemo(() => {
    const availObj = {};
    props.customer.availability.forEach(({ day, time }) => {
      if (!(day in availObj)) availObj[day] = [];

      availObj[day].push({ day, time });
    });

    const matchingAvailsByProfessional = {};
    store.professionals.forEach((prof) => {
      const commonProfAvailability = prof.availability.filter(
        (av) =>
          av.status === "1" &&
          av.day in availObj &&
          availObj[av.day].find((o) => o.time === av.time)
      );

      matchingAvailsByProfessional[prof.id] = commonProfAvailability;
    });

    console.log({ matchingAvailsByProfessional, availObj });
    return matchingAvailsByProfessional;
  });

  return (
    <div>
      <button onClick={props.onClose}>X</button>

      <h3>{props.customer.name}</h3>
      <p>{props.customer.email}</p>

      <For each={Object.keys(availableMatches())}>
        {(profId) => (
          <div>
            <h4>{getProfessional(profId).name}</h4>

            <For each={availableMatches()[profId]}>
              {(profAvail) => (
                <div>
                  {parseWeekday(profAvail.day)}
                  {profAvail.time}
                </div>
              )}
            </For>
          </div>
        )}
      </For>
    </div>
  );
}
