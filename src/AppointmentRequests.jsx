import { store } from "./store";

export default function AppointmentRequests(props) {
  // fetch customers without appointments & display

  const idleCustomers = () => store.customers.filter((c) => !c.appointments.length);

  // appointmentRequest customer matchingProfessionalAvailabilities
  // fetch all professionals availabilities
  // filter matching availabilities

  return (
    <div style={{ border: "1px dashed" }}>
      <h1>Appointment Requests</h1>

      <pre>{JSON.stringify(idleCustomers(), null, 2)}</pre>
    </div>
  );
}
