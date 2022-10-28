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

<Comp.MyButton text="Very cool button"/>
<Comp.MyOtherButton deez="Hello World"/>
<Comp.MyThirdComponent/>

<Icons.Account/>
<Icons.Home/>
<Icons.Generic name="Generic"/>
<Icons.Generic name="Other Generic"/>

<NestedComponent/>