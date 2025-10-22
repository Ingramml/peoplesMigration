# Lessons Learned: Mapping with GeoJSON, QGIS, and Leaflet

**Project**: Phoenix Population Movement Map
**Date**: October 2025
**Technologies**: QGIS2Web, Leaflet.js, GeoJSON, JavaScript

---

## 📊 1. GeoJSON Data Structure & Management

### Key Learnings:

#### 1.1 GeoJSON Feature Properties
**Lesson**: GeoJSON properties are the metadata backbone of your map features.

**What We Learned:**
- Properties can store ANY data: numbers, strings, URLs, emails, images
- Property names should be consistent across features
- District identifiers are critical for data aggregation and filtering

**Example from our project:**
```javascript
"properties": {
    "district": "1",           // Critical for grouping
    "rep_name": "...",         // Display information
    "rep_url": "...",          // Interactive links
    "datetime": "2025-10-21"   // Future timeline feature
}
```

**Best Practice:**
- Use consistent naming conventions (snake_case or camelCase)
- Include all metadata you might need later (easier to ignore than to add)
- Keep property names semantic and self-documenting

---

#### 1.2 Geometry Types Matter
**Lesson**: Different geometry types serve different purposes.

**Our Data Structure:**
- **Points** (Lineayer_regloc_4.js, Lineayer_Living_3.js): Individual locations
- **LineStrings** (Lineayer_23_2.js): Movement connections
- **MultiPolygon** (Fixedgeometries_1.js): District boundaries

**Challenges Faced:**
- Initially confused about which geometry type to use for arrows
- Learned that lines need decorators/markers for directionality

**Takeaway:**
- Points = Individual locations (markers)
- Lines = Connections/paths (arrows needed for direction)
- Polygons = Boundaries/areas (no fill for outlines)

---

#### 1.3 Coordinate Systems
**Lesson**: GeoJSON uses [longitude, latitude] order (NOT lat/lng like some libraries).

**Common Mistake:**
```javascript
// WRONG (Leaflet order)
[latitude, longitude]

// CORRECT (GeoJSON order)
[longitude, latitude]
```

**From our data:**
```javascript
"coordinates": [-112.150602207821365, 33.912960445358074]
//              ↑ Longitude           ↑ Latitude
```

**Takeaway:**
- Always verify coordinate order when working between systems
- GeoJSON = [lng, lat]
- Leaflet = L.latLng(lat, lng)
- Most libraries handle conversion automatically

---

## 🗺️ 2. QGIS2Web Export Process

### Key Learnings:

#### 2.1 QGIS2Web as Starting Point, Not Final Product
**Lesson**: QGIS2Web generates a functional map but requires significant customization.

**What QGIS2Web Does Well:**
- ✅ Converts QGIS layers to GeoJSON
- ✅ Sets up basic Leaflet map structure
- ✅ Creates layer organization and initial styling
- ✅ Generates popup templates
- ✅ Includes necessary libraries

**What Needs Post-Export Work:**
- ❌ Popups are generic and data-heavy
- ❌ No custom data analysis (counts, aggregations)
- ❌ Limited interactivity
- ❌ No responsive design
- ❌ Excessive code comments and unused features
- ❌ Filter sliders may not be needed

**Our Improvements:**
- Removed 160+ lines of unused filter slider code
- Redesigned all 4 popup types
- Added custom JavaScript for data aggregation
- Implemented responsive design
- Added movement pattern analysis

**Best Practice:**
- Use QGIS2Web as scaffolding, not final code
- Plan for 40-60% code modification post-export
- Budget time for cleanup and enhancement

---

#### 2.2 QGIS Layer Organization Translates to Web
**Lesson**: How you organize layers in QGIS affects the web map structure.

**What Transfers:**
- Layer names → JavaScript variable names
- Layer order → Z-index on map
- Style settings → Basic Leaflet styling
- Attribute names → GeoJSON property names

**What Doesn't Transfer:**
- Complex symbology (gradients, patterns)
- Advanced styling (data-driven styling)
- Custom expressions
- Plugin features

**Takeaway:**
- Organize QGIS layers logically before export
- Use simple, descriptive layer names
- Set basic styling in QGIS but expect to refine in code

---

#### 2.3 Data Preparation in QGIS is Critical
**Lesson**: Clean, well-structured data in QGIS saves hours of JavaScript debugging.

**Data Quality Checklist:**
- ✅ All features have consistent attribute names
- ✅ No null/undefined values in critical fields
- ✅ District identifiers are consistent (all "1" not mix of "1", 1, "District 1")
- ✅ Geometry is valid (no self-intersections, gaps)
- ✅ Coordinate system is WGS84 (EPSG:4326) for web compatibility

**Our Experience:**
- District field consistency was key for aggregation
- All 30 registration points had district: "1" (string)
- All 30 residential points had district: "2"-"8" (strings)
- No data cleaning needed post-export

**Best Practice:**
- Validate data in QGIS before export
- Use QGIS field calculator for data transformation
- Test coordinate system compatibility

---

## 🎨 3. Leaflet.js Visualization Techniques

### Key Learnings:

#### 3.1 Arrow Visualization on Lines
**Lesson**: Leaflet doesn't natively support arrows - requires external solutions.

**Approaches Tried:**

**Attempt 1: Leaflet.polylineDecorator**
```javascript
// Downloaded library - didn't render properly
L.polylineDecorator(layer, {
    patterns: [{
        symbol: L.Symbol.arrowHead({...})
    }]
})
```
**Result**: ❌ Arrows didn't appear (library compatibility issues)

**Attempt 2: SVG Markers (SUCCESS)**
```javascript
// Native SVG approach - works perfectly
var marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
marker.setAttribute('id', 'arrowhead');
// ... configuration
path.setAttribute('marker-end', 'url(#arrowhead)');
path.setAttribute('marker-mid', 'url(#arrowhead)');
```
**Result**: ✅ Visible, customizable arrows

**Key Takeaway:**
- Native browser SVG markers are more reliable than plugins
- `marker-end` places arrow at destination
- `marker-mid` places arrow at midpoint
- Both can be used together for multiple arrows per line

**Code Pattern:**
```javascript
// 1. Define SVG marker once
<svg><defs><marker id="arrowhead">...</marker></defs></svg>

// 2. Apply to each line path
layer.on('add', function() {
    var path = layer._path;
    path.setAttribute('marker-end', 'url(#arrowhead)');
});
```

**Sizing Considerations:**
- `markerWidth/markerHeight`: Overall marker viewport (we used 6x6)
- Polygon points: Actual triangle shape (we used "0 0, 6 2, 0 4")
- `refX/refY`: Reference point for positioning (5, 2)
- Scale with `markerUnits="strokeWidth"` for responsive arrows

---

#### 3.2 Z-Index and Layer Ordering
**Lesson**: Visual stacking order is critical for clarity.

**Our Layer Stack (bottom to top):**
1. Base map (Google/OSM) - z-index: 0
2. District boundaries - z-index: 401
3. Arrow lines - z-index: 402
4. Blue points (residents) - z-index: 403
5. Green points (registrations) - z-index: 404

**Why This Order:**
- Boundaries provide context (background)
- Lines connect without obscuring
- Points on top for clickability
- Green on top to show activity locations prominently

**Implementation:**
```javascript
map.createPane('pane_Lineayer_23_2');
map.getPane('pane_Lineayer_23_2').style.zIndex = 402;
```

**Lesson Learned:**
- Initially arrows appeared behind points (invisible)
- Adjusted z-index to show arrows between boundaries and points
- Use panes for precise z-index control

---

#### 3.3 Popup Design and User Experience
**Lesson**: Default popups are information dumps - redesign for clarity.

**Evolution of Our Popups:**

**QGIS2Web Default:**
```html
<table>
  <tr><th>district</th><td>1</td></tr>
  <tr><th>rep_name</th><td>Councilmember Ann O'Brien</td></tr>
  <tr><th>rep_url</th><td>https://phoenix.gov/district1</td></tr>
  <!-- 15 more rows of every property -->
</table>
```
**Problems**: Too much data, poor hierarchy, technical field names

**Our Final Design:**
```html
<div class="district-popup">
  <h3>District 1</h3>

  <div class="stat-row">
    <span>🟢 Survey Activity Points:</span> 30
    <em>Surveys completed in this district</em>
  </div>

  <div class="stat-row">
    <span>🔵 Residential Points:</span> 0
    <em>People who live in this district</em>
  </div>

  <div class="movement-insight activity-hub">
    <strong>Movement Pattern:</strong>
    Activity Destination - People come here from other districts
  </div>

  <hr>

  <div class="rep-info">
    <p>Councilmember Ann O'Brien</p>
    <a href="...">Contact Representative →</a>
  </div>
</div>
```

**Improvements:**
- ✅ Clear visual hierarchy
- ✅ Human-readable labels
- ✅ Contextual explanations
- ✅ Calculated insights (not just raw data)
- ✅ Actionable links
- ✅ Emoji/icon visual cues

**Design Principles:**
1. **Show insights, not just data** - "Activity Destination" vs raw numbers
2. **Explain what numbers mean** - "Surveys completed in this district"
3. **Use visual hierarchy** - Headers, spacing, color
4. **Make it actionable** - Links to representatives
5. **Keep it concise** - Most important info first

---

#### 3.4 Responsive Design Considerations
**Lesson**: Maps need special responsive treatment.

**Challenges:**
- Popups overflow on mobile
- Legend overlaps content
- Layer control too large
- Touch targets too small

**Our Solutions:**
```css
/* Viewport-based map sizing */
#map {
    height: 100vh;
    width: 100%;
}

/* Mobile-specific popup adjustments */
@media (max-width: 768px) {
    .leaflet-popup-content {
        max-width: 280px;
        font-size: 0.9em;
    }

    .leaflet-control-layers {
        max-width: 90vw;
    }
}
```

**Best Practices:**
- Use vh/vw units for full-screen maps
- Collapse layer controls on mobile
- Limit popup width on small screens
- Increase touch target size (min 44x44px)

---

## 💡 4. Data Aggregation and Analysis

### Key Learnings:

#### 4.1 Client-Side Data Processing
**Lesson**: You can do powerful analysis in the browser without a backend.

**Our Implementation:**
```javascript
// Count features by district
window.countByDistrict = function(geojsonData) {
    var counts = {};
    geojsonData.features.forEach(function(feature) {
        var district = feature.properties.district;
        counts[district] = (counts[district] || 0) + 1;
    });
    return counts;
};

// Results:
// registrationCounts: {1: 30}
// residentCounts: {2: 12, 3: 1, 4: 1, 5: 6, 6: 5, 7: 2, 8: 3}
```

**Insights Generated:**
- District 1: 30 activities, 0 residents → "Activity Hub"
- District 2: 0 activities, 12 residents → "Residential Area"
- Movement patterns: All arrows point FROM District 1 TO others

**Benefits:**
- No server required
- Instant updates
- Works offline
- Simple implementation

**Limitations:**
- Performance degrades with 10,000+ features
- No persistent storage (unless using localStorage)
- All data loaded upfront

**When to Use:**
- Small to medium datasets (< 5,000 features)
- Public data (no security concerns)
- Static analysis (not real-time updates)

---

#### 4.2 Timing Issues with Data Loading
**Lesson**: Data must be loaded BEFORE you try to use it.

**Problem We Faced:**
```javascript
// Popups created during layer initialization (line 580)
var registrations = window.getRegistrationCount(district);
// Returns 0 because data not counted yet!

// Data counted later (line 775)
window.initializeCounts();
```

**Solution - Early Initialization:**
```javascript
// Load order:
// 1. Data files (line 348-350)
// 2. app.js (line 351)
// 3. IMMEDIATELY initialize (line 353-362)
window.initializeCounts();
// 4. THEN create layers (line 580+)
```

**Best Practice:**
1. Load data files
2. Load analysis scripts
3. Run analysis/aggregation
4. Create map layers
5. Add to map

**Debugging Tips:**
- Use `console.log()` to verify load order
- Check variable values at creation time
- Ensure functions exist before calling
- Use `window.` prefix for global scope

---

#### 4.3 Movement Pattern Analysis
**Lesson**: Derived insights are more valuable than raw data.

**Raw Data:**
- 30 points in District 1
- 30 points in Districts 2-8
- 30 lines connecting them

**Derived Insights:**
- **Population Movement Pattern**: People live in outer districts but travel to District 1 for activities
- **Activity Centralization**: District 1 is a hub (work/shopping/services)
- **Residential Dispersion**: People spread across 7 districts
- **Commute Analysis**: All movement arrows point inward

**How We Calculated:**
```javascript
if (activityPoints > 0 && residentialPoints === 0) {
    return 'Activity Destination - People come here from other districts';
} else if (residentialPoints > 0 && activityPoints === 0) {
    return 'Residential Area - Residents travel to other districts';
}
```

**Value Add:**
- Tells a story beyond numbers
- Actionable for urban planning
- Easy to understand for non-technical users
- Drives decision-making

---

## 🔧 5. Technical Problem-Solving

### Key Learnings:

#### 5.1 Debugging Strategy
**Lesson**: Systematic debugging beats trial-and-error.

**Our Process:**
1. **Identify symptom**: "Arrows not showing"
2. **Check library**: Is L.polylineDecorator defined?
3. **Check creation**: Is arrowDecorator object created?
4. **Check rendering**: Are SVG elements in DOM?
5. **Test alternative**: Try native SVG approach
6. **Verify solution**: Visual confirmation + code review

**Key Debugging Tools Used:**
- `console.log()` for variable inspection
- Browser Inspector for DOM examination
- `typeof` checks for function availability
- Network tab for library loading verification

**Best Practices:**
- Test one change at a time
- Keep a working backup
- Document what worked/didn't work
- Use version control (git) for easy rollback

---

#### 5.2 Library Compatibility
**Lesson**: Not all Leaflet plugins work as expected.

**What We Learned:**
- Leaflet.polylineDecorator downloaded but didn't render
- Version compatibility matters
- Native browser features (SVG) often more reliable
- Check plugin last update date and issue tracker

**Decision Framework:**
```
Need arrow decorations:
├─ Try Plugin (L.polylineDecorator)
│  ├─ If works → Great!
│  └─ If fails → Native SVG
├─ Native SVG Markers
│  ├─ More code but reliable
│  └─ Full control over appearance
└─ Fallback: CSS arrows or icon markers
```

**Takeaway:**
- Start with plugins for speed
- Have native fallback ready
- Prefer maintained, popular plugins
- Test thoroughly before committing

---

#### 5.3 Performance Optimization
**Lesson**: Even small datasets benefit from optimization.

**What We Optimized:**

**1. Data Loading:**
```javascript
// DON'T process data on every popup open
layer.on('click', function() {
    var count = processAllFeatures(); // ❌ Recalculates every time
});

// DO process once at initialization
window.initializeCounts(); // ✅ Calculate once
layer.on('click', function() {
    var count = window.getCount(district); // Fast lookup
});
```

**2. CSS Performance:**
```css
/* Use GPU-accelerated properties */
transform: translate3d(0,0,0);
will-change: transform;

/* Avoid expensive properties in animations */
/* ❌ */ box-shadow: 0 0 10px rgba(0,0,0,0.5);
/* ✅ */ opacity: 0.8;
```

**3. Script Loading:**
```html
<!-- Defer non-critical scripts -->
<script defer src="non-critical.js"></script>

<!-- Critical scripts load synchronously -->
<script src="leaflet.js"></script>
<script src="data.js"></script>
```

**Results:**
- Fast initial load (< 2 seconds)
- Smooth interactions
- No lag on popup open
- Responsive on mobile

---

## 📈 6. Data Storytelling

### Key Learnings:

#### 6.1 Visual Communication
**Lesson**: Color, size, and symbols communicate instantly.

**Our Symbol System:**
- 🟢 **Green** = Activity/Survey locations
- 🔵 **Blue** = Residential/Home locations
- ⬛ **Black arrows** = Direction of travel
- ⬜ **Gray outlines** = Administrative boundaries

**Why These Choices:**
- **Green**: Associated with "go", action, activity
- **Blue**: Associated with home, stability, residence
- **Black arrows**: High contrast, clear direction
- **Gray boundaries**: Neutral, non-distracting context

**Alternative Approaches Considered:**
- Red/Blue (too political)
- Origin/Destination colors (confusing)
- Gradient by volume (overkill for binary data)

**Lesson**: Keep symbology simple and culturally neutral.

---

#### 6.2 Narrative Structure in Popups
**Lesson**: Popups should tell a story, not dump data.

**Story Arc:**
1. **What** (District identification)
2. **Data** (Counts with context)
3. **Insight** (What it means)
4. **Action** (Contact representative)

**Example - District 1 Popup:**
```
District 1                          ← WHAT
🟢 30 Survey Activity Points        ← DATA
🔵 0 Residential Points             ← DATA

Movement Pattern:                   ← INSIGHT
Activity Destination - People come
here from other districts

Councilmember Ann O'Brien          ← ACTION
Contact Representative →
```

**Contrast with Original:**
```
district: 1
id_0: 2
id: 2
objectid: 650
rep_name: Councilmember Ann O'Brien
rep_url: https://phoenix.gov/district1
[... 10 more technical fields ...]
```

**Takeaway**: Transform data into narrative.

---

#### 6.3 Movement Visualization
**Lesson**: Direction matters as much as connection.

**Why Arrows Changed Everything:**

**Without Arrows (just lines):**
- Lines show connection
- No sense of direction
- Ambiguous relationship
- Could mean anything

**With Arrows:**
- Clear directionality
- Story of movement
- Cause and effect visible
- Commute pattern obvious

**Implementation Details:**
- Arrow at END = destination (where people go TO)
- Arrow at MID = reinforces direction along path
- Multiple arrows = emphasizes movement concept

**Future Enhancement:**
- Arrow size based on volume
- Animated arrows showing flow
- Pulsing to show active movement

---

## 🚀 7. Future Enhancements & Scalability

### Key Learnings:

#### 7.1 Timeline Animation Feasibility
**Lesson**: Adding temporal dimension is straightforward but requires planning.

**Requirements Identified:**
1. Add `datetime` field to all features
2. Include Leaflet.TimeDimension library
3. Create timeline control UI
4. Implement progressive reveal logic

**Estimated Effort:**
- Data preparation: 2-4 hours
- UI implementation: 4-6 hours
- Animation logic: 6-8 hours
- Testing: 4-6 hours
**Total: 18-27 hours**

**Key Dependencies:**
- Datetime data collection
- Library integration
- Animation performance testing

**Takeaway**: Plan for temporal features from the start by including timestamp fields.

---

#### 7.2 Scalability Considerations
**Lesson**: Current approach works for hundreds of features, not thousands.

**Performance Thresholds:**
- ✅ < 100 features: No optimization needed
- ⚠️ 100-1,000 features: Consider clustering
- ❌ > 1,000 features: Requires optimization

**Our Dataset:**
- 30 registration points
- 30 residential points
- 30 connection lines
- 8 district polygons
**Total: 98 features** ✅

**Optimization Techniques for Scale:**
1. **Marker Clustering** (Leaflet.markercluster)
2. **Canvas Rendering** (Leaflet.canvas)
3. **Viewport Loading** (only load visible features)
4. **Server-Side Tiling** (Vector tiles)
5. **Data Aggregation** (summarize dense areas)

**When to Optimize:**
- Map loads slowly (> 3 seconds)
- Panning/zooming is laggy
- Mobile devices struggle
- Dataset growing over time

---

#### 7.3 Integration Possibilities
**Lesson**: Web maps can integrate with many services.

**Potential Integrations:**

**Data Sources:**
- Real-time APIs (live traffic, weather)
- Database connections (PostGIS)
- External GeoJSON endpoints
- CSV/Excel imports

**Services:**
- Geocoding (address lookup)
- Routing (navigation)
- Search (location finder)
- Analytics (Google Analytics)

**Export:**
- Print maps (Leaflet.EasyPrint)
- Share links (URL parameters)
- Embed code (iframe)
- Image export (html2canvas)

**Our Project Potential:**
- Connect to real-time survey database
- Live updates of new responses
- Historical comparison slider
- Export reports as PDF

---

## 📝 8. Documentation Best Practices

### Key Learnings:

#### 8.1 In-Code Documentation
**Lesson**: Future you will thank you for clear comments.

**What to Document:**
```javascript
// ✅ GOOD - Explains WHY
// Shorten lines to 85% to show arrow heads before blue dots
var json_Lineayer_23_2_shortened = processArrowLines(data, 0.85);

// ❌ BAD - States obvious
// Create variable
var data = processArrowLines();

// ✅ GOOD - Documents decision
// Use SVG markers instead of L.polylineDecorator due to compatibility issues
var marker = document.createElementNS(...);

// ❌ BAD - No context
// Create marker
var marker = document.createElementNS(...);
```

**Comment Types We Used:**
1. **Section headers**: `// === STEP 1: DATA LOADING ===`
2. **Decision rationale**: `// Using native SVG because plugin failed`
3. **Debugging aids**: `console.log('Early initialization complete')`
4. **TODO markers**: `// TODO: Add timeline animation`

---

#### 8.2 External Documentation
**Lesson**: Separate docs serve different audiences.

**Our Documentation Strategy:**

| Document | Audience | Purpose |
|----------|----------|---------|
| README.md | Users, Stakeholders | Overview, features, usage |
| IMPLEMENTATION_SUMMARY.md | Developers | Technical changes made |
| DATA_RELATIONSHIPS.md | Analysts | Data structure, relationships |
| TIMELINE_ANIMATION_PLAN.md | Product Team | Future feature planning |
| LESSONS_LEARNED.md (this doc) | Developers | Technical knowledge transfer |
| GITHUB_SETUP.md | DevOps | Deployment instructions |

**Why Multiple Docs:**
- Different readers need different information
- Easier to maintain focused documents
- Better searchability
- Clear purpose for each file

---

#### 8.3 Version Control Messages
**Lesson**: Commit messages should tell the story of development.

**Our Commit Message Format:**
```bash
git commit -m "Add SVG arrow markers to movement lines

- Replace L.polylineDecorator with native SVG markers
- Arrows now visible at line endpoints and midpoints
- Configurable size via markerWidth/markerHeight attributes
- Fixes issue where arrows weren't rendering"
```

**Structure:**
1. **Subject**: What changed (50 chars max)
2. **Blank line**
3. **Body**: Why it changed and how
4. **Optional**: Issue references, breaking changes

**Good Examples:**
- "Fix popup timing issue by moving initializeCounts() earlier"
- "Update popup labels from technical to user-friendly language"
- "Reduce arrow size by 60% per user feedback"

---

## 🎯 9. Key Takeaways Summary

### Top 10 Lessons:

1. **QGIS2Web is a starting point** - Expect to rewrite 40-60% of generated code
2. **Data quality in QGIS saves debugging time** - Validate before export
3. **Native browser features > plugins** - SVG markers more reliable than decorators
4. **Load order matters** - Initialize data before creating features
5. **Insights > Raw data** - Show "Activity Hub" not "30 vs 0"
6. **Responsive design is essential** - Mobile usage is significant
7. **Visual hierarchy improves UX** - Redesign default popups
8. **Performance optimization early** - Process data once, use many times
9. **Document decisions** - Why matters more than what
10. **Plan for scale** - Consider future growth from day one

---

## 🔮 10. Recommendations for Next Mapping Project

### Do From The Start:

**Data Preparation:**
- [ ] Include datetime fields in all features (even if unused initially)
- [ ] Validate data types and consistency in QGIS
- [ ] Use semantic property names (not technical)
- [ ] Plan for future data additions

**Architecture:**
- [ ] Set up custom app.js from beginning
- [ ] Create data aggregation functions early
- [ ] Use window namespace for global functions
- [ ] Implement proper load order

**UI/UX:**
- [ ] Design custom popups before coding
- [ ] Plan responsive breakpoints
- [ ] Choose color scheme intentionally
- [ ] Test on mobile devices early

**Documentation:**
- [ ] Create README.md immediately
- [ ] Document data structure
- [ ] Write clear commit messages
- [ ] Plan documentation strategy

**Version Control:**
- [ ] Initialize git before making changes
- [ ] Create .gitignore for system files
- [ ] Commit frequently with clear messages
- [ ] Tag major milestones

---

## 🛠️ Tools & Resources

### Essential Tools:
- **QGIS** - Desktop GIS for data preparation
- **QGIS2Web** - Export plugin for Leaflet
- **Leaflet.js** - Web mapping library
- **Browser DevTools** - Debugging and inspection
- **Git** - Version control
- **VS Code** - Code editor with extensions

### Helpful Resources:
- Leaflet documentation: https://leafletjs.com/reference.html
- GeoJSON specification: https://geojson.org/
- QGIS2Web guide: https://github.com/tomchadwin/qgis2web
- Leaflet plugins: https://leafletjs.com/plugins.html
- SVG markers: https://developer.mozilla.org/en-US/docs/Web/SVG/Element/marker

### Learning Path:
1. **Beginner**: QGIS basics → QGIS2Web export → Minor customizations
2. **Intermediate**: Leaflet documentation → Custom popups → Data analysis
3. **Advanced**: Custom plugins → Animation → Backend integration

---

## 💭 Reflections

### What Went Well:
- ✅ Clear problem definition (show movement patterns)
- ✅ Good data quality from QGIS
- ✅ Systematic debugging approach
- ✅ User-focused improvements
- ✅ Comprehensive documentation

### What Could Be Improved:
- ⚠️ Earlier responsive design consideration
- ⚠️ More upfront planning for arrow visualization
- ⚠️ Could have tested multiple devices sooner
- ⚠️ Version control from the very beginning

### Unexpected Challenges:
- Arrow rendering issues (plugin incompatibility)
- Timing of data initialization
- Need for multiple popup redesign iterations
- Balance between detail and simplicity

### Unexpected Successes:
- SVG marker approach working perfectly
- Client-side data analysis performance
- User engagement with movement insights
- Responsive design implementation

---

## 📊 Project Metrics

**Code Statistics:**
- Lines of JavaScript: ~800
- Lines of CSS: ~280
- GeoJSON features: 98
- External libraries: 15
- Custom functions: 8

**Time Investment:**
- Initial QGIS2Web export: 1 hour
- Code cleanup: 3 hours
- Custom features: 6 hours
- Arrow implementation: 4 hours
- Responsive design: 2 hours
- Documentation: 3 hours
**Total: ~19 hours**

**Performance:**
- Page load time: < 2 seconds
- Time to interactive: < 3 seconds
- Mobile performance: Smooth
- Dataset size: 327.7KB (boundary polygons)

---

**Tags**: #mapping #geojson #qgis #leaflet #lessons-learned #gis #web-mapping #data-visualization

**Document Purpose**: Knowledge transfer and reference for future mapping projects

**Maintenance**: Update this document when new mapping insights are discovered
