# Data Relationships & Arrow Symbology

## Map Layers Overview

### 1. **Fixedgeometries_1.js** - District Boundaries
- **Geometry Type**: MultiPolygon
- **Visual Style**: Dark gray outlines (rgba(35,35,35,1.0)), 2px weight, no fill
- **Purpose**: Shows the 8 Phoenix City Council District boundaries
- **Interactive**: Yes - clicking shows district popup with movement statistics

### 2. **Lineayer_regloc_4.js** - Survey Activity Locations (GREEN DOTS)
- **Geometry Type**: Point
- **Count**: 30 points
- **District Distribution**: ALL 30 points are in District 1
- **Represents**: Where people were when they completed surveys
- **Visual**: Green markers
- **Interpretation**: Activity/survey locations

### 3. **Lineayer_Living_3.js** - Residential Locations (BLUE DOTS)
- **Geometry Type**: Point
- **Count**: 30 points
- **District Distribution**:
  - District 2: 12 residents
  - District 3: 1 resident
  - District 4: 1 resident
  - District 5: 6 residents
  - District 6: 5 residents
  - District 7: 2 residents
  - District 8: 3 residents
- **Represents**: Where people actually live (home addresses)
- **Visual**: Blue markers
- **Interpretation**: Residential/living locations

### 4. **Lineayer_23_2.js** - Movement Arrows (ORANGE ARROWS)
- **Geometry Type**: LineString
- **Count**: 30 lines (one per person)
- **Properties**:
  - `from_district`: Always "1" (where survey was completed)
  - `to_district`: "2" through "8" (where person lives)
  - `count`: Number of people following that path
- **Visual Style**:
  - Color: Orange (#ff6b35)
  - Weight: 2px (thin lines)
  - Opacity: 0.8
  - Arrow head at 100% offset (points to destination)
- **Direction**: FROM survey location (green) TO home location (blue)
- **Arrow Head**: Points to the living location (blue dot)

## Data Relationship Summary

```
Person completes survey in District 1 (GREEN DOT - activity location)
                    ↓
          Lives in Districts 2-8 (BLUE DOT - residential location)
                    ↓
        Arrow shows this movement pattern (ORANGE ARROW)
                    ↓
     Arrow head points TO where person lives (blue dot)
```

## Example Data Flow

**Example Person #1:**
- Survey Location: [-112.069825288877993, 33.767370099125998] (District 1 - GREEN)
- Home Location: [-112.20334122717, 33.751477362534601] (District 2 - BLUE)
- Arrow: Starts at survey location, ends at home location
- Arrow Head: Points to blue dot (home)

## Arrow Symbology Explanation

The arrow symbology is configured as follows:

```javascript
// Arrow decorator configuration
var arrowDecorator = L.polylineDecorator(layer_Lineayer_23_2, {
    patterns: [
        {
            offset: '100%',      // Arrow positioned at END of line
            repeat: 0,           // One arrow per line (at the end)
            symbol: L.Symbol.arrowHead({
                pixelSize: 12,   // 12 pixel arrow head
                polygon: false,  // Open arrow (not filled)
                pathOptions: {
                    stroke: true,
                    weight: 2,
                    color: '#ff6b35',  // Orange color
                    opacity: 0.8
                }
            })
        }
    ]
});
```

### Why Arrow Head Points to Blue Dots:

The `offset: '100%'` parameter means the arrow head is placed at the **end** of each line. Since the line geometry is structured as:

```javascript
"coordinates": [
  [start_longitude, start_latitude],  // FROM: Survey location (green dot)
  [end_longitude, end_latitude]       // TO: Home location (blue dot)
]
```

The arrow head naturally points to the **destination** (home/residential location - blue dots).

## Movement Pattern Interpretation

### What the Map Shows:

1. **Green Dots (District 1)**: Where 30 people completed surveys
2. **Blue Dots (Districts 2-8)**: Where those same 30 people actually live
3. **Orange Arrows**: The journey/commute from home to survey location

### Key Insight:

**District 1 is an Activity Hub** - People from surrounding districts (2-8) traveled to District 1 to complete surveys, indicating District 1 may be:
- A commercial/business district
- A community center location
- A transportation hub
- An employment center

**Districts 2-8 are Residential** - People live in these districts but traveled to District 1 for activities.

## Popup Information

When clicking on a district boundary, the popup shows:

### District 1 (Activity Hub):
```
Survey Activity Points: 30
  ↳ Surveys completed in this district

Residential Points: 0
  ↳ People who live in this district

Movement Pattern:
  Activity Destination - People come here from other districts to complete surveys
```

### District 2 (Residential):
```
Survey Activity Points: 0
  ↳ Surveys completed in this district

Residential Points: 12
  ↳ People who live in this district

Movement Pattern:
  Residential Area - Residents travel to other districts for activities
```

## Visual Summary

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  District 1 (Activity Hub)                         │
│  ┌──────────────────┐                              │
│  │  30 GREEN DOTS   │ ← Where surveys completed    │
│  │  0 BLUE DOTS     │                              │
│  └──────────────────┘                              │
│         ↑ ↑ ↑ ↑ ↑ ↑                                │
│         │ │ │ │ │ │ ORANGE ARROWS                  │
│         │ │ │ │ │ │ (point to blue dots)           │
│         │ │ │ │ │ │                                │
│  ┌──────┴─┴─┴─┴─┴─┴───────┐                       │
│  │ Districts 2-8           │                       │
│  │ (Residential Areas)     │                       │
│  │  0 GREEN DOTS           │                       │
│  │  30 BLUE DOTS ●●●●●●   │ ← Where people live   │
│  └─────────────────────────┘                       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Technical Notes

- **Arrow Direction**: FROM green TO blue (survey location → home location)
- **Arrow Head**: Points at blue dot (home/residential location)
- **Line Color**: Orange (#ff6b35) for contrast against blue dots
- **Line Weight**: 2 pixels (thin, clean appearance)
- **Arrow Size**: 12 pixels (visible but not overwhelming)

This configuration clearly shows population movement patterns between activity locations and residential locations across Phoenix City Council Districts.
