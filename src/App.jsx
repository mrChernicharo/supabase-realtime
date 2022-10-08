import { createClient } from '@supabase/supabase-js';
import { createSignal } from 'solid-js';

import { supabase } from './supabaseClient';

function App() {
	const staffChannel = supabase.channel('staff');

	const [currentStaff, setCurrentStaff] = createSignal([]);

	const addStaff = async e => {
		if (e.currentTarget.validity.valid)
			setCurrentStaff(prev => [...prev, e.currentTarget.value]);
		await staffChannel.send({
			type: 'broadcast',
			event: 'staff_updated',
			payload: currentStaff(),
		});
	};

	staffChannel
		.on('broadcast', { event: 'staff_updated' }, data => {
			console.log('staff_updated', data.payload);
			setCurrentStaff(data.payload);
		})
		.subscribe(async status => {
			console.log(status);
		});

	return (
		<div>
			Hello
			<input type="email" onChange={addStaff} />
			<pre>{JSON.stringify(currentStaff(), null, 2)}</pre>
		</div>
	);
}

export default App;
