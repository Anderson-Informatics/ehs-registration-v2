export default defineEventHandler(async (event) => {
  // Get data from body
  const body = await readBody(event);
  console.log(
    `Add API: HSPT Taken label for ${body.FirstName} ${body.LastName}`
  );

  // Get the runtimeconfig SUBMITTABLE API KEY
  const SUBMITTABLE_API_KEY = useRuntimeConfig().SUBMITTABLE_API_KEY;

  // Update a result
  try {
    console.log(SUBMITTABLE_API_KEY)
    const labelId = '1b266c74-9e43-4a05-b580-2e707d17b961'
    const response = await $fetch(
      `https://submittable-api.submittable.com/v4/submissions/${body.submissionIdUnique}/labels/${labelId}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: `Basic ${SUBMITTABLE_API_KEY}`,
        },
      }
    );

    return { message: "HSPT label properly applied" };
  } catch (e) {
    throw createError({
      message: e.message,
    });
    return { message };
  }
});
