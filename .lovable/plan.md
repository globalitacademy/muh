
## Redesign Topics as Cards

**Current state:** Topics are displayed as a vertical list of collapsible rows with a left blue border, showing content in an expandable panel below each row.

**Goal:** Redesign topics to match the card-grid style used for Specialties and Modules — each topic is a standalone card in a responsive grid, with expanded details shown directly on the card body.

---

### What changes

**File:** `src/components/admin/AdminSpecialtiesTab.tsx` — the `TopicsView` component (lines ~394–495).

**Layout change:**

Replace the collapsible list (`space-y-2` + `Collapsible`) with a `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4` — matching the Specialties and Modules grids.

**Each topic card will contain:**

1. **Top row:** Index number + lock/unlock icon + topic title (bold)
2. **Second row (below title):** Free/Paid badge + duration chip — this satisfies the "buttons 2 lines after title" requirement already in place
3. **Content section (always visible on the card):**
   - Description (if present)
   - Video link (if present)
   - Content preview via `TopicContentPreview` (if present)
   - Small indicator chips for Exercises, Quiz, Resources
4. **Bottom action row:** Edit + Delete buttons (full-width, side by side) — with `stopPropagation` so they don't interfere

**Remove:** The `Collapsible` / `CollapsibleTrigger` / `CollapsibleContent` / `expandedTopics` state — the card itself displays all relevant info directly, no expand/collapse needed.

**Header section** (buttons row + title): Keep as-is — UpdateTopicContentButton + "New topic" button remain above the title.

---

### Technical details

- Remove `expandedTopics` state and `toggleTopic` function (no longer needed)
- Remove `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent` usage from `TopicsView`
- Change the container from `space-y-2` to `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`
- Each card uses `CardHeader` for the title area and `CardContent` for details + actions
- Keep `border-l-4 border-l-primary` or replace with a top accent border for card style — will use `border-t-4 border-t-primary` to match a card-native feel
- All Armenian text Unicode escapes remain unchanged
