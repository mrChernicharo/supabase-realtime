import { createSignal, createEffect } from 'solid-js';
import { onMount } from 'solid-js';
import { supabase } from './supabaseClient';

const channel = supabase.channel('db-events');

function App() {
	async function addStaff(e) {
		if (e.currentTarget.validity.valid) {
			const email = e.currentTarget.value;
			const name = email.split('@')[0];
			await supabase.from('staff').insert({ email, name });

			const data = {
				email,
				name,
			};

			channel.send({
				type: 'broadcast',
				event: 'staff_added',
				data,
			});

			console.log('staff email created');
			setStaff(prev => [...prev, { ...data }]);
		} else {
			console.log('invalid email');
		}
	}

	const [staff, setStaff] = createSignal([]);

	onMount(() => {
		channel
			.on('broadcast', { event: 'staff_added' }, payload => {
				console.log('staff_added', { payload });

				setStaff(prev => [...prev, { ...payload.data }]);
			})
			.subscribe(console.log);
	});

	createEffect(async () => {
		const { data } = await supabase.from('staff').select('*');
		setStaff(data);
	});

	return (
		<div>
			Hello
			<input type="email" onChange={addStaff} />
			<pre style={{ 'font-size': '8px' }}>
				{JSON.stringify(staff(), null, 2)}
			</pre>
		</div>
	);
}

export default App;
