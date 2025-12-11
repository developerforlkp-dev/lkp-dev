# Comprehensive "Stay/Stays" Reference Audit Report

**Date:** Generated after refactoring from "stays" to "experience"  
**Scope:** Full codebase scan for all occurrences of "stay" or "stays" (case-insensitive)  
**Purpose:** Identify remaining references that may need attention

---

## Summary

**Total Occurrences Found:** 10 unique references  
**Files Affected:** 5 files  
**Status:** All references are legitimate UI text or mock data, not structural code references

---

## Detailed Findings

### 1. **Comment References** (1 occurrence)

#### `src/screens/Category/index.js`
- **Line 23:** `// Note: Component internally renamed from StaysCategory to ExperienceCategory`
- **Type:** Comment/documentation
- **Status:** ✅ **KEEP** - This is a helpful migration note documenting the refactoring
- **Action Required:** None (informational comment)

---

### 2. **UI Text/String Literals** (7 occurrences)

#### `src/screens/ExperienceCategory/Catalog/index.js`
- **Line 89:** `title="Places to stay"`
- **Type:** UI text (page title)
- **Status:** ⚠️ **REVIEW** - This is user-facing text. Consider if it should be "Places to experience" or kept as generic travel terminology
- **Action Required:** Decision needed on whether to change user-facing text

#### `src/components/AddOnsModal/index.js`
- **Line 34:** `description: "Extend your stay until 2 PM at no additional charge"`
- **Type:** UI text (add-on description)
- **Status:** ✅ **KEEP** - This is correct terminology for accommodation check-out times
- **Action Required:** None (legitimate use of "stay" in hospitality context)

- **Line 109:** `<h2 className={styles.modalTitle}>Customize your stay</h2>`
- **Type:** UI text (modal title)
- **Status:** ⚠️ **REVIEW** - This modal is used for experiences. Consider "Customize your experience" or generic "Customize your booking"
- **Action Required:** Decision needed - may need to be context-aware or generic

#### `src/components/Live/index.js`
- **Line 25:** `title: "Unique stay"`
- **Type:** UI text (card title)
- **Status:** ⚠️ **REVIEW** - This appears in a Live component. Consider "Unique experience" or keep as generic travel term
- **Action Required:** Decision needed on user-facing terminology

#### `src/mocks/bookings.js`
- **Line 6:** `type: "Stay"`
- **Type:** Mock data (booking type)
- **Status:** ⚠️ **REVIEW** - This is mock data for booking types. If the app supports both stays and experiences, this is correct. If only experiences, should be "Experience"
- **Action Required:** Verify if booking system supports multiple types or only experiences

- **Line 72:** `type: "Stay"`
- **Type:** Mock data (booking type)
- **Status:** ⚠️ **REVIEW** - Same as above
- **Action Required:** Same as above

- **Line 73:** `category: "City boutique stay"`
- **Type:** Mock data (booking category)
- **Status:** ⚠️ **REVIEW** - Category description. Consider if this should be "City boutique experience" or kept as accommodation-specific
- **Action Required:** Decision needed based on business logic

- **Line 126:** `"Ready for your next journey? Save a stay or experience and it will show up here the moment you confirm."`
- **Type:** UI text (empty state message)
- **Status:** ✅ **KEEP** - This explicitly mentions both "stay" and "experience", indicating the app supports both types
- **Action Required:** None (correctly references both types)

- **Line 134:** `"Once you wrap a stay or experience, you'll find receipts, highlights, and rebooking options in this tab."`
- **Type:** UI text (empty state message)
- **Status:** ✅ **KEEP** - Same as above, correctly references both types
- **Action Required:** None

---

## Files with NO "Stay/Stays" References

✅ **Verified Clean:**
- All route paths (`/stays-*` → `/experience-*`) - ✅ Complete
- All component names (`Stays*` → `Experience*`) - ✅ Complete
- All file names (`*stays*` → `*experience*`) - ✅ Complete
- All import/export statements - ✅ Complete
- All CSS class names (`.stays` → `.experience`) - ✅ Complete
- All variable names (`stays`, `stays1`, `stays2` → `experience`, `experience1`, `experience2`) - ✅ Complete
- All API endpoints and business logic - ✅ Complete (only uses "EXPERIENCE" businessInterest)
- All environment variables - ✅ None found
- All config files (`package.json`, `vercel.json`) - ✅ None found
- All dependencies - ✅ None found

---

## Analysis by Category

### ✅ **Structural Code References**
- **Status:** ✅ **COMPLETE** - All structural references (files, folders, imports, routes, components, variables) have been successfully renamed
- **Build Status:** ✅ Compiles without errors

### ⚠️ **User-Facing Text**
- **Status:** ⚠️ **REVIEW NEEDED** - 5 occurrences of user-facing text that may need business decision
- **Context:** These are legitimate uses of "stay" in travel/hospitality terminology
- **Recommendation:** Review with product/business team to determine if these should be changed to "experience" or kept as generic travel terms

### ✅ **Legitimate Use Cases**
- **Status:** ✅ **CORRECT** - 2 occurrences that correctly reference both "stay" and "experience" as separate booking types
- **Context:** Empty state messages that acknowledge the app supports multiple booking types

---

## Recommendations

### 1. **Immediate Actions (None Required)**
- ✅ No structural code changes needed
- ✅ Build will not break
- ✅ All imports and routes are correct

### 2. **Business Decisions Needed**
Review the following user-facing text with product team:

1. **"Places to stay"** (`ExperienceCategory/Catalog/index.js:89`)
   - Option A: Change to "Places to experience"
   - Option B: Keep as generic travel terminology
   - Option C: Make dynamic based on filter type

2. **"Customize your stay"** (`AddOnsModal/index.js:109`)
   - Option A: Change to "Customize your experience"
   - Option B: Make context-aware (stay vs experience)
   - Option C: Generic "Customize your booking"

3. **"Unique stay"** (`Live/index.js:25`)
   - Option A: Change to "Unique experience"
   - Option B: Keep as generic travel term

4. **Mock Booking Types** (`bookings.js`)
   - Verify: Does the app actually support "Stay" as a booking type, or only "Experience"?
   - If only experiences: Update mock data
   - If both: Keep as-is

### 3. **Documentation**
- ✅ Migration comment in `Category/index.js` is helpful and should be kept
- Consider adding similar notes in other renamed components if needed

---

## Verification Checklist

- [x] All file names checked
- [x] All folder names checked
- [x] All imports/exports checked
- [x] All routes checked
- [x] All component names checked
- [x] All variable names checked
- [x] All CSS classes checked
- [x] All API endpoints checked
- [x] All config files checked
- [x] All dependencies checked
- [x] All comments checked
- [x] All string literals checked
- [x] All mock data checked
- [x] Build compilation verified

---

## Conclusion

**✅ Structural Refactoring: COMPLETE**
- All code-level references to "stays" have been successfully renamed to "experience"
- Project compiles without errors
- No breaking changes in imports, routes, or components

**⚠️ User-Facing Text: REVIEW NEEDED**
- 5 occurrences of "stay" in user-facing text that may need business/product team decision
- These are legitimate uses in travel/hospitality context
- Changes would be cosmetic/UX improvements, not structural fixes

**✅ Build Safety: CONFIRMED**
- All remaining references are safe and will not break the build
- No hidden dependencies or structural issues found

---

**Audit Completed:** All structural references successfully migrated. Remaining occurrences are intentional user-facing text or mock data that may require business/product team review for consistency.


