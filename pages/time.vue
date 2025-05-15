<template>
  <div>
    <h1>Current Date and Time</h1>
    <p id="currentDateTime"></p>
    <p id="formattedDateTime"></p>
    {{ serverTime }}
    <button @click="updateDateTime">Update Date and Time</button>
  </div>
</template>

<script setup>
const serverTime = await useFetch('/api/sessions/time');
console.log(await useFetch('/sessions/time'));
console.log('serverTime: ', serverTime);
const updateDateTime = () => {
  const starttime = new Date().toLocaleString('en-US', {
    timeZone: 'America/Detroit',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  });
  const currentDateTime = new Date();
  const formattedDateTime = new Intl.DateTimeFormat("en-US", {
    dateStyle: "short",
    timeZone: "America/Detroit",
  }).format(new Date());
  const usDate = new Date().toLocaleString('en-US', {
    timeZone: 'America/Detroit',
    month: 'numeric',
    day: '2-digit',
    year: 'numeric',
  });
  console.log('starttime: ', starttime);
  console.log('currentDateTime: ', currentDateTime);
  console.log('formattedDateTime: ', formattedDateTime);
  console.log('usDate: ', usDate);
};
</script>
