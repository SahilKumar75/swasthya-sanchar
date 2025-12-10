# Testing Multi-Language Feature

## ✅ How to Test

### 1. **Check if Language Selector Appears**
- Login to your app
- Look at the **navbar** (top right)
- You should see a **globe icon 🌐** between the wallet info and avatar

### 2. **Test Language Switching**
1. Click the **globe icon**
2. You should see dropdown with 4 options:
   - English
   - हिन्दी
   - मराठी
   - भोजपुरी
3. Click on **हिन्दी** (Hindi)
4. Dropdown should close
5. Check if text changes:
   - "Home" → "होम"
   - "Features" → "विशेषताएं"
   - "Log out" → "लॉग आउट"
   - "Settings" → "सेटिंग्स"
   - "Help & Support" → "सहायता और समर्थन"

### 3. **Test Persistence**
1. Switch to Hindi (or any other language)
2. **Reload the page** (F5 or Cmd+R)
3. Language should still be Hindi after reload
4. Check browser's localStorage:
   - Open DevTools (F12)
   - Go to Application tab → Local Storage
   - Look for key `language` with value `hi`

### 4. **Test All Languages**

#### English (en):
- Home, Features, Log out, Settings
- Patient Portal, Doctor Portal
- Dark Mode, Light Mode
- Help & Support

#### Hindi (hi):
- होम, विशेषताएं, लॉग आउट, सेटिंग्स
- रोगी पोर्टल, डॉक्टर पोर्टल
- डार्क मोड, लाइट मोड
- सहायता और समर्थन

#### Marathi (mr):
- होम, वैशिष्ट्ये, लॉग आउट, सेटिंग्ज
- रुग्ण पोर्टल, डॉक्टर पोर्टल
- डार्क मोड, लाइट मोड
- मदत आणि समर्थन

#### Bhojpuri (bh):
- होम, फीचर, लॉग आउट, सेटिंग
- मरीज पोर्टल, डॉक्टर पोर्टल
- डार्क मोड, लाइट मोड
- मदद आ सहयोग

## 🐛 Troubleshooting

### Issue: Language selector not visible
**Solution:**
1. Make sure you're logged in
2. Check if navbar is rendered
3. Look between wallet address and avatar

### Issue: Clicking language doesn't change text
**Possible causes:**
1. **Components not using `useLanguage`** - Only Navbar and ProfileDropdown are translated so far
2. **Check browser console** for errors (F12 → Console tab)
3. **Verify localStorage** - Should save language when clicked

### Issue: Language resets on page reload
**Solution:**
1. Check browser console for localStorage errors
2. Try clearing localStorage and setting again
3. Check if cookies are enabled

### Issue: Text shows as [object Object] or undefined
**Cause:** Component trying to access translation before LanguageProvider loads
**Solution:** Wait for component to mount or add loading state

## 📝 Currently Translated Components

### ✅ Translated:
1. **Navbar**
   - Home link
   - Features menu
   - Language selector itself

2. **ProfileDropdown**
   - Patient Portal / Doctor Portal
   - Settings
   - Help & Support
   - Dark Mode / Light Mode
   - Log out

### ⏳ Not Yet Translated (Manual Update Needed):
- Patient registration forms
- Doctor profile forms
- Dashboard pages
- Emergency page
- Buttons (Save, Cancel, Submit, etc.)
- Form labels and placeholders

## 🔧 Quick Debug Commands

### Check Language in Console:
```javascript
// Open browser console (F12) and run:
localStorage.getItem('language')  // Should show: "en", "hi", "mr", or "bh"
```

### Manually Set Language:
```javascript
localStorage.setItem('language', 'hi')  // Set to Hindi
window.location.reload()  // Reload to apply
```

### Clear Language:
```javascript
localStorage.removeItem('language')  // Reset to default (English)
window.location.reload()
```

## 🎯 Expected Behavior

1. **First Visit:** Language = English (default)
2. **After Selecting Hindi:** All navbar/dropdown text changes to Hindi
3. **After Page Reload:** Language stays Hindi
4. **After Clearing Browser Data:** Resets to English

## 📊 Verification Checklist

- [ ] Globe icon visible in navbar
- [ ] Dropdown opens when clicking globe
- [ ] 4 languages listed in dropdown
- [ ] Selected language has checkmark
- [ ] Text changes when selecting language
- [ ] Language persists after reload
- [ ] localStorage stores selected language
- [ ] No console errors
- [ ] Dropdown closes after selection
- [ ] Dropdown closes when clicking outside

## 🚀 Next Steps (To Translate More Pages)

To translate patient registration or other pages, add this to the component:

```typescript
import { useLanguage } from '@/contexts/LanguageContext'

function MyComponent() {
  const { t } = useLanguage()
  
  return (
    <div>
      <h1>{t.patientReg.title}</h1>  {/* Patient Registration */}
      <label>{t.patientReg.name}</label>  {/* Full Name */}
      <button>{t.common.save}</button>  {/* Save */}
    </div>
  )
}
```

All 800+ translations are ready in `/src/lib/i18n/translations.ts`!
