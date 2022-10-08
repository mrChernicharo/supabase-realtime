import { createSignal, createEffect, onMount, onCleanup } from 'solid-js';
import { supabase } from './supabaseClient';

const channel = supabase.channel('db-customers-events');
const sessionId = Math.random();

const useCustomers = () => {
	const [customers, setCustomers] = createSignal([]);

	async function addCustomer(email) {
		console.log(email);
		const name = email.split('@')[0];
		console.log('add customer', { email, name });

		await supabase.from('customers').insert({ email, name });

		const data = {
			email,
			name,
		};

		channel.send({
			type: 'broadcast',
			event: 'customer_added',
			sessionId,
			data,
		});

		setCustomers([...customers(), { email, name }]);
	}

	async function removeCustomer(id) {
		await supabase.from('customers').delete().match({ id });
		console.log('remove customer', { id });

		channel.send({
			type: 'broadcast',
			event: 'customer_removed',
			sessionId,
			id,
		});
		console.log('remove customer', id);
		setCustomers(customers().filter(u => u.id !== id));
	}

	onMount(async () => {
		const { data } = await supabase.from('customers').select('*');
		setCustomers(data);

		channel
			.on('broadcast', { event: 'customer_added' }, payload => {
				console.log('customer_added', { ...payload.data });

				setCustomers([...customers(), { ...payload.data }]);
			})
			.on('broadcast', { event: 'customer_removed' }, payload => {
				console.log('customer_removed', { payload });
				setCustomers(customers().filter(u => u.id !== payload.id));
			})
			.subscribe(status => console.log('useCustomers', status));
	});

	onCleanup(() => {
		channel.unsubscribe();
	});

	return { customers, setCustomers, addCustomer, removeCustomer };
};
export default useCustomers;
