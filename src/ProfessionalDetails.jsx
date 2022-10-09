import { createSignal, onMount } from "solid-js";
import { parseWeekday, getWorkingHours, getCustomerById } from "./helpers";
import EditProfessionalAvailability from "./EditProfessionalAvailability";
import { store } from "./store";

export default function ProfessionalDetails(props) {
  return (
    <>
      <button onClick={props.onClose}>X</button>
      <h2>{props.professional.name}</h2>
      <p>{props.professional.email}</p>

      <h3>Professional Availability</h3>
      <ul>
        <For each={props.professional.availability}>
          {(timeBlock) => (
            <li>
              <p style={{ color: timeBlock.status === "1" ? "green" : "red" }}>
                {parseWeekday(timeBlock.day)} {timeBlock.time}
              </p>
              {/* <pre>{JSON.stringify(timeBlock, null, 2)}</pre> */}
              <pre>
                {JSON.stringify(
                  {
                    ...props.professional.appointments
                      .filter((app) => app.day === timeBlock.day && app.time === timeBlock.time)
                      .map((res) => ({
                        ...res,
                        customer: getCustomerById(res.customer_id, store.customers).name,
                      })),
                  },
                  null,
                  2
                )}
              </pre>
            </li>
          )}
        </For>
      </ul>
      {/* <pre>{JSON.stringify(props.professional.appointments, null, 2)}</pre> */}

      <EditProfessionalAvailability availability={props.professional.availability} />
    </>
  );
}
