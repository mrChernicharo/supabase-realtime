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
            <span>
              {getProfessionalById(offer.professional_id, store.professionals).name.toUpperCase()}{" "}
              {parseWeekday(offer.day)} {offer.time}
            </span>
            <button class="btn btn-success">✔</button>
          </div>
        )}
      </For>
    </div>
  );
}
