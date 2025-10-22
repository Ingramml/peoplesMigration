// app.js - Custom application logic for Phoenix City Council Districts Population Movement Map

console.log('app.js loaded');

// Global variables - attach to window object to ensure global scope
window.registrationCounts = {};
window.residentCounts = {};

console.log('Global variables initialized:', window.registrationCounts, window.residentCounts);

// Initialize counts after data loads
window.initializeCounts = function() {
    // Check if data is loaded
    if (typeof json_Lineayer_regloc_4 === 'undefined') {
        console.error('Registration data (json_Lineayer_regloc_4) not loaded yet!');
        return;
    }
    if (typeof json_Lineayer_Living_3 === 'undefined') {
        console.error('Living data (json_Lineayer_Living_3) not loaded yet!');
        return;
    }

    // Count registrations by district
    window.registrationCounts = window.countByDistrict(json_Lineayer_regloc_4);

    // Count residents by district
    window.residentCounts = window.countByDistrict(json_Lineayer_Living_3);

    console.log('Application initialized');
    console.log('Registration data features:', json_Lineayer_regloc_4.features ? json_Lineayer_regloc_4.features.length : 0);
    console.log('Living data features:', json_Lineayer_Living_3.features ? json_Lineayer_Living_3.features.length : 0);
    console.log('Registration counts by district:', window.registrationCounts);
    console.log('Resident counts by district:', window.residentCounts);
};

// Count features by district
window.countByDistrict = function(geojsonData) {
    var counts = {};
    if (geojsonData && geojsonData.features) {
        geojsonData.features.forEach(function(feature) {
            var district = feature.properties.district;
            if (district) {
                counts[district] = (counts[district] || 0) + 1;
            }
        });
    }
    return counts;
};

// Get registration count for a district
window.getRegistrationCount = function(district) {
    return window.registrationCounts[district] || 0;
};

// Get resident count for a district
window.getResidentCount = function(district) {
    return window.residentCounts[district] || 0;
};

// Add legend to map
window.addLegend = function(map) {
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'map-legend');
        div.innerHTML = `
            <h4>Legend</h4>
            <div class="legend-item">
                <span class="marker-dot blue"></span>
                <span>Living Locations</span>
            </div>
            <div class="legend-item">
                <span class="marker-dot green"></span>
                <span>Registration Locations</span>
            </div>
            <div class="legend-item">
                <svg width="20" height="2" class="line-sample">
                    <line x1="0" y1="1" x2="20" y2="1" stroke="#666" stroke-width="2"/>
                </svg>
                <span>Movement Connections</span>
            </div>
            <div class="legend-item">
                <svg width="20" height="20" class="polygon-sample">
                    <rect x="2" y="2" width="16" height="16" fill="none" stroke="#232323" stroke-width="2"/>
                </svg>
                <span>District Boundaries</span>
            </div>
        `;

        // Prevent map interaction when clicking on legend
        L.DomEvent.disableClickPropagation(div);
        L.DomEvent.disableScrollPropagation(div);

        return div;
    };

    legend.addTo(map);
};

// Hide loading overlay when map is ready
window.hideLoadingOverlay = function() {
    var overlay = document.getElementById('loading-overlay');
    if (overlay) {
        setTimeout(function() {
            overlay.style.opacity = '0';
            setTimeout(function() {
                overlay.style.display = 'none';
            }, 300);
        }, 500);
    }
};

// Shorten line to a percentage of its length (to show arrow head before destination point)
window.shortenLineCoordinates = function(coords, percentage) {
    // percentage should be between 0 and 1 (e.g., 0.85 = 85% of line length)
    if (!coords || coords.length < 2) return coords;

    var start = coords[0];
    var end = coords[1];

    // Calculate new endpoint at specified percentage along the line
    var newEnd = [
        start[0] + (end[0] - start[0]) * percentage,
        start[1] + (end[1] - start[1]) * percentage
    ];

    return [start, newEnd];
};

// Process arrow line data to shorten lines
window.processArrowLines = function(geojsonData, shortenPercentage) {
    if (!geojsonData || !geojsonData.features) return geojsonData;

    // Create a deep copy to avoid modifying original data
    var processedData = JSON.parse(JSON.stringify(geojsonData));

    processedData.features.forEach(function(feature) {
        if (feature.geometry && feature.geometry.type === 'LineString' && feature.geometry.coordinates) {
            feature.geometry.coordinates = window.shortenLineCoordinates(
                feature.geometry.coordinates,
                shortenPercentage || 0.85  // Default to 85% of line length
            );
        }
    });

    return processedData;
};
