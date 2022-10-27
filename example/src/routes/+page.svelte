<script lang="ts">
    import Comp_Autowire_98172634 from './Comp.svelte'

    const Scoped = {
        ASD: Comp_Autowire_98172634
    }

    
    onMount(()=>{
        console.log("Hello world from on-mount")
    })
</script>

<Scoped.ASD />

<MyButton text="Very cool button"/>
<MyOtherButton deez="Hello World"/>
<MyThirdComponent/>

<Icons.Account/>
<Icons.Home/>
<Icons.Generic name="Generic"/>
<Icons.Generic name="Other Generic"/>

<NestedComponent/>