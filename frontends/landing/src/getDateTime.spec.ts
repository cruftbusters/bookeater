import { describe, test,expect } from "vitest";
import { getDateTime } from "./getDateTime";

describe(getDateTime, () => {
  test("sortable date format", () => {
    const date1 = new Date('February 7, 400 03:04:00')

    expect(getDateTime(date1)).toBe('0400-02-07 03:04:00')
  })
  test("24h", () => {
    const date1 = new Date('February 7, 400 11:04:00 PM')

    expect(getDateTime(date1)).toBe('0400-02-07 23:04:00')
  })
})
