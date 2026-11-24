import { countActiveFilters, createCategoryFilter, getCategoryFilterParams, getCategorySelections, readCategoryFilterParams, toggleCategorySelection, writeCategoryFilterParams } from "./listingFilters";

const main = { key: "primary-1", categoryType: "Primary Category", value: 1, label: "Adventure" };
const sub = { key: "secondary-1", categoryType: "Sub Category", value: 1, label: "Kayaking" };
const tag = { key: "tag-Family", categoryType: "Tags", value: "Family", label: "Family" };

test("selections from different sections accumulate and count each chip", () => {
  let filter = null;
  [main, sub, tag].forEach((option) => { filter = toggleCategorySelection(filter, option); });
  expect(filter.activeKeys).toEqual([main.key, sub.key, tag.key]);
  expect(countActiveFilters({ apiCategoryFilter: filter })).toBe(3);
  expect(getCategoryFilterParams(filter)).toEqual({ primaryCategoryId: "1", subcategoryId: "1", tags: "Family" });
  filter = toggleCategorySelection(filter, sub);
  expect(getCategorySelections(filter)).toEqual([main, tag]);
  expect(getCategoryFilterParams(filter)).toEqual({ primaryCategoryId: "1", tags: "Family" });
});

test("multiple values within a section and extra tags are retained", () => {
  const filter = createCategoryFilter([main, { ...main, key: "primary-2", value: 2 }, sub, tag]);
  expect(getCategoryFilterParams(filter, ["Family", "Weekend"])).toEqual({ primaryCategoryId: "1,2", subcategoryId: "1", tags: "Family,Weekend" });
  expect(countActiveFilters({ apiCategoryFilter: filter, amenities: ["wifi", "pool"], ratings: [4], dateRange: { startDate: "2026-12-01", endDate: "2026-12-02" } })).toBe(9);
});

test("URL round trips all sections and clear removes every selection", () => {
  const filter = createCategoryFilter([main, sub, tag]);
  const params = new URLSearchParams("categoryType=Tags&categoryValues=Old&businessInterest=FOOD");
  writeCategoryFilterParams(params, filter);
  expect(readCategoryFilterParams(params.toString(), null)).toEqual(filter);
  expect(params.has("categoryType")).toBe(false);
  writeCategoryFilterParams(params, null);
  expect(readCategoryFilterParams(params.toString(), null)).toBeNull();
  expect(params.get("businessInterest")).toBe("FOOD");
});

test("legacy homepage category links use matching sidebar keys", () => {
  const legacy = { categoryType: "Primary Category", categoryValues: [1], selectedCategoryLabel: "Adventure" };
  expect(toggleCategorySelection(legacy, sub).activeKeys).toEqual([main.key, sub.key]);
  expect(toggleCategorySelection(legacy, main)).toBeNull();
  expect(countActiveFilters({ priceRange: { min: 0, max: 100 }, pricePresetMax: 500 })).toBe(1);
});
