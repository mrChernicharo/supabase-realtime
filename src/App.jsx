import { createClient } from '@supabase/supabase-js';
import { createSignal } from 'solid-js';

import { supabase } from './supabaseClient';
// The name of the channel can be set to any string.
// Set the same name across both the broadcasting and receiving clients.
const channel = supabase.channel('user1-location', {
	configs: {
		broadcast: { ack: true },
	},
});

channel
	// .on('broadcast', { event: 'location' }, (payload) => console.log(payload))
	.subscribe(async status => {
		console.log(status);
		if (status === 'SUBSCRIBED') {
			// sending a new message every second
			setInterval(async () => {
				const message = await channel.send({
					type: 'broadcast',
					event: 'location',
					payload: { x: Math.random(), y: Math.random() },
				});
				console.log(message);
			}, 1000);
		}
	});

function App() {
	const [professionalEmail, setProfessionalEmail] = createSignal('');

	return (
		<div>
			Hello
			<input
				type="email"
				value={professionalEmail()}
				onChange={e => setProfessionalEmail(e.currentTarget.value)}
			/>
		</div>
	);
}

export default App;
