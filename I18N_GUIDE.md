# Multi-Language Support (i18n)

Swasthya Sanchar now supports **4 languages**:
- 🇬🇧 **English** (Default)
- 🇮🇳 **हिन्दी** (Hindi)
- 🇮🇳 **मराठी** (Marathi)
- 🇮🇳 **भोजपुरी** (Bhojpuri)

## 🎯 Features

- **Persistent Language Selection**: User's language choice is saved to `localStorage`
- **System-wide Translation**: All UI elements translate automatically
- **Easy Toggle**: Language selector in navbar (globe icon)
- **Dropdown UI**: Matches the avatar dropdown style with smooth animations
- **RTL Support Ready**: Structure supports future right-to-left languages

## 📁 File Structure

```
src/
├── lib/i18n/
│   └── translations.ts          # All translations
├── contexts/
│   └── LanguageContext.tsx      # Language state management
├── components/
│   └── LanguageSelector.tsx     # Language picker UI
```

## 🔧 How to Use

### 1. **In Any Component**

```typescript
import { useLanguage } from '@/contexts/LanguageContext'

function MyComponent() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div>
      <h1>{t.dashboard.welcome}</h1>
      <p>{t.common.loading}</p>
      <button onClick={() => setLanguage('hi')}>
        Switch to Hindi
      </button>
    </div>
  )
}
```

### 2. **Access Translations**

```typescript
const { t } = useLanguage()

// Navbar translations
t.nav.home              // "Home" | "होम" | "होम" | "होम"
t.nav.features          // "Features" | "विशेषताएं" | "वैशिष्ट्ये" | "फीचर"
t.nav.logout            // "Log out" | "लॉग आउट" | "लॉग आउट" | "लॉग आउट"

// Common translations
t.common.save           // "Save" | "सहेजें" | "जतन करा" | "सेव करीं"
t.common.cancel         // "Cancel" | "रद्द करें" | "रद्द करा" | "रद्द करीं"
t.common.loading        // "Loading..." | "लोड हो रहा है..." | "लोड होत आहे..." | "लोड हो रहल बा..."

// Patient Registration
t.patientReg.title      // "Patient Registration" | "रोगी पंजीकरण" | "रुग्ण नोंदणी" | "मरीज रजिस्ट्रेशन"
t.patientReg.name       // "Full Name" | "पूरा नाम" | "पूर्ण नाव" | "पूरा नाम"
t.patientReg.bloodGroup // "Blood Group" | "रक्त समूह" | "रक्तगट" | "खून के समूह"

// Doctor Registration
t.doctorReg.title       // "Doctor Profile" | "डॉक्टर प्रोफाइल" | "डॉक्टर प्रोफाइल" | "डॉक्टर प्रोफाइल"
t.doctorReg.licenseNumber // "Medical License Number" | "चिकित्सा लाइसेंस नंबर" | ...

// Dashboard
t.dashboard.welcome     // "Welcome" | "स्वागत है" | "स्वागत आहे" | "स्वागत बा"
t.dashboard.bmi         // "BMI" | "बीएमआई" | "बीएमआय" | "बीएमआई"
t.dashboard.medications // "Medications" | "दवाएं" | "औषधे" | "दवाई"

// Emergency
t.emergency.title       // "Emergency Medical Information" | "आपातकालीन चिकित्सा जानकारी" | ...
t.emergency.allergies   // "Allergies" | "एलर्जी" | "ऍलर्जी" | "एलर्जी"
```

### 3. **Get Current Language**

```typescript
const { language } = useLanguage()
// 'en' | 'hi' | 'mr' | 'bh'
```

### 4. **Change Language Programmatically**

```typescript
const { setLanguage } = useLanguage()

setLanguage('hi')  // Switch to Hindi
setLanguage('mr')  // Switch to Marathi
setLanguage('bh')  // Switch to Bhojpuri
setLanguage('en')  // Switch to English
```

## 📝 Translation Categories

### **nav** - Navigation
- home, features, about, contact
- patientPortal, doctorPortal
- logout, profile, settings
- helpSupport, darkMode, lightMode

### **common** - Common Actions
- save, cancel, edit, delete
- submit, back, next, previous
- loading, search, selectLanguage

### **patientReg** - Patient Registration
- Personal info: name, email, dateOfBirth, gender, bloodGroup
- Contact: phone, address, pincode, state, city
- Emergency: emergencyName, relationship, emergencyPhone
- Medical: allergies, conditions, medications, notes

### **doctorReg** - Doctor Registration
- personalInfo, professionalInfo
- licenseNumber, specialization, qualifications
- experience, state, city
- blockchainIdentity, walletAddress, status

### **dashboard** - Dashboard
- welcome, overview, recentActivity
- upcomingAppointments, quickActions
- healthMetrics, bmi, bloodPressure, heartRate
- medications, documents, advisoryTitle

### **emergency** - Emergency Page
- title, scanQR, patientInfo
- emergencyContact, medicalHistory
- allergies, conditions, currentMedications
- blockchainNote, backToHome

## ➕ Adding New Translations

### 1. **Add to Interface** (`translations.ts`)

```typescript
export interface Translations {
  // ... existing categories
  newCategory: {
    newKey: string
    anotherKey: string
  }
}
```

### 2. **Add Translations for All Languages**

```typescript
export const translations: Record<Language, Translations> = {
  en: {
    // ... existing translations
    newCategory: {
      newKey: 'My New Text',
      anotherKey: 'Another Text',
    },
  },
  hi: {
    // ... existing translations
    newCategory: {
      newKey: 'मेरा नया टेक्स्ट',
      anotherKey: 'दूसरा टेक्स्ट',
    },
  },
  mr: {
    // ... existing translations
    newCategory: {
      newKey: 'माझा नवीन मजकूर',
      anotherKey: 'दुसरा मजकूर',
    },
  },
  bh: {
    // ... existing translations
    newCategory: {
      newKey: 'हमार नया टेक्स्ट',
      anotherKey: 'दोसर टेक्स्ट',
    },
  },
}
```

### 3. **Use in Component**

```typescript
const { t } = useLanguage()
return <h1>{t.newCategory.newKey}</h1>
```

## 🌍 Language Display Names

```typescript
import { languageNames } from '@/lib/i18n/translations'

languageNames.en  // "English"
languageNames.hi  // "हिन्दी"
languageNames.mr  // "मराठी"
languageNames.bh  // "भोजपुरी"
```

## 🎨 UI Components

### **LanguageSelector**
- Located in navbar (right side, before theme toggle)
- Globe icon (🌐) with current language name
- Dropdown with all 4 languages
- Checkmark on selected language
- Smooth animations (fade-in, slide-from-top)
- Click outside to close
- Escape key to close

## 💾 Persistence

Language preference is automatically saved to `localStorage`:
```javascript
localStorage.setItem('language', 'hi')
localStorage.getItem('language') // 'hi'
```

## 🔄 Language Flow

```
User clicks Language Selector
    ↓
Dropdown shows 4 options
    ↓
User selects language
    ↓
Language saved to localStorage
    ↓
All UI updates instantly
    ↓
Preference persists on reload
```

## 📱 Mobile Support

- Language selector visible on mobile
- Language name hidden on small screens (< 768px)
- Only globe icon shown
- Dropdown adapts to mobile layout

## 🚀 Next Steps

### Ready to Implement:
1. ✅ Update patient registration form labels
2. ✅ Update doctor profile form labels
3. ✅ Translate dashboard components
4. ✅ Translate button texts
5. ✅ Translate navbar menu items

### Future Enhancements:
- [ ] Add more Indian languages (Tamil, Telugu, Gujarati, Bengali)
- [ ] Date/time localization
- [ ] Number formatting per locale
- [ ] Currency formatting
- [ ] Plural rules per language
- [ ] Language-specific fonts (Devanagari, etc.)

## 🐛 Testing

Test language switching:
1. Open app
2. Click globe icon in navbar
3. Select different languages
4. Verify all text updates
5. Reload page - language should persist
6. Check localStorage for saved preference

## 📖 Example Implementation

See how it's used in:
- `src/components/Navbar.tsx` - Language selector integration
- `src/app/layout.tsx` - LanguageProvider wrapper
- `src/components/LanguageSelector.tsx` - Language picker UI

## 🔐 Type Safety

All translations are fully typed with TypeScript:
```typescript
// ✅ Type-safe access
t.nav.home           // OK
t.dashboard.welcome  // OK

// ❌ TypeScript error
t.nav.invalidKey     // Error: Property 'invalidKey' does not exist
t.wrongCategory.key  // Error: Property 'wrongCategory' does not exist
```

## 🎯 Best Practices

1. **Always use `t` for text**: Never hardcode strings
2. **Keep keys semantic**: Use descriptive key names
3. **Consistent naming**: Follow existing patterns
4. **Complete translations**: Add text for all 4 languages
5. **Test all languages**: Verify translations make sense
6. **Cultural sensitivity**: Ensure translations are appropriate
7. **Length considerations**: Hindi/Marathi text may be longer than English

## 🌟 Benefits

- **Accessibility**: Reach more users in their native language
- **Government Compliance**: Required for Indian government systems
- **User Experience**: Better understanding and adoption
- **Trust**: Users feel more comfortable in native language
- **Medical Safety**: Critical for healthcare - no misunderstandings
