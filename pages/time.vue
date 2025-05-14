<template>
  <div>
    <h1>Current Date and Time</h1>
    <p id="currentDateTime"></p>
    <p id="formattedDateTime"></p>
  <button @click="updateDateTime">Update Date and Time</button>
  </div>
</template>

<script setup>
const updateDateTime = () => {
  const starttime = new Date().toLocaleTimeString();
  const currentDateTime = new Date();
  const formattedDateTime = currentDateTime.toLocaleString('en-US', {
    timeZone: 'America/New_York',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  console.log("starttime: ", starttime);
  console.log("currentDateTime: ", currentDateTime);
  console.log("formattedDateTime: ", formattedDateTime);
};
</script>
