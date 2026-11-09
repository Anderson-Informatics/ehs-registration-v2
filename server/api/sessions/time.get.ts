export default defineEventHandler(async () => {
  const starttime = new Date().toLocaleTimeString();
  return starttime;
});
