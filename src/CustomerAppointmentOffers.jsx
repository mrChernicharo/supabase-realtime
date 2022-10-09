import { For } from "solid-js";
import { getProfessionalById, parseWeekday } from "./helpers";
import { store } from "./store";

export default function CustomerAppointmentOffers(props) {
  return (
    <div>
      <h3>Appointment Offers</h3>

      {/* <pre>{JSON.stringify(props.offers, null, 2)}</pre> */}
      <For each={props.offers}>
        {(offer) => (
          <div>
            <p>{getProfessionalById(offer.professional_id, store.professionals).name}</p>
            <p>
              {parseWeekday(offer.day)} {offer.time}
            </p>
          </div>
        )}
      </For>
    </div>
  );
}
