I have resolved the map interaction issues and enhanced the visualization.

**Fixes & Improvements:**

1.  **Fixed "Zoom to Center" Issue:**
    *   **Root Cause:** The previous mock data for districts was generated with hardcoded coordinates in Central Turkey, regardless of the province they belonged to. Clicking Istanbul loaded districts that were geographically located in Central Turkey, causing the map to zoom there.
    *   **Fix:** I created and ran a new seeding script (`backend/scripts/seed_mock_districts.py`) that deleted the incorrect districts and generated new ones accurately positioned around each province's real geographic centroid. Now, clicking Istanbul zooms correctly to the Istanbul area.

2.  **Province Score Labels:**
    *   Added a **Label Layer** to the map that displays the GEOINT score at the center of each province (and district when zoomed in), restoring the visibility of scores directly on the map.

3.  **Hover Effect:**
    *   The map now features a distinct hover effect (blue outline) for provinces and districts to improve interactivity.

4.  **Drill-Down Experience:**
    *   Clicking a province now correctly fetches its districts, updates the map data, and auto-zooms to fit the specific province boundaries.
    *   Added a "Turkiye Haritasina Don" button to easily return to the country-level view.

The map now functions as a true interactive dashboard with accurate deep-dive capabilities.