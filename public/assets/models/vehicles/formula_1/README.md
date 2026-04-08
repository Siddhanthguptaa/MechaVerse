# Formula 1 Vehicle Model

## Setup Instructions

To add the F1 car model to MechaVerse, you need to place a 3D model file in this directory.

### Required File
- **f1_generic.glb** - The F1 car model in GLB format

### Creating/Finding an F1 Model

You have several options:

1. **Use an existing 3D model:**
   - Download a free F1 model from sites like:
     - Sketchfab (https://sketchfab.com) - search for "Formula 1 car" with GLB export
     - CGTrader
     - TurboSquid
   - Export it as `.glb` format
   - Place it as `f1_generic.glb` in this directory

2. **Create your own model:**
   - Use Blender (free) to model an F1 car
   - Export as `.glb` format with:
     - PBR (Physically Based Rendering) materials
     - Optimized geometry for real-time rendering
     - Separate materials for body, wheels, etc.

3. **Modify an existing vehicle model:**
   - Use one of the existing models from `../toyota/`, `../jeep/`, or `../ford/` directories
   - Adapt it for F1 specifications

### Model Specifications

For best results, ensure your F1 model:
- **Format:** GLB (Binary glTF)
- **Geometry:** Optimized for real-time rendering (keep polygon count reasonable)
- **Materials:** PBR materials with color/metallic/roughness maps
- **Scale:** Should match other vehicle models in the game
- **Rotation:** Y-axis should be forward direction
- **Wheels:** Should be separate objects for proper wheel mounting

### Configuration

The F1 vehicle is already configured in `vehicleConfigs.js` with:
- **wheel_offset:** 0.6 (distance from center to wheel mount point)
- **wheelbase:** 3.6 (distance between front and rear axles)
- **Default wheels:** Uses game's default wheel/tire configuration

Once you place the model file, it will automatically appear in the vehicle selector in the game!

### Verification

After adding the model file:
1. Refresh your game in the browser
2. Open the Editor panel
3. Look for "Formula 1 - Generic" in the vehicle dropdown
4. Select it to see the F1 model in the game
