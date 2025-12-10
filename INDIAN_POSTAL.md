# Indian Postal Location System

This system provides automatic location detection and population for Indian addresses using PIN codes and state-based city selection.

## Features

### 1. **PIN Code Auto-Population**
- Enter a 6-digit Indian PIN code
- Automatically fetches and fills:
  - City/District
  - State
  - Country (India)
- Uses the India Post API (`api.postalpincode.in`)
- Real-time validation and loading indicator

### 2. **State-based City Selection**
- Dropdown with all 28 Indian States and 8 Union Territories
- When a state is selected:
  - City dropdown automatically populates with major cities
  - Option to type custom city name if not in the list
- Covers 200+ major cities across India

### 3. **Smart Form Fields**
The system intelligently handles three scenarios:
1. **PIN Code First**: Enter PIN → Auto-fills State & City
2. **State First**: Select State → Choose from City dropdown
3. **Manual Entry**: Type custom city if not in dropdown

## How It Works

### Patient Registration (`/patient`)
```typescript
// PIN Code field with auto-population
<input 
  type="text" 
  value={formData.pincode}
  onChange={(e) => handlePincodeChange(e.target.value)}
  maxLength={6}
/>

// Auto-populated State field
<select value={formData.state} onChange={(e) => handleStateChange(e.target.value)}>
  {INDIAN_STATES.map(state => <option>{state}</option>)}
</select>

// Smart City field
{availableCities.length > 0 ? (
  <select> /* City dropdown */ </select>
) : (
  <input /> /* Manual entry */
)}
```

### Doctor Profile (`/doctor`)
Same implementation with state dropdown and city auto-population.

## API Integration

### India Post API
- **Endpoint**: `https://api.postalpincode.in/pincode/{pincode}`
- **Response**: Post office details including State, District, Circle
- **Rate Limit**: Free tier, reasonable limits
- **Fallback**: Manual entry if API fails

### Example Response
```json
{
  "Status": "Success",
  "PostOffice": [{
    "Name": "Mumbai GPO",
    "District": "Mumbai",
    "State": "Maharashtra",
    "Pincode": "400001",
    "Country": "India"
  }]
}
```

## Data Sources

### States List
All 36 states and union territories:
- 28 States (Andhra Pradesh to West Bengal)
- 8 Union Territories (Delhi, Puducherry, etc.)

### Cities Database
200+ major cities organized by state, including:
- Metropolitan cities (Mumbai, Delhi, Bangalore, etc.)
- Tier 2 cities (Indore, Nagpur, Coimbatore, etc.)
- State capitals and district headquarters

## User Experience

### Flow 1: PIN Code Entry
1. User enters 6-digit PIN code → `110001`
2. Loading spinner appears
3. State auto-fills → `Delhi`
4. City auto-fills → `New Delhi`

### Flow 2: State Selection
1. User selects state → `Maharashtra`
2. City dropdown activates with 10+ cities
3. User selects `Mumbai` or types custom city

### Flow 3: Validation
- PIN code: Must be exactly 6 digits
- State: Must select from dropdown
- City: Either dropdown or manual entry
- Real-time visual feedback for all fields

## Code Structure

### `/src/lib/indianPostal.ts`
```typescript
// Main utilities
export const INDIAN_STATES: string[]
export const CITIES_BY_STATE: Record<string, string[]>
export function fetchLocationFromPincode(pincode: string)
export function getCitiesForState(state: string)
export function isValidPincode(pincode: string)
```

### Usage in Components
```typescript
import { 
  fetchLocationFromPincode, 
  INDIAN_STATES, 
  getCitiesForState, 
  isValidPincode 
} from "@/lib/indianPostal"

// In component
const [fetchingLocation, setFetchingLocation] = useState(false)
const [availableCities, setAvailableCities] = useState<string[]>([])

async function handlePincodeChange(pincode: string) {
  if (isValidPincode(pincode)) {
    const data = await fetchLocationFromPincode(pincode)
    // Auto-fill state and city
  }
}
```

## Benefits

1. **User Convenience**: No need to type state/city repeatedly
2. **Data Accuracy**: Reduces typos and inconsistent naming
3. **Mobile Friendly**: Dropdowns work better on mobile than text input
4. **Government Standard**: Uses official India Post data
5. **Offline Fallback**: Manual entry still available

## Future Enhancements

- [ ] Add more cities (expand to 500+)
- [ ] Add district-level data
- [ ] Implement fuzzy search for cities
- [ ] Cache PIN code results
- [ ] Add validation for invalid PIN codes
- [ ] Support for rural post offices
- [ ] Bilingual support (English + Hindi)

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Optimized for touch

## Performance

- PIN Code API call: ~200-500ms
- Dropdown rendering: Instant
- No impact on page load
- Lightweight (~15KB for cities data)
