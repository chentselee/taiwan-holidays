export interface Holiday {
  date: string;
  name: string;
  isHoliday: "是" | "否";
  holidayCategory:
    | "星期六、星期日"
    | "放假之紀念日及節日"
    | "補假"
    | "調整放假日";
  description: string;
}
