<script lang="ts">    
    onMount(()=>{
        console.log("Hello world from on-mount")
    })
</script>

<Comp.Nested1.Nested2.MyNestedComponent/>
<Comp.Nested1.Nested2.Other/>

<Icons.Account/>
<Icons.Home/>
<Icons.Generic name="Generic"/>
<Icons.Generic name="Other Generic"/>

<NestedComponent/>