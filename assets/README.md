# Application Icon

This folder contains the application icon for the Database Console.

## Current Icon

A default database icon SVG (`icon.svg`) is included. You need to convert it to PNG or use your own icon.

### Convert the SVG to PNG:

**Online Converters** (easiest):
1. Go to [CloudConvert](https://cloudconvert.com/svg-to-png) or [Convertio](https://convertio.co/svg-png/)
2. Upload `icon.svg` from this folder
3. Set output size to 512x512 pixels
4. Download and save as `icon.png` in this folder

**Using Image Editors**:
- **GIMP**: File → Open → Select icon.svg → Export As → icon.png (512x512)
- **Inkscape**: File → Export PNG Image → Set width/height to 512 → Export
- **Photoshop**: Open SVG → Image Size → 512x512 → Save As PNG

### Icon Specifications:
- **Format**: PNG (required for Electron)
- **Recommended Size**: 512x512 pixels or 256x256 pixels
- **Transparent Background**: Recommended

### Alternative: Download a Custom Icon

1. **Free Icon Resources**:
   - [Flaticon](https://www.flaticon.com/search?word=database) - Search for "database"
   - [Icons8](https://icons8.com/icons/set/database) - Free database icons
   - [Iconscout](https://iconscout.com/icons/database) - Database icons

2. Download your preferred icon
3. Rename it to `icon.png`
4. Place it in this `assets/` folder
5. Replace the existing file

### After Adding Icon:

Restart the application to see the icon in:
- Application window title bar
- Windows taskbar
- Alt+Tab switcher
- Built application executable (when using `npm run build:electron`)
