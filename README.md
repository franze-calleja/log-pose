# LogPose 📍

A photo-journaling travel app with offline SQLite storage, OpenStreetMap integration, and location-based entries. Built with Expo, React Native, and NativeWind.

## Features

- 📸 **Photo Capture** - Take photos with automatic location tagging
- 🗺️ **OpenStreetMap Integration** - Free map tiles on Android (no Google Maps API costs)
- 💾 **Offline-First SQLite** - All data stored locally with runtime migrations
- 🌍 **Smart Geocoding** - Automatic address enrichment with 1.5s rate limiting
- 📁 **Trip Organization** - Organize photos into trips with auto-creation
- 🖼️ **Image Compression** - Automatic 1080px/0.7 quality compression
- ⚡ **Progressive Loading** - Skeleton loaders for address enrichment

## Architecture

### Data Model

```
Trip (Parent)
  ├─ Log (Location Pin)
  │   ├─ Photo 1
  │   ├─ Photo 2
  │   └─ Photo N
```

### Key Design Decisions

1. **Immortal System Trip** - "Unsorted Adventure" (id=1) auto-created for frictionless capture
2. **Lazy Geocoding** - Addresses enriched on app focus, prioritizing visible items
3. **Optimistic File Deletion** - DB deletes first, files cleaned with `idempotent: true`
4. **Rate Limiting** - 1.5s delay between Nominatim API calls to respect free tier

## Project Structure

```
log-pose/
├── app/                    # Expo Router
│   ├── (tabs)/            # Bottom tab navigation
│   │   ├── map.tsx
│   │   ├── journals.tsx
│   │   └── settings.tsx
│   ├── (modals)/          # Modal screens
│   │   ├── camera.tsx
│   │   ├── create-log.tsx
│   │   └── view-photo.tsx
│   └── _layout.tsx        # Providers setup
│
├── db/                     # SQLite Database
│   ├── client.ts          # PRAGMA user_version migrations
│   ├── schema.ts          # TypeScript types
│   └── migrations/
│       └── 001_initial_schema.sql
│
├── services/               # Business Logic
│   ├── database/          # Repository pattern
│   │   ├── trip.repository.ts
│   │   ├── log.repository.ts
│   │   └── photo.repository.ts
│   ├── file-system/
│   │   └── photo.service.ts  # 1080px compression
│   └── location/
│       └── geocoding.service.ts  # Nominatim API
│
├── hooks/                  # React Hooks
│   ├── queries/           # TanStack Query
│   │   ├── useLogs.ts
│   │   └── useTrips.ts
│   ├── useLocation.ts
│   ├── useCamera.ts
│   └── useGeocodeEnrichment.ts
│
├── store/                  # State Management
│   └── useMapStore.ts     # Zustand
│
├── components/
│   ├── map/               # Map components
│   │   ├── OSMMap.tsx     # Platform-aware map
│   │   ├── PhotoMarker.tsx
│   │   ├── TripSelectorPill.tsx
│   │   └── UserLocationBtn.tsx
│   ├── journals/          # Journal UI
│   │   ├── JournalCard.tsx
│   │   ├── EmptyState.tsx
│   │   └── ArchivedSection.tsx
│   └── ui/                # Reusable components
│       ├── Fab.tsx
│       ├── GlassCard.tsx
│       └── SkeletonLoader.tsx
│
└── lib/
    └── constants.ts       # App configuration
```

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on iOS
npx expo start --ios

# Run on Android
npx expo start --android
```

### First Run

The app will automatically:
1. Initialize SQLite database with PRAGMA user_version
2. Run migrations (001_initial_schema.sql)
3. Create "Unsorted Adventure" system trip (id=1)
4. Request camera and location permissions

## Development

### Running Migrations

Migrations run automatically on app start based on `PRAGMA user_version`. To add a new migration:

1. Create `db/migrations/002_your_migration.sql`
2. Add to `MIGRATIONS` array in `db/client.ts`:

```typescript
{
  version: 2,
  name: '002_your_migration',
  sql: `...`
}
```

### Database Inspection

Use Expo SQLite tools or query directly:

```typescript
import { getDatabase } from './db/client';

const db = getDatabase();
const logs = await db.getAllAsync('SELECT * FROM logs');
```

### Testing Geocoding

The app respects Nominatim's 1 req/sec limit:

- Batch processes 5 logs at a time
- 1.5s delay between requests
- Silent failures on network errors
- Prioritizes visible items in FlatList

## Key Features Explained

### Frictionless Photo Capture

User flow:
1. Tap camera FAB
2. Take photo → auto-saved to active trip
3. Toast: "Saved to Unsorted Adventure" (tappable to rename)
4. Address enriches in background

### Trip Migration

When creating first real trip from "Unsorted Adventure":

```
Alert: "Move 5 photos from 'Unsorted Adventure' to 'Paris 2026'?"
  → Move: UPDATE logs SET trip_id = newId
  → Start Fresh: Leave in system trip
```

### Platform-Aware Maps

```typescript
// Android: Free OpenStreetMap tiles
<UrlTile urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />

// iOS: Default Apple Maps (no API key needed)
<MapView provider="default" />
```

## Configuration

### Image Compression

Edit in `lib/constants.ts`:

```typescript
export const IMAGE_MAX_WIDTH = 1080;  // Max width in pixels
export const IMAGE_QUALITY = 0.7;     // JPEG quality (0.0-1.0)
export const THUMBNAIL_SIZE = 200;    // Thumbnail width
```

### Geocoding

```typescript
export const NOMINATIM_DELAY_MS = 1500;  // Delay between requests
export const GEOCODE_BATCH_SIZE = 5;     // Logs per batch
```

## Troubleshooting

### Database Issues

Reset database:
```bash
# Clear app data (iOS)
npx expo start --ios --clear

# Clear app data (Android)
adb shell pm clear com.yourapp.logpose
```

### Permission Errors

Check `app.json` includes:
- `expo-location` plugin
- `expo-camera` plugin
- Platform-specific permissions in iOS `infoPlist` and Android `permissions`

### Map Not Loading (Android)

Ensure internet connection for tile download. Tiles cache automatically after first view.

## Tech Stack

- **Expo SDK 54** - React Native framework
- **Expo Router** - File-based navigation
- **expo-sqlite** - Local database
- **TanStack Query** - Async state management
- **Zustand** - Client state
- **NativeWind** - Tailwind CSS for React Native
- **react-native-maps** - Map component
- **@gorhom/bottom-sheet** - Bottom sheet modals

## License

MIT

## Credits

- Maps: [OpenStreetMap](https://www.openstreetmap.org/)
- Geocoding: [Nominatim](https://nominatim.openstreetmap.org/)
