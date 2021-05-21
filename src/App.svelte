<script lang="ts">
  import type { Holiday } from "src/model/Holiday";
  import { range } from "./lib/range";

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

  const minYear = 2013;
  const maxYear = new Date().getFullYear();
  let year = maxYear;
</script>

<main class="bg-gray-50 px-[5%] py-[3%]">
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
  <form class="mt-2" on:submit|preventDefault={() => {}}>
    <label for="year">
      年份
      <select name="year" id="year" bind:value={year}>
        {#each range(minYear, maxYear + 1) as year}
          <option value={year}>{year}</option>
        {/each}
      </select>
    </label>
  </form>
  <article class="mt-1">
    {#await fetchHolidaysUntilEmpty()}
      <p>讀取中...</p>
    {:then holidays}
      <section class="holidays mt-6 gap-x-8 gap-y-9">
        {#each holidays
          .flat()
          .filter((holiday) => holiday.date.includes(year.toString()) && holiday.isHoliday === "是" && holiday.holidayCategory !== "星期六、星期日") as holiday}
          <section
            class="border border-gray-800 rounded shadow bg-white px-6 py-5 space-y-3"
          >
            <h2 class="text-2xl font-light text-gray-900 underline">
              {holiday.date}
            </h2>
            <div class="flex align-baseline gap-x-2 gap-y-1 flex-wrap">
              <h3 class="font-semibold">{holiday.name}</h3>
              <span class="text-sm bg-gray-200 rounded px-2 py-1">
                {holiday.holidayCategory}
              </span>
            </div>
            <p>{holiday.description}</p>
          </section>
        {/each}
      </section>
    {:catch error}
      <p>{JSON.stringify(error.message)}</p>
    {/await}
  </article>
</main>

<style>
  @import "./index.css";

  .holidays {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(80vw, 1fr));
    grid-auto-rows: 1fr;
  }

  @media (min-width: 400px) {
    .holidays {
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    }
  }
</style>
