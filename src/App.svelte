<script lang="ts">
  import type { Holiday } from "src/model/Holiday";

  async function fetchHolidays(page: number) {
    const queryParams = new URLSearchParams({
      size: "512",
      page: page.toString(),
    });
    return fetch(
      `https://data.ntpc.gov.tw/api/datasets/308DCD75-6434-45BC-A95F-584DA4FED251/json?${queryParams.toString()}`
    ).then((res) => res.json() as Promise<Holiday[]>);
  }

  async function fetchHolidaysUntilEmpty(page = 0): Promise<Holiday[]> {
    const holidays = await fetchHolidays(page);
    if (holidays.length > 0) {
      return holidays.concat(await fetchHolidaysUntilEmpty(page + 1));
    } else {
      return holidays;
    }
  }
</script>

<main class="bg-gray-50">
  {#await fetchHolidaysUntilEmpty()}
    <p>Loading...</p>
  {:then holidays}
    <article class="px-[5%] py-[3%]">
      <h1 class="text-3xl">中華民國政府行政機關辦公日曆表</h1>
      <p class="mt-1">
        資料來源：
        <a
          href="https://data.ntpc.gov.tw/datasets/308DCD75-6434-45BC-A95F-584DA4FED251"
          target="_blank"
          class="text-blue-600"
        >
          新北市政府資料開放平台
        </a>
      </p>
      <section class="holidays mt-6 gap-x-8 gap-y-9">
        {#each holidays
          .flat()
          .filter((holiday) => holiday.date.includes("2021") && holiday.isHoliday === "是" && holiday.holidayCategory !== "星期六、星期日") as holiday}
          <section
            class="border border-gray-800 rounded shadow bg-white px-6 py-5 space-y-3"
          >
            <h2 class="text-2xl font-light text-gray-900 underline">
              {holiday.date}
            </h2>
            <div class="flex align-baseline space-x-2">
              <h3 class="font-semibold">{holiday.name}</h3>
              <span class="text-sm bg-gray-200 rounded px-2 py-1">
                {holiday.holidayCategory}
              </span>
            </div>
            <p>{holiday.description}</p>
          </section>
        {/each}
      </section>
    </article>
  {:catch error}
    <p>{JSON.stringify(error.message)}</p>
  {/await}
</main>

<style>
  @import "./index.css";

  .holidays {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    grid-auto-rows: 1fr;
  }
</style>
