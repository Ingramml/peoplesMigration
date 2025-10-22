# Population Movement Map - Phoenix City Council Districts

An interactive web map visualizing population movement patterns across Phoenix City Council Districts, showing the relationship between survey activity locations and residential locations.

## 🗺️ Live Demo

[View Live Map](https://ingramml.github.io/peoplesMigration/)

## 📊 Overview

This project visualizes population movement by mapping:
- **Survey Activity Locations** (Green markers) - Where people completed surveys
- **Residential Locations** (Blue markers) - Where people actually live
- **Movement Arrows** (Black arrows) - Direction of travel from activity to home
- **District Boundaries** - Phoenix City Council Districts (1-8)

## 🔍 Key Findings

- **District 1**: Activity Hub - 30 surveys completed, 0 residents (people travel here for activities)
- **Districts 2-8**: Residential Areas - People live here but completed surveys in District 1

## 🚀 Features

- **Interactive Map**: Click on districts to see detailed statistics
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Layer Control**: Toggle visibility of different map layers
- **Movement Visualization**: Black arrows with triangular heads show direction of movement
- **Detailed Popups**: Each district shows:
  - Survey activity points count
  - Residential points count
  - Movement pattern analysis
  - District representative information

## 📁 Project Structure

```
.
├── index.html              # Main application file
├── css/
│   └── (Leaflet CSS files)
├── js/
│   ├── app.js             # Custom application logic
│   ├── leaflet.js         # Leaflet mapping library
│   └── (other libraries)
├── data/
│   ├── Fixedgeometries_1.js    # District boundary polygons
│   ├── Lineayer_23_2.js        # Movement lines
│   ├── Lineayer_Living_3.js    # Residential point data (blue)
│   └── Lineayer_regloc_4.js    # Survey location data (green)
└── images/
    └── (marker icons)
```

## 🛠️ Technologies Used

- **Leaflet.js** - Interactive mapping library
- **GeoJSON** - Geographic data format
- **OpenStreetMap** - Base map tiles
- **Google Maps** - Alternative base map
- **SVG Markers** - Custom arrow heads for movement visualization

## 📈 Data Sources

- Survey activity locations: 30 points in District 1
- Residential locations: 30 points across Districts 2-8
- District boundaries: Phoenix City Council Districts
- Movement connections: Derived from matching survey and residential data

## 🎨 Map Legend

| Symbol | Meaning |
|--------|---------|
| 🟢 Green Markers | Survey/Activity Locations |
| 🔵 Blue Markers | Residential/Living Locations |
| ⬛ Black Arrows | Movement Direction (activity → home) |
| ⬜ Gray Outlines | District Boundaries |

## 💡 Use Cases

1. **Urban Planning**: Understand commute patterns and activity centers
2. **Transportation**: Identify major travel corridors
3. **Community Services**: Target service locations based on activity patterns
4. **Policy Making**: Data-driven decisions about district resource allocation

## 🔮 Future Enhancements

See [TIMELINE_ANIMATION_PLAN.md](TIMELINE_ANIMATION_PLAN.md) for planned timeline animation feature:
- Add datetime data to points
- Animate points appearing chronologically
- Timeline slider control
- Speed adjustment controls
- Progressive reveal of movement patterns

## 📝 Documentation

- [Timeline Animation Plan](TIMELINE_ANIMATION_PLAN.md) - Detailed plan for temporal visualization
- [Data Relationships](DATA_RELATIONSHIPS.md) - Explanation of data structure and relationships
- [Implementation Summary](IMPLEMENTATION_SUMMARY.md) - Changes made during development
- [Improvement Plan](IMPROVEMENT_PLAN.md) - Original project improvement roadmap

## 🌐 Hosting on GitHub Pages

1. Create a new repository on GitHub
2. Push this project to the repository
3. Go to Settings → Pages
4. Select "main" branch as source
5. Your map will be live at: `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`

## 👥 Credits

**Map Generated with:** QGIS2Web (initial export)

**Enhanced with:**
- Custom popup redesign
- Arrow visualization for movement patterns
- Responsive design improvements
- Interactive statistics

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

**Built with Claude Code** 🤖
