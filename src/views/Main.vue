<template>
  <div>
    <Navbar/>
    <div class='main'>
      <CreateShortForm/>
      <ShortList/>
    </div>
  </div>
</template>

<script>
import CreateShortForm from "../components/CreateShortForm.vue";
import ShortList from "../components/ShortList.vue";
import Navbar from "../components/Navbar.vue";

export default {
  name: "Main",
  components: {
    CreateShortForm,
    ShortList,
    Navbar
  }
};
</script>
