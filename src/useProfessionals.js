import { createSignal, createEffect, onCleanup, onMount } from 'solid-js';
import { supabase } from './supabaseClient';

const channel = supabase.channel('db-professionals-events');

const useProfessionals = () => {
	const [professionals, setProfessionals] = createSignal([]);

	async function addProfessional(email) {
		const name = email.split('@')[0];

		const { error } = await supabase
			.from('professionals', { returning: 'representation' })
			.insert([{ email, name }]);

		const { data: results } = await supabase
			.from('professionals')
			.select('*')
			.eq('email', email);

		const data = results[0];
		console.log('add Professional', { email, name, data });

		channel.send({
			type: 'broadcast',
			event: 'professional_added',
			data,
		});
		setProfessionals(prev => [...prev, data]);
	}

	async function removeProfessional(id) {
		await supabase.from('professionals').delete().match({ id });

		channel.send({
			type: 'broadcast',
			event: 'professional_removed',
			id,
		});
		console.log('remove Professional', id);
		setProfessionals(professionals().filter(u => u.id !== id));
	}

	onMount(async () => {
		const { data } = await supabase.from('professionals').select('*');
		setProfessionals(data);

		channel
			.on('broadcast', { event: 'professional_added' }, payload => {
				console.log('professional_added', { ...payload.data });

				setProfessionals(prev => [...prev, { ...payload.data }]);
			})
			.on('broadcast', { event: 'professional_removed' }, payload => {
				console.log('professional_removed', { payload });
				setProfessionals(prev => prev.filter(u => u.id !== payload.id));
			})
			.on('broadcast', { event: 'staff_professional_added' }, payload => {
				console.log('staff_professional_added', { payload });
				// setProfessionals(prev => [...prev, { ...payload.data }]);
				// setProfessionals(prev => prev.filter(u => u.id !== payload.id));
			});
		channel.subscribe(status => console.log('useProfessionals', status));
	});

	onCleanup(() => {
		channel.unsubscribe();
	});

	return {
		professionals,
		setProfessionals,
		addProfessional,
		removeProfessional,
	};
};
export default useProfessionals;
