import Staff from "./Staff";
import Customers from "./Customers";
import Professionals from "./Professionals";
import AppointmentRequests from "./AppointmentRequests";
import { store } from "./store";

function EntryPoint() {
  return (
    <>
      <div style={{ display: "flex" }}>
        <Staff />

        <Customers />

        <Professionals />
      </div>

      <AppointmentRequests />
      {/* <pre>{JSON.stringify(store, null, 2)}</pre> */}
    </>
  );
}

export default EntryPoint;