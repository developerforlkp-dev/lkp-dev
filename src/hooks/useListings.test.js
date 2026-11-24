import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import { useListings } from "./useListings";
import { createCategoryFilter } from "../utils/listingFilters";
import * as api from "../utils/api";

jest.mock("../utils/api", () => ({
  getFilteredListings: jest.fn(), filterFoodMenus: jest.fn(), filterPlaces: jest.fn(),
  filterEventListings: jest.fn(), filterStayListings: jest.fn(),
}));

test.each([
  ["EXPERIENCE", "getFilteredListings"], ["EVENT", "filterEventListings"],
  ["FOOD", "filterFoodMenus"], ["PLACE", "filterPlaces"], ["STAY", "filterStayListings"],
])("%s sends main category, subcategory, and tags together", async (businessInterest, method) => {
  api[method].mockResolvedValue({ listings: [], totalCount: 0, hasMore: false });
  const categoryFilter = createCategoryFilter([
    { key: "primary-1", categoryType: "Primary Category", value: 1, label: "Main" },
    { key: "secondary-2", categoryType: "Sub Category", value: 2, label: "Sub" },
    { key: "tag-Family", categoryType: "Tags", value: "Family", label: "Family" },
  ]);
  // Keep input references stable across hook state updates.
  const filters = {};
  const guests = {};
  function Harness() {
    useListings({ businessInterest, categoryFilter, filters, guests });
    return null;
  }
  const root = document.createElement("div");
  await act(async () => { ReactDOM.render(<Harness />, root); });
  expect(api[method]).toHaveBeenLastCalledWith(expect.objectContaining({ primaryCategoryId: "1", subcategoryId: "2", tags: "Family" }));
  act(() => { ReactDOM.unmountComponentAtNode(root); });
});
