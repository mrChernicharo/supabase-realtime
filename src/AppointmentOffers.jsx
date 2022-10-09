import { For } from "solid-js";
import { parseWeekday } from "./helpers";

export default function AppointmentOffers(props) {
  return (
    <div>
      <h3>Appointment Offers</h3>

      {/* <pre>{JSON.stringify(props.offers, null, 2)}</pre> */}
      <For each={props.offers}>
        {(offer) => (
          <div>
            <p>{offer.professional_id}</p>
            <p>{parseWeekday(offer.day)}</p>
            <p>{offer.time}</p>
          </div>
        )}
      </For>
    </div>
  );
}
