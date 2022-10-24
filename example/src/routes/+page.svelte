<script lang="ts">
    onMount(()=>{
        alert("Hello world from on-mount")
    })
</script>

<MyButton text="Very cool button"/>
<MyOtherButton deez="Hello World"/>
<MyThirdComponent/>

<Icons.Account/>
<Icons.Home/>
<Icons.Generic name="Generic"/>
<Icons.Generic name="Other"/>

<NestedComponent/>