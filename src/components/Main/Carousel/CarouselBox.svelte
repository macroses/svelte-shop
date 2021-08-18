<script>
    import Carousel from 'svelte-carousel';
	import Model from '../../../model/data-service';

	const temp = new Model();

	const allimg = temp.getAllItems()
</script>

<Carousel
    autoplay
    autoplayDuration={5000}
    autoplayProgressVisible
>
</Carousel>