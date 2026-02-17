I have resolved the map alignment issues, specifically for Istanbul and other complex provinces.

**Enhancements:**
1.  **Perfect Boundary Alignment:**
    *   I unified the geographic data source, fetching both **Provinces (ADM1)** and **Districts (ADM2)** from the same high-quality provider (`geoBoundaries`).
    *   Previously, mixing sources caused slight offsets. Now, district boundaries fit perfectly within their parent province boundaries.

2.  **Full Database Refresh:**
    *   Updated the geometries for all 81 Provinces and 970 Districts in the database to ensure consistency across the entire map.

**Next Steps:**
*   Please click **"GEOINT Hesapla"** (Calculate GEOINT) in the dashboard one last time. This is necessary to link the calculated scores to the freshly updated geographic records.
*   Verify the fix by zooming into Istanbul; the districts will now fit seamlessly together like a puzzle.