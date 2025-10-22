# Timeline Animation Feature - Implementation Plan

## Overview
This document outlines the plan for adding a timeline animation feature to the Phoenix City Council Districts Population Movement Map. This feature will allow users to visualize movement patterns over time if datetime data is added to the survey responses.

## Current Data Structure Analysis

### Existing Fields in Data Files:
- **Lineayer_regloc_4.js** (Survey Activity Points):
  - shapeid, partid, x, y, fid, rand_point_id
  - id_0, id, objectid, district
  - rep_name, rep_url, email, image_url
  - c_tract, latitude, longitude, line, Point-1, Point-1a

- **Lineayer_Living_3.js** (Residential Points):
  - shapeid, partid, x, y, id, longitude, latitude
  - fid, id_0, id_2, objectid, district
  - rep_name, rep_url, email, image_url, c_tract

### Required New Field:
- **datetime** or **timestamp** - ISO 8601 format (e.g., "2025-10-21T14:30:00Z")
- Alternative: **date** and **time** as separate fields

## Feature Design

### 1. Timeline Control Interface

#### Location: Bottom of map (horizontal bar)
#### Components:
```
┌─────────────────────────────────────────────────────────────┐
│  [◄] [Play/Pause] [►]   ●────────○──────────────── 100%    │
│  Oct 1, 2025 14:30                          Speed: [1x ▼]   │
└─────────────────────────────────────────────────────────────┘
```

**Elements:**
- **Skip Backward**: Jump to previous time marker
- **Play/Pause Button**: Toggle animation
- **Skip Forward**: Jump to next time marker
- **Timeline Slider**: Drag to any point in time
- **Current Date/Time Display**: Shows current position
- **Speed Selector**: 0.5x, 1x, 2x, 5x, 10x speeds
- **Progress Indicator**: Shows percentage complete

### 2. Animation Behavior

#### Progressive Reveal Mode:
- Start with empty map
- As time progresses, points appear when their timestamp is reached
- Arrows draw from survey location to home location
- Earlier points remain visible but fade slightly (opacity decrease)
- Most recent points highlighted

#### Playback Options:
1. **Sequential Mode**: Play chronologically
2. **Cluster Mode**: Group by hour/day/week
3. **Heatmap Mode**: Show density over time periods

### 3. Visual Enhancements

#### Point Appearance Animation:
```javascript
- Fade in with pulse effect (0.3s)
- Scale from 0.5 to 1.0
- Glow effect for newest points
```

#### Arrow Drawing Animation:
```javascript
- Draw from origin to destination (1s)
- Use SVG stroke-dasharray animation
- Synchronized with point appearance
```

#### Historical Points Styling:
- Reduce opacity: 1.0 → 0.4 over time
- Smaller size: 100% → 80%
- Desaturate colors slightly

### 4. Data Format Requirements

#### Option A: Add datetime to existing JSON

**Lineayer_regloc_4.js** example:
```javascript
{
  "type": "Feature",
  "properties": {
    "shapeid": "0",
    "district": "1",
    "datetime": "2025-10-21T14:30:00Z",  // NEW FIELD
    // ... existing fields
  },
  "geometry": { ... }
}
```

**Lineayer_Living_3.js** - Same format

#### Option B: Separate timestamp mapping file

**timestamps.js**:
```javascript
var surveyTimestamps = {
  "0": "2025-10-21T14:30:00Z",  // shapeid: datetime
  "1": "2025-10-21T14:35:00Z",
  // ...
};

var residentialTimestamps = {
  "0": "2025-10-21T14:30:00Z",
  // ...
};
```

### 5. Implementation Steps

#### Phase 1: Data Preparation
1. ✅ Define datetime field structure
2. Add sample datetime data to test files
3. Create datetime parsing utilities
4. Validate all timestamps

#### Phase 2: Timeline UI Component
1. Create timeline control HTML/CSS
2. Add Leaflet control for timeline placement
3. Implement slider functionality
4. Add play/pause controls
5. Add speed controls

#### Phase 3: Animation Engine
1. Sort all features by timestamp
2. Create animation queue
3. Implement requestAnimationFrame loop
4. Add point appearance logic
5. Add arrow drawing animation
6. Manage layer visibility based on time

#### Phase 4: Integration
1. Connect UI controls to animation engine
2. Add keyboard shortcuts (spacebar = play/pause, arrow keys = skip)
3. Sync popup data with timeline
4. Update legend with time context
5. Add export/share functionality (with timestamp)

#### Phase 5: Performance Optimization
1. Implement feature clustering for large datasets
2. Use canvas rendering for better performance
3. Add lazy loading for long time ranges
4. Optimize animation frame rate

### 6. Technical Implementation Details

#### Libraries Needed:
- **Leaflet.TimeDimension** - Timeline control for Leaflet
  - URL: https://github.com/socib/Leaflet.TimeDimension
  - CDN: https://cdn.jsdelivr.net/npm/leaflet-timedimension@1.1.1/dist/leaflet.timedimension.min.js
  - CSS: https://cdn.jsdelivr.net/npm/leaflet-timedimension@1.1.1/dist/leaflet.timedimension.control.min.css

#### Code Structure:
```javascript
// js/timeline.js

window.TimelineManager = {
  currentTime: null,
  startTime: null,
  endTime: null,
  isPlaying: false,
  speed: 1.0,

  init: function() { ... },
  play: function() { ... },
  pause: function() { ... },
  setTime: function(timestamp) { ... },
  updateVisibleFeatures: function() { ... },
  animateArrow: function(from, to) { ... }
};
```

#### Timeline Slider Implementation:
```javascript
var timeControl = L.control.timeDimension({
  position: 'bottomleft',
  autoPlay: false,
  playerOptions: {
    loop: true,
    transitionTime: 1000,
    buffer: 5
  }
});
```

### 7. User Interface Mockup

#### Collapsed State (Default):
```
┌──────────────────────┐
│ [▶] Timeline         │
└──────────────────────┘
```

#### Expanded State (Active):
```
┌─────────────────────────────────────────────────────────────────────┐
│  Timeline Animation                                      [Collapse]  │
├─────────────────────────────────────────────────────────────────────┤
│  [◄◄] [◄] [▶] [►] [■]   ●─────────○──────────────────── Oct 21     │
│                                                                       │
│  Current: Oct 21, 2025 14:30 | Total: 30 events | Showing: 12      │
│                                                                       │
│  Speed: [0.5x] [1x] [2x] [5x]  |  Mode: [Sequential ▼]             │
└─────────────────────────────────────────────────────────────────────┘
```

### 8. Example Use Cases

#### Use Case 1: Daily Commute Pattern
- **Scenario**: Surveys collected from 6 AM to 8 PM
- **Animation**: Shows morning cluster in District 1 (work), evening scatter to residential districts
- **Insight**: Visualize work-to-home movement patterns

#### Use Case 2: Event-Based Survey
- **Scenario**: Survey at community event
- **Animation**: Show arrival times and where attendees came from
- **Insight**: Understand event draw radius and timing

#### Use Case 3: Multi-Day Campaign
- **Scenario**: Week-long survey campaign
- **Animation**: Day-by-day progression of responses
- **Insight**: Track geographic coverage over time

### 9. Advanced Features (Future Enhancement)

#### Feature Ideas:
1. **Heatmap Over Time**: Density visualization that updates
2. **Path Trails**: Show individual journeys from home to survey location
3. **Statistics Panel**: Live-updating counts by district
4. **Comparison Mode**: Side-by-side comparison of different time periods
5. **Export Animation**: Generate GIF or video of timeline playback
6. **Time Filters**: Show only specific days/hours
7. **Velocity Indicators**: Arrows speed indicates time between survey and residence data
8. **Audio Cues**: Optional sound for each point appearance

### 10. Data Requirements Summary

#### Minimum Required:
- **datetime** field in both GeoJSON files
- ISO 8601 format: "YYYY-MM-DDTHH:mm:ssZ"

#### Recommended Additional Fields:
- **duration** - How long survey took
- **method** - Survey method (online, in-person, phone)
- **sequence** - Order within a session

#### Example Enhanced Record:
```javascript
{
  "type": "Feature",
  "properties": {
    "shapeid": "0",
    "district": "1",
    "datetime": "2025-10-21T14:30:00Z",
    "duration": 180,  // seconds
    "method": "in-person",
    "sequence": 1,
    // ... other fields
  },
  "geometry": { ... }
}
```

### 11. Testing Plan

#### Test Scenarios:
1. Single day, few points (10-20)
2. Single day, many points (100+)
3. Multiple days (week)
4. Multiple weeks (month)
5. Sparse data (few points per day)
6. Dense data (many points per hour)

#### Performance Benchmarks:
- Animation should run at 60 FPS for <1000 points
- Timeline should load in <2 seconds
- Slider should be responsive (<100ms lag)

### 12. Implementation Estimate

#### Time Estimates:
- **Data preparation**: 2-4 hours
- **Timeline UI**: 4-6 hours
- **Animation engine**: 6-8 hours
- **Integration & testing**: 4-6 hours
- **Documentation**: 2-3 hours

**Total: 18-27 hours**

#### Difficulty Level: **Medium-High**
- Requires: JavaScript animation, Leaflet plugins, temporal data handling
- Complexity: Synchronizing multiple layers with time dimension

## 13. Getting Started

### Step 1: Add Sample Datetime Data
Modify your data files to include datetime field:

```javascript
// In Lineayer_regloc_4.js, add to each feature:
"datetime": "2025-10-21T14:30:00Z"

// In Lineayer_Living_3.js, add to each feature:
"datetime": "2025-10-21T14:30:00Z"
```

### Step 2: Test with Simple Implementation
Create basic timeline that just filters by date before adding animation.

### Step 3: Iterate
Add animation features incrementally.

## Conclusion

**YES, timeline animation is absolutely possible!** The implementation is straightforward with Leaflet.TimeDimension plugin. The key requirements are:

1. ✅ Add datetime field to your data
2. ✅ Include timeline library
3. ✅ Create timeline control UI
4. ✅ Implement progressive feature reveal
5. ✅ Add arrow drawing animation

The feature will provide powerful insights into population movement patterns over time and make your map significantly more engaging and informative.
