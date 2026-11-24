const prefixes = { "Primary Category": "primary", "Sub Category": "secondary", Tags: "tag", "Special Labels": "special" };

export const getCategorySelections = (filter) => {
  if (Array.isArray(filter?.selections)) return filter.selections;
  return (filter?.categoryValues || []).map((value, index) => {
    const categoryType = filter.categoryType;
    return { categoryType, value, key: `${prefixes[categoryType] || categoryType}-${value}`, label: filter.selectedCategoryLabels?.[index] || (filter.categoryValues.length === 1 && filter.selectedCategoryLabel) || String(value) };
  });
};

export const createCategoryFilter = (selections) => selections.length ? {
  selections,
  activeKeys: selections.map((item) => item.key),
  selectedCategoryLabels: selections.map((item) => item.label),
  selectedCategoryLabel: selections.map((item) => item.label).join(", "),
  categoryType: selections[0].categoryType,
  categoryValues: selections.map((item) => item.value),
} : null;

export const toggleCategorySelection = (filter, option) => {
  const selections = getCategorySelections(filter);
  const selected = selections.some((item) => item.categoryType === option.categoryType && String(item.value) === String(option.value));
  return createCategoryFilter(selected
    ? selections.filter((item) => !(item.categoryType === option.categoryType && String(item.value) === String(option.value)))
    : [...selections, option]);
};

export const getCategoryFilterParams = (filter, extraTags = []) => {
  const groups = {};
  const fields = { "Primary Category": "primaryCategoryId", "Sub Category": "subcategoryId", Tags: "tags", "Special Labels": "tags" };
  getCategorySelections(filter).forEach(({ categoryType, value }) => {
    const field = fields[categoryType];
    if (field && value != null && String(value).trim()) (groups[field] ||= new Set()).add(String(value));
  });
  extraTags.forEach((tag) => (groups.tags ||= new Set()).add(String(tag)));
  const params = Object.fromEntries(Object.entries(groups).map(([key, values]) => [key, [...values].join(",")]));
  // Preserve legacy category searches such as locations.
  if (!Object.keys(params).length && filter?.categoryType && filter?.categoryValues?.length) {
    params.categoryType = filter.categoryType;
    params.categoryValues = filter.categoryValues.join(",");
  }
  return params;
};

export const countActiveFilters = (filters) => {
  const hasValue = (value) => value !== "" && value != null;
  let count = getCategorySelections(filters.apiCategoryFilter).length;
  ["propertyTypes", "amenities", "mealPlan", "ratings", "tags", "specialLabels", "categories"].forEach((key) => { count += filters[key]?.length || 0; });
  if (hasValue(filters.priceRange?.min) || hasValue(filters.priceRange?.max)) count++;
  else if (filters.pricePresetMax) count++;
  if (filters.dateRange?.startDate) count++;
  if (filters.dateRange?.endDate) count++;
  return count;
};

export const writeCategoryFilterParams = (params, filter) => {
  ["categoryType", "categoryValues", "selectedCategoryLabel", "categorySelections"].forEach((key) => params.delete(key));
  const selections = getCategorySelections(filter);
  if (selections.length) params.set("categorySelections", JSON.stringify(selections));
};

export const readCategoryFilterParams = (search, fallback) => {
  const value = new URLSearchParams(search).get("categorySelections");
  if (value == null) return fallback;
  try {
    const selections = JSON.parse(value);
    if (!Array.isArray(selections)) return fallback;
    return createCategoryFilter(selections.filter((item) => item && typeof item.categoryType === "string" && typeof item.key === "string" && typeof item.label === "string" && ["string", "number"].includes(typeof item.value)));
  } catch {
    return fallback;
  }
};
