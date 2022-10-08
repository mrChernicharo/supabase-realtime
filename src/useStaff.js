import { createSignal, createEffect, onMount, onCleanup } from "solid-js";
import { supabase } from "./supabaseClient";

const channel = supabase.channel("db-staff-events");
const staffProfChannel = supabase.channel("db-staff-professionals-events");
const sessionId = Math.random();

const useStaff = () => {
  const [staff, setStaff] = createSignal([]);

  async function addStaff(email) {
    console.log(email);
    const name = email.split("@")[0];

    await supabase.from("staff").insert([{ email, name }]);
    const { data: results } = await supabase
      .from("staff")
      .select("*")
      .eq("email", email);

    const data = results[0];

    console.log("addStaff", { email, name, data });

    channel.send({
      type: "broadcast",
      event: "staff_added",
      sessionId,
      data,
    });

    setStaff([...staff(), { ...data }]);
  }

  async function removeStaff(id) {
    await supabase.from("staff").delete().match({ id });
    console.log("removeStaff", { id });

    channel.send({
      type: "broadcast",
      event: "staff_removed",
      sessionId,
      id,
    });
    console.log("remove staff", id);
    setStaff(staff().filter((u) => u.id !== id));
  }

  async function createProfessional(info) {
    const { id, name, email } = info;

    staffProfChannel.send({
      type: "broadcast",
      event: "staff-professional",
      data: { id, name, email },
    });
  }

  onMount(async () => {
    const { data } = await supabase.from("staff").select("*");
    setStaff(data);

    channel
      .on("broadcast", { event: "staff_added" }, (payload) => {
        console.log("staff_added", { ...payload.data });
        setStaff([...staff(), { ...payload.data }]);
      })
      .on("broadcast", { event: "staff_removed" }, (payload) => {
        console.log("staff_removed", { payload });
        setStaff(staff().filter((u) => u.id !== payload.id));
      })
      .subscribe((status) => console.log("useStaff", status));

    staffProfChannel.subscribe((status) => console.log("staffChannel", status));
  });

  onCleanup(() => {
    channel.unsubscribe();
    staffProfChannel.unsubscribe();
  });

  return { staff, setStaff, addStaff, removeStaff, createProfessional };
};
export default useStaff;
