import { dateToWeekday } from "./helpers";
import { getProfessionalById, getCustomerById } from "./helpers";
import { store } from "./store";

export default function AppointmentCard(props) {
  // THIS LOOKS TERRIBLE!
  // WE'RE PULLING WAY MORE DATA THAN WE SHOULD
  // GOTTA PASS SOME BETTER SHAPED INFO FOR THE APPOINTMENT VIA PROPS

  let isProfessional = false,
    isCustomer = false;

  if ("customer_id" in props.appointment) isProfessional = true;
  if ("professional_id" in props.appointment) isCustomer = true;

  const appointment = {
    ...props.appointment,
    ...(isCustomer && {
      professional: getProfessionalById(props.appointment.professional_id, store.professionals),
    }),
    ...(isProfessional && {
      customer: getCustomerById(props.appointment.customer_id, store.customers),
    }),
  };

  return (
    <div style={{ ...props.style, padding: ".5rem", background: "#eee" }}>
      <h5>{appointment[isProfessional ? "customer" : "professional"].name}</h5>
      <div>{appointment[isProfessional ? "customer" : "professional"].email}</div>

      {/* UNCOMMENT TO SEE THE INSANE AMOUNT OF UNNECESSARY DATA WE'RE PULLING */}
      {/* <pre>{JSON.stringify(appointment, null, 2)}</pre> */}

      <div>
        {dateToWeekday(appointment.day)} {appointment.time}
      </div>
      <div>{appointment.datetime}</div>
    </div>
  );
}
