import { onMount } from 'solid-js';
import { createSignal, createEffect } from 'solid-js';
import { supabase } from './supabaseClient';

const channel = supabase.channel('db-events');
const sessionId = Math.random();

const useStaff = () => {
	const [staff, setStaff] = createSignal([]);

	async function addStaff(email) {
		const name = email.split('@')[0];
		console.log('addStaff', { email, name });

		await supabase.from('staff').insert({ email, name });

		const data = {
			email,
			name,
		};

		channel.send({
			type: 'broadcast',
			event: 'staff_added',
			sessionId,
			data,
		});

		setStaff([...staff(), { email, name }]);
	}

	async function removeStaff(id) {
		await supabase.from('staff').delete().match({ id });
		console.log('removeStaff', { id });

		channel.send({
			type: 'broadcast',
			event: 'staff_removed',
			sessionId,
			id,
		});
		console.log('remove staff', id);
		setStaff(staff().filter(u => u.id !== id));
	}

	onMount(async () => {
		const { data } = await supabase.from('staff').select('*');
		setStaff(data);

		channel
			.on('broadcast', { event: 'staff_added' }, payload => {
				console.log('staff_added', { ...payload.data });

				setStaff([...staff(), { ...payload.data }]);
			})
			.on('broadcast', { event: 'staff_removed' }, payload => {
				console.log('staff_removed', { payload });
				setStaff(staff().filter(u => u.id !== payload.id));
			})
			.subscribe(console.log);
	});

	return { staff, setStaff, addStaff, removeStaff };
};
export default useStaff;
