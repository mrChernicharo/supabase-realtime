import { onMount, For, createMemo } from "solid-js";
import { store, createAppointmentOffers } from "./store";
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

  async function handleSubmit(e) {
    e.preventDefault();
    const selectedCheckboxes = [...e.currentTarget].filter((d) => d.checked);
    const selectedTimeBlocks = selectedCheckboxes.map((d) => ({
      ...d.dataset,
      customer_id: props.customer.id,
    }));
    console.log({ selectedCheckboxes });

    await createAppointmentOffers(selectedTimeBlocks);
  }

  return (
    <div>
      <button onClick={props.onClose}>X</button>

      <h3>{props.customer.name}</h3>
      <p>{props.customer.email}</p>

      <form onSubmit={handleSubmit}>
        <For each={Object.keys(availableMatches())}>
          {(profId, profIdx) => (
            <div>
              <h4>{getProfessional(profId).name}</h4>

              <For each={availableMatches()[profId]}>
                {(block, i) => (
                  <div>
                    <label>
                      {parseWeekday(block.day)} {block.time}{" "}
                      <input
                        type="checkbox"
                        // data-hash={`${block.day} ${profId} ${block.time}`}
                        // value={availableMatches()[profId][block.id]}
                        data-professional_id={getProfessional(profId).id}
                        data-day={block.day}
                        data-time={block.time}
                        // data-prof-idx={profIdx()}
                        // data-slot-idx={i()}
                      />
                    </label>
                  </div>
                )}
              </For>
            </div>
          )}
        </For>

        <button>Send</button>
      </form>
    </div>
  );
}
