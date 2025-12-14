export type Language = 'en' | 'hi' | 'mr' | 'bh'

export interface Translations {
  // Navbar
  nav: {
    home: string
    features: string
    about: string
    contact: string
    patientPortal: string
    doctorPortal: string
    logout: string
    profile: string
    settings: string
    helpSupport: string
    darkMode: string
    lightMode: string
  }
  // Common
  common: {
    save: string
    cancel: string
    edit: string
    delete: string
    submit: string
    back: string
    next: string
    previous: string
    loading: string
    search: string
    selectLanguage: string
  }
  // Patient Registration
  patientReg: {
    title: string
    step1: string
    step2: string
    step3: string
    step4: string
    personalInfo: string
    contactInfo: string
    emergencyContact: string
    medicalInfo: string
    name: string
    namePlaceholder: string
    email: string
    emailPlaceholder: string
    dateOfBirth: string
    gender: string
    selectGender: string
    male: string
    female: string
    other: string
    bloodGroup: string
    selectBloodGroup: string
    phone: string
    phonePlaceholder: string
    address: string
    addressPlaceholder: string
    pincode: string
    pincodePlaceholder: string
    pincodeHelper: string
    state: string
    selectState: string
    city: string
    selectCity: string
    otherCity: string
    emergencyName: string
    emergencyNamePlaceholder: string
    relationship: string
    selectRelationship: string
    spouse: string
    parent: string
    sibling: string
    child: string
    friend: string
    emergencyPhone: string
    emergencyPhonePlaceholder: string
    allergies: string
    allergiesPlaceholder: string
    conditions: string
    conditionsPlaceholder: string
    medications: string
    medicationsPlaceholder: string
    notes: string
    notesPlaceholder: string
  }
  // Doctor Registration
  doctorReg: {
    title: string
    personalInfo: string
    professionalInfo: string
    name: string
    email: string
    phone: string
    licenseNumber: string
    licensePlaceholder: string
    specialization: string
    specializationPlaceholder: string
    qualifications: string
    qualificationsPlaceholder: string
    experience: string
    experiencePlaceholder: string
    state: string
    city: string
    saveProfile: string
    blockchainIdentity: string
    walletAddress: string
    status: string
    authorized: string
    pendingAuth: string
  }
  // Dashboard
  dashboard: {
    welcome: string
    patientDashboard: string
    doctorDashboard: string
    overview: string
    recentActivity: string
    upcomingAppointments: string
    noAppointments: string
    quickActions: string
    viewRecords: string
    bookAppointment: string
    uploadDocument: string
    emergencyQR: string
    healthMetrics: string
    bmi: string
    bloodPressure: string
    heartRate: string
    medications: string
    documents: string
    advisoryTitle: string
    totalPatients: string
    underYourCare: string
    today: string
    active: string
    consultations: string
    pending: string
    records: string
    new: string
    requests: string
    viewPatients: string
    accessRecords: string
    createRecord: string
    addRecord: string
    authorization: string
    newPatientAccess: string
    patientGrantedAccess: string
    recordCreated: string
    recordForConsultation: string
    accessRequestReceived: string
    newPatientRequested: string
    hoursAgo: string
    dayAgo: string
  }
  // Footer
  footer: {
    brandDescription: string
    quickLinks: string
    home: string
    patientPortal: string
    doctorPortal: string
    emergencyAccess: string
    features: string
    blockchainSecurity: string
    emergencyQR: string
    medicalRecords: string
    doctorAccessControl: string
    aboutProject: string
    aboutDescription: string
    endToEndEncryption: string
    instantEmergencyAccess: string
    poweredByEthereum: string
    allRightsReserved: string
    privacyPolicy: string
    termsOfService: string
    healthcareCompliance: string
  }
  // Emergency
  emergency: {
    title: string
    scanQR: string
    patientInfo: string
    emergencyContact: string
    medicalHistory: string
    allergies: string
    conditions: string
    currentMedications: string
    blockchainNote: string
    backToHome: string
  }
}

export const translations: Record<Language, Translations> = {
  // English (Default)
  en: {
    nav: {
      home: 'Home',
      features: 'Features',
      about: 'About',
      contact: 'Contact',
      patientPortal: 'Patient Portal',
      doctorPortal: 'Doctor Portal',
      logout: 'Log out',
      profile: 'Profile',
      settings: 'Settings',
      helpSupport: 'Help & Support',
      darkMode: 'Dark Mode',
      lightMode: 'Light Mode',
    },
    common: {
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      submit: 'Submit',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      loading: 'Loading...',
      search: 'Search',
      selectLanguage: 'Select Language',
    },
    patientReg: {
      title: 'Patient Registration',
      step1: 'Personal Information',
      step2: 'Contact Information',
      step3: 'Emergency Contact',
      step4: 'Medical Information',
      personalInfo: 'Personal Information',
      contactInfo: 'Contact Information',
      emergencyContact: 'Emergency Contact',
      medicalInfo: 'Medical Information',
      name: 'Full Name',
      namePlaceholder: 'John Doe',
      email: 'Email',
      emailPlaceholder: 'john@example.com',
      dateOfBirth: 'Date of Birth',
      gender: 'Gender',
      selectGender: 'Select gender',
      male: 'Male',
      female: 'Female',
      other: 'Other',
      bloodGroup: 'Blood Group',
      selectBloodGroup: 'Select blood group',
      phone: 'Phone',
      phonePlaceholder: '+91 98765 43210',
      address: 'Address',
      addressPlaceholder: 'Street address',
      pincode: 'PIN Code',
      pincodePlaceholder: 'Enter 6-digit PIN',
      pincodeHelper: 'City & State will auto-fill',
      state: 'State',
      selectState: 'Select State',
      city: 'City',
      selectCity: 'Select City',
      otherCity: 'Other (Type below)',
      emergencyName: 'Emergency Contact Name',
      emergencyNamePlaceholder: 'Jane Doe',
      relationship: 'Relationship',
      selectRelationship: 'Select relationship',
      spouse: 'Spouse',
      parent: 'Parent',
      sibling: 'Sibling',
      child: 'Child',
      friend: 'Friend',
      emergencyPhone: 'Emergency Phone',
      emergencyPhonePlaceholder: '+91 98765 43211',
      allergies: 'Allergies',
      allergiesPlaceholder: 'Penicillin, Peanuts, etc.',
      conditions: 'Medical Conditions',
      conditionsPlaceholder: 'Diabetes, Hypertension, etc.',
      medications: 'Current Medications',
      medicationsPlaceholder: 'Aspirin, Metformin, etc.',
      notes: 'Additional Notes',
      notesPlaceholder: 'Any other relevant information...',
    },
    doctorReg: {
      title: 'Doctor Profile',
      personalInfo: 'Personal Information',
      professionalInfo: 'Professional Information',
      name: 'Full Name',
      email: 'Email',
      phone: 'Phone',
      licenseNumber: 'Medical License Number',
      licensePlaceholder: 'MCI-12345',
      specialization: 'Specialization',
      specializationPlaceholder: 'Cardiology, Neurology, etc.',
      qualifications: 'Qualifications',
      qualificationsPlaceholder: 'MBBS, MD, etc.',
      experience: 'Years of Experience',
      experiencePlaceholder: '5',
      state: 'State',
      city: 'City',
      saveProfile: 'Save Profile',
      blockchainIdentity: 'Blockchain Identity',
      walletAddress: 'Wallet Address',
      status: 'Status',
      authorized: 'Authorized to access patient records',
      pendingAuth: 'Pending authorization',
    },
    dashboard: {
      welcome: 'Welcome',
      patientDashboard: 'Patient Dashboard',
      doctorDashboard: 'Doctor Dashboard',
      overview: 'Overview',
      recentActivity: 'Recent Activity',
      upcomingAppointments: 'Upcoming Appointments',
      noAppointments: 'No upcoming appointments',
      quickActions: 'Quick Actions',
      viewRecords: 'View Records',
      bookAppointment: 'Book Appointment',
      uploadDocument: 'Upload Document',
      emergencyQR: 'Emergency QR',
      healthMetrics: 'Health Metrics',
      bmi: 'BMI',
      bloodPressure: 'Blood Pressure',
      heartRate: 'Heart Rate',
      medications: 'Medications',
      documents: 'Documents',
      advisoryTitle: 'Health Advisory',
      totalPatients: 'Total Patients',
      underYourCare: 'Under your care',
      today: 'Today',
      active: 'Active',
      consultations: 'Consultations',
      pending: 'Pending',
      records: 'Records',
      new: 'New',
      requests: 'Requests',
      viewPatients: 'View Patients',
      accessRecords: 'Access patient records',
      createRecord: 'Create Record',
      addRecord: 'Add new medical record',
      authorization: 'Authorization',
      newPatientAccess: 'New patient access granted',
      patientGrantedAccess: 'Patient granted access',
      recordCreated: 'Medical record created',
      recordForConsultation: 'Record for consultation',
      accessRequestReceived: 'Access request received',
      newPatientRequested: 'New patient requested access',
      hoursAgo: 'hours ago',
      dayAgo: 'day ago',
    },
    footer: {
      brandDescription: 'Blockchain powered healthcare records that save lives. Your health data, your control securely stored and accessible when it matters most.',
      quickLinks: 'Quick Links',
      home: 'Home',
      patientPortal: 'Patient Portal',
      doctorPortal: 'Doctor Portal',
      emergencyAccess: 'Emergency Access',
      features: 'Features',
      blockchainSecurity: 'Blockchain Security',
      emergencyQR: 'Emergency QR Codes',
      medicalRecords: 'Medical Records',
      doctorAccessControl: 'Doctor Access Control',
      aboutProject: 'About the Project',
      aboutDescription: 'Built with cutting edge blockchain technology to ensure your medical records are secure, private, and accessible in emergencies.',
      endToEndEncryption: 'End-to-end encryption',
      instantEmergencyAccess: 'Instant emergency access',
      poweredByEthereum: 'Powered by Ethereum',
      allRightsReserved: 'Swasthya Sanchar. All rights reserved.',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      healthcareCompliance: 'Healthcare Compliance',
    },
    emergency: {
      title: 'Emergency Medical Information',
      scanQR: 'Scan QR Code for instant access to medical history',
      patientInfo: 'Patient Information',
      emergencyContact: 'Emergency Contact',
      medicalHistory: 'Medical History',
      allergies: 'Allergies',
      conditions: 'Medical Conditions',
      currentMedications: 'Current Medications',
      blockchainNote: 'This information is securely stored on blockchain',
      backToHome: 'Back to Home',
    },
  },

  // Hindi
  hi: {
    nav: {
      home: 'होम',
      features: 'विशेषताएं',
      about: 'हमारे बारे में',
      contact: 'संपर्क करें',
      patientPortal: 'रोगी पोर्टल',
      doctorPortal: 'डॉक्टर पोर्टल',
      logout: 'लॉग आउट',
      profile: 'प्रोफ़ाइल',
      settings: 'सेटिंग्स',
      helpSupport: 'सहायता और समर्थन',
      darkMode: 'डार्क मोड',
      lightMode: 'लाइट मोड',
    },
    common: {
      save: 'सहेजें',
      cancel: 'रद्द करें',
      edit: 'संपादित करें',
      delete: 'हटाएं',
      submit: 'जमा करें',
      back: 'पीछे',
      next: 'अगला',
      previous: 'पिछला',
      loading: 'लोड हो रहा है...',
      search: 'खोजें',
      selectLanguage: 'भाषा चुनें',
    },
    patientReg: {
      title: 'रोगी पंजीकरण',
      step1: 'व्यक्तिगत जानकारी',
      step2: 'संपर्क जानकारी',
      step3: 'आपातकालीन संपर्क',
      step4: 'चिकित्सा जानकारी',
      personalInfo: 'व्यक्तिगत जानकारी',
      contactInfo: 'संपर्क जानकारी',
      emergencyContact: 'आपातकालीन संपर्क',
      medicalInfo: 'चिकित्सा जानकारी',
      name: 'पूरा नाम',
      namePlaceholder: 'राज कुमार',
      email: 'ईमेल',
      emailPlaceholder: 'raj@example.com',
      dateOfBirth: 'जन्म तिथि',
      gender: 'लिंग',
      selectGender: 'लिंग चुनें',
      male: 'पुरुष',
      female: 'महिला',
      other: 'अन्य',
      bloodGroup: 'रक्त समूह',
      selectBloodGroup: 'रक्त समूह चुनें',
      phone: 'फोन',
      phonePlaceholder: '+91 98765 43210',
      address: 'पता',
      addressPlaceholder: 'सड़क का पता',
      pincode: 'पिन कोड',
      pincodePlaceholder: '6 अंकों का पिन दर्ज करें',
      pincodeHelper: 'शहर और राज्य स्वतः भर जाएगा',
      state: 'राज्य',
      selectState: 'राज्य चुनें',
      city: 'शहर',
      selectCity: 'शहर चुनें',
      otherCity: 'अन्य (नीचे टाइप करें)',
      emergencyName: 'आपातकालीन संपर्क का नाम',
      emergencyNamePlaceholder: 'रीना कुमार',
      relationship: 'संबंध',
      selectRelationship: 'संबंध चुनें',
      spouse: 'पति/पत्नी',
      parent: 'माता-पिता',
      sibling: 'भाई-बहन',
      child: 'बच्चा',
      friend: 'दोस्त',
      emergencyPhone: 'आपातकालीन फोन',
      emergencyPhonePlaceholder: '+91 98765 43211',
      allergies: 'एलर्जी',
      allergiesPlaceholder: 'पेनिसिलिन, मूंगफली, आदि',
      conditions: 'चिकित्सा स्थितियां',
      conditionsPlaceholder: 'मधुमेह, उच्च रक्तचाप, आदि',
      medications: 'वर्तमान दवाएं',
      medicationsPlaceholder: 'एस्पिरिन, मेटफॉर्मिन, आदि',
      notes: 'अतिरिक्त नोट्स',
      notesPlaceholder: 'कोई अन्य प्रासंगिक जानकारी...',
    },
    doctorReg: {
      title: 'डॉक्टर प्रोफाइल',
      personalInfo: 'व्यक्तिगत जानकारी',
      professionalInfo: 'व्यावसायिक जानकारी',
      name: 'पूरा नाम',
      email: 'ईमेल',
      phone: 'फोन',
      licenseNumber: 'चिकित्सा लाइसेंस नंबर',
      licensePlaceholder: 'MCI-12345',
      specialization: 'विशेषज्ञता',
      specializationPlaceholder: 'हृदय रोग, न्यूरोलॉजी, आदि',
      qualifications: 'योग्यताएं',
      qualificationsPlaceholder: 'MBBS, MD, आदि',
      experience: 'अनुभव के वर्ष',
      experiencePlaceholder: '5',
      state: 'राज्य',
      city: 'शहर',
      saveProfile: 'प्रोफ़ाइल सहेजें',
      blockchainIdentity: 'ब्लॉकचेन पहचान',
      walletAddress: 'वॉलेट पता',
      status: 'स्थिति',
      authorized: 'रोगी रिकॉर्ड देखने के लिए अधिकृत',
      pendingAuth: 'प्राधिकरण लंबित',
    },
    dashboard: {
      welcome: 'स्वागत है',
      patientDashboard: 'रोगी डैशबोर्ड',
      doctorDashboard: 'डॉक्टर डैशबोर्ड',
      overview: 'अवलोकन',
      recentActivity: 'हाल की गतिविधि',
      upcomingAppointments: 'आगामी अपॉइंटमेंट',
      noAppointments: 'कोई आगामी अपॉइंटमेंट नहीं',
      quickActions: 'त्वरित कार्य',
      viewRecords: 'रिकॉर्ड देखें',
      bookAppointment: 'अपॉइंटमेंट बुक करें',
      uploadDocument: 'दस्तावेज़ अपलोड करें',
      emergencyQR: 'आपातकालीन QR',
      healthMetrics: 'स्वास्थ्य मेट्रिक्स',
      bmi: 'बीएमआई',
      bloodPressure: 'रक्तचाप',
      heartRate: 'हृदय गति',
      medications: 'दवाएं',
      documents: 'दस्तावेज़',
      advisoryTitle: 'स्वास्थ्य सलाह',
      totalPatients: 'कुल मरीज',
      underYourCare: 'आपकी देखभाल में',
      today: 'आज',
      active: 'सक्रिय',
      consultations: 'परामर्श',
      pending: 'लंबित',
      records: 'रिकॉर्ड',
      new: 'नया',
      requests: 'अनुरोध',
      viewPatients: 'मरीज देखें',
      accessRecords: 'मरीज रिकॉर्ड देखें',
      createRecord: 'रिकॉर्ड बनाएं',
      addRecord: 'नया चिकित्सा रिकॉर्ड जोड़ें',
      authorization: 'प्राधिकरण',
      newPatientAccess: 'नए मरीज की पहुंच दी गई',
      patientGrantedAccess: 'मरीज को पहुंच दी गई',
      recordCreated: 'चिकित्सा रिकॉर्ड बनाया गया',
      recordForConsultation: 'परामर्श के लिए रिकॉर्ड',
      accessRequestReceived: 'पहुंच अनुरोध प्राप्त',
      newPatientRequested: 'नए मरीज ने पहुंच का अनुरोध किया',
      hoursAgo: 'घंटे पहले',
      dayAgo: 'दिन पहले',
    },
    footer: {
      brandDescription: 'ब्लॉकचेन संचालित स्वास्थ्य रिकॉर्ड जो जीवन बचाते हैं। आपका स्वास्थ्य डेटा, आपका नियंत्रण—सुरक्षित रूप से संग्रहीत और सबसे महत्वपूर्ण समय पर सुलभ।',
      quickLinks: 'त्वरित लिंक',
      home: 'होम',
      patientPortal: 'रोगी पोर्टल',
      doctorPortal: 'डॉक्टर पोर्टल',
      emergencyAccess: 'आपातकालीन पहुंच',
      features: 'विशेषताएं',
      blockchainSecurity: 'ब्लॉकचेन सुरक्षा',
      emergencyQR: 'आपातकालीन QR कोड',
      medicalRecords: 'चिकित्सा रिकॉर्ड',
      doctorAccessControl: 'डॉक्टर पहुंच नियंत्रण',
      aboutProject: 'परियोजना के बारे में',
      aboutDescription: 'अत्याधुनिक ब्लॉकचेन तकनीक के साथ बनाया गया ताकि आपके चिकित्सा रिकॉर्ड सुरक्षित, निजी और आपात स्थिति में सुलभ हों।',
      endToEndEncryption: 'एंड-टू-एंड एन्क्रिप्शन',
      instantEmergencyAccess: 'तत्काल आपातकालीन पहुंच',
      poweredByEthereum: 'इथेरियम द्वारा संचालित',
      allRightsReserved: 'स्वास्थ्य संचार। सर्वाधिकार सुरक्षित।',
      privacyPolicy: 'गोपनीयता नीति',
      termsOfService: 'सेवा की शर्तें',
      healthcareCompliance: 'स्वास्थ्य देखभाल अनुपालन',
    },
    emergency: {
      title: 'आपातकालीन चिकित्सा जानकारी',
      scanQR: 'चिकित्सा इतिहास तक त्वरित पहुंच के लिए QR कोड स्कैन करें',
      patientInfo: 'रोगी की जानकारी',
      emergencyContact: 'आपातकालीन संपर्क',
      medicalHistory: 'चिकित्सा इतिहास',
      allergies: 'एलर्जी',
      conditions: 'चिकित्सा स्थितियां',
      currentMedications: 'वर्तमान दवाएं',
      blockchainNote: 'यह जानकारी सुरक्षित रूप से ब्लॉकचेन पर संग्रहीत है',
      backToHome: 'होम पर वापस जाएं',
    },
  },

  // Marathi
  mr: {
    nav: {
      home: 'होम',
      features: 'वैशिष्ट्ये',
      about: 'आमच्याबद्दल',
      contact: 'संपर्क करा',
      patientPortal: 'रुग्ण पोर्टल',
      doctorPortal: 'डॉक्टर पोर्टल',
      logout: 'लॉग आउट',
      profile: 'प्रोफाइल',
      settings: 'सेटिंग्ज',
      helpSupport: 'मदत आणि समर्थन',
      darkMode: 'डार्क मोड',
      lightMode: 'लाइट मोड',
    },
    common: {
      save: 'जतन करा',
      cancel: 'रद्द करा',
      edit: 'संपादित करा',
      delete: 'हटवा',
      submit: 'सबमिट करा',
      back: 'मागे',
      next: 'पुढे',
      previous: 'मागील',
      loading: 'लोड होत आहे...',
      search: 'शोधा',
      selectLanguage: 'भाषा निवडा',
    },
    patientReg: {
      title: 'रुग्ण नोंदणी',
      step1: 'वैयक्तिक माहिती',
      step2: 'संपर्क माहिती',
      step3: 'आणीबाणी संपर्क',
      step4: 'वैद्यकीय माहिती',
      personalInfo: 'वैयक्तिक माहिती',
      contactInfo: 'संपर्क माहिती',
      emergencyContact: 'आणीबाणी संपर्क',
      medicalInfo: 'वैद्यकीय माहिती',
      name: 'पूर्ण नाव',
      namePlaceholder: 'राज कुमार',
      email: 'ईमेल',
      emailPlaceholder: 'raj@example.com',
      dateOfBirth: 'जन्मतारीख',
      gender: 'लिंग',
      selectGender: 'लिंग निवडा',
      male: 'पुरुष',
      female: 'स्त्री',
      other: 'इतर',
      bloodGroup: 'रक्तगट',
      selectBloodGroup: 'रक्तगट निवडा',
      phone: 'फोन',
      phonePlaceholder: '+91 98765 43210',
      address: 'पत्ता',
      addressPlaceholder: 'रस्त्याचा पत्ता',
      pincode: 'पिन कोड',
      pincodePlaceholder: '6 अंकी पिन प्रविष्ट करा',
      pincodeHelper: 'शहर आणि राज्य स्वयंचलितपणे भरले जाईल',
      state: 'राज्य',
      selectState: 'राज्य निवडा',
      city: 'शहर',
      selectCity: 'शहर निवडा',
      otherCity: 'इतर (खाली टाइप करा)',
      emergencyName: 'आणीबाणी संपर्काचे नाव',
      emergencyNamePlaceholder: 'रीना कुमार',
      relationship: 'नाते',
      selectRelationship: 'नाते निवडा',
      spouse: 'जोडीदार',
      parent: 'पालक',
      sibling: 'भावंड',
      child: 'मूल',
      friend: 'मित्र',
      emergencyPhone: 'आणीबाणी फोन',
      emergencyPhonePlaceholder: '+91 98765 43211',
      allergies: 'ऍलर्जी',
      allergiesPlaceholder: 'पेनिसिलिन, शेंगदाणे, इ.',
      conditions: 'वैद्यकीय स्थिती',
      conditionsPlaceholder: 'मधुमेह, उच्च रक्तदाब, इ.',
      medications: 'वर्तमान औषधे',
      medicationsPlaceholder: 'ऍस्पिरिन, मेटफॉर्मिन, इ.',
      notes: 'अतिरिक्त नोट्स',
      notesPlaceholder: 'इतर कोणतीही संबंधित माहिती...',
    },
    doctorReg: {
      title: 'डॉक्टर प्रोफाइल',
      personalInfo: 'वैयक्तिक माहिती',
      professionalInfo: 'व्यावसायिक माहिती',
      name: 'पूर्ण नाव',
      email: 'ईमेल',
      phone: 'फोन',
      licenseNumber: 'वैद्यकीय परवाना क्रमांक',
      licensePlaceholder: 'MCI-12345',
      specialization: 'विशेषीकरण',
      specializationPlaceholder: 'हृदयरोग, न्यूरोलॉजी, इ.',
      qualifications: 'पात्रता',
      qualificationsPlaceholder: 'MBBS, MD, इ.',
      experience: 'अनुभवाची वर्षे',
      experiencePlaceholder: '5',
      state: 'राज्य',
      city: 'शहर',
      saveProfile: 'प्रोफाइल जतन करा',
      blockchainIdentity: 'ब्लॉकचेन ओळख',
      walletAddress: 'वॉलेट पत्ता',
      status: 'स्थिती',
      authorized: 'रुग्ण रेकॉर्ड पाहण्यासाठी अधिकृत',
      pendingAuth: 'प्राधिकरण प्रलंबित',
    },
    dashboard: {
      welcome: 'स्वागत आहे',
      patientDashboard: 'रुग्ण डॅशबोर्ड',
      doctorDashboard: 'डॉक्टर डॅशबोर्ड',
      overview: 'विहंगावलोकन',
      recentActivity: 'अलीकडील क्रियाकलाप',
      upcomingAppointments: 'आगामी भेटी',
      noAppointments: 'कोणत्याही आगामी भेटी नाहीत',
      quickActions: 'द्रुत क्रिया',
      viewRecords: 'रेकॉर्ड पहा',
      bookAppointment: 'भेट बुक करा',
      uploadDocument: 'दस्तऐवज अपलोड करा',
      emergencyQR: 'आणीबाणी QR',
      healthMetrics: 'आरोग्य मेट्रिक्स',
      bmi: 'बीएमआय',
      bloodPressure: 'रक्तदाब',
      heartRate: 'हृदय गती',
      medications: 'औषधे',
      documents: 'दस्तऐवज',
      advisoryTitle: 'आरोग्य सल्ला',
      totalPatients: 'एकूण रुग्ण',
      underYourCare: 'तुमच्या काळजीखाली',
      today: 'आज',
      active: 'सक्रिय',
      consultations: 'सल्लामसलत',
      pending: 'प्रलंबित',
      records: 'रेकॉर्ड',
      new: 'नवीन',
      requests: 'विनंत्या',
      viewPatients: 'रुग्ण पहा',
      accessRecords: 'रुग्ण रेकॉर्ड पहा',
      createRecord: 'रेकॉर्ड तयार करा',
      addRecord: 'नवीन वैद्यकीय रेकॉर्ड जोडा',
      authorization: 'प्राधिकरण',
      newPatientAccess: 'नवीन रुग्णाचा प्रवेश दिला',
      patientGrantedAccess: 'रुग्णाला प्रवेश दिला',
      recordCreated: 'वैद्यकीय रेकॉर्ड तयार केला',
      recordForConsultation: 'सल्लामसलतीसाठी रेकॉर्ड',
      accessRequestReceived: 'प्रवेश विनंती प्राप्त',
      newPatientRequested: 'नवीन रुग्णाने प्रवेशाची विनंती केली',
      hoursAgo: 'तासांपूर्वी',
      dayAgo: 'दिवसापूर्वी',
    },
    footer: {
      brandDescription: 'ब्लॉकचेन संचालित आरोग्य रेकॉर्ड जे जीवन वाचवतात. तुमचा आरोग्य डेटा, तुमचे नियंत्रण—सुरक्षितपणे संग्रहित आणि सर्वात महत्त्वाच्या वेळी उपलब्ध.',
      quickLinks: 'द्रुत दुवे',
      home: 'होम',
      patientPortal: 'रुग्ण पोर्टल',
      doctorPortal: 'डॉक्टर पोर्टल',
      emergencyAccess: 'आणीबाणी प्रवेश',
      features: 'वैशिष्ट्ये',
      blockchainSecurity: 'ब्लॉकचेन सुरक्षा',
      emergencyQR: 'आणीबाणी QR कोड',
      medicalRecords: 'वैद्यकीय रेकॉर्ड',
      doctorAccessControl: 'डॉक्टर प्रवेश नियंत्रण',
      aboutProject: 'प्रकल्पाबद्दल',
      aboutDescription: 'अत्याधुनिक ब्लॉकचेन तंत्रज्ञानासह तयार केले आहे जेणेकरून तुमचे वैद्यकीय रेकॉर्ड सुरक्षित, खाजगी आणि आणीबाणीच्या वेळी उपलब्ध असतील.',
      endToEndEncryption: 'एंड-टू-एंड एन्क्रिप्शन',
      instantEmergencyAccess: 'त्वरित आणीबाणी प्रवेश',
      poweredByEthereum: 'इथरियमद्वारे समर्थित',
      allRightsReserved: 'स्वास्थ्य संचार. सर्व हक्क राखीव.',
      privacyPolicy: 'गोपनीयता धोरण',
      termsOfService: 'सेवा अटी',
      healthcareCompliance: 'आरोग्य सेवा अनुपालन',
    },
    emergency: {
      title: 'आणीबाणी वैद्यकीय माहिती',
      scanQR: 'वैद्यकीय इतिहासात त्वरित प्रवेशासाठी QR कोड स्कॅन करा',
      patientInfo: 'रुग्णाची माहिती',
      emergencyContact: 'आणीबाणी संपर्क',
      medicalHistory: 'वैद्यकीय इतिहास',
      allergies: 'ऍलर्जी',
      conditions: 'वैद्यकीय स्थिती',
      currentMedications: 'वर्तमान औषधे',
      blockchainNote: 'ही माहिती सुरक्षितपणे ब्लॉकचेनवर संग्रहित आहे',
      backToHome: 'होमवर परत जा',
    },
  },

  // Bhojpuri
  bh: {
    nav: {
      home: 'होम',
      features: 'फीचर',
      about: 'हमार बारे में',
      contact: 'संपर्क करीं',
      patientPortal: 'मरीज पोर्टल',
      doctorPortal: 'डॉक्टर पोर्टल',
      logout: 'लॉग आउट',
      profile: 'प्रोफाइल',
      settings: 'सेटिंग',
      helpSupport: 'मदद आ सहयोग',
      darkMode: 'डार्क मोड',
      lightMode: 'लाइट मोड',
    },
    common: {
      save: 'सेव करीं',
      cancel: 'रद्द करीं',
      edit: 'एडिट करीं',
      delete: 'डिलीट करीं',
      submit: 'सबमिट करीं',
      back: 'पीछे',
      next: 'आगे',
      previous: 'पिछला',
      loading: 'लोड हो रहल बा...',
      search: 'खोजीं',
      selectLanguage: 'भाषा चुनीं',
    },
    patientReg: {
      title: 'मरीज रजिस्ट्रेशन',
      step1: 'व्यक्तिगत जानकारी',
      step2: 'संपर्क जानकारी',
      step3: 'आपातकालीन संपर्क',
      step4: 'चिकित्सा जानकारी',
      personalInfo: 'व्यक्तिगत जानकारी',
      contactInfo: 'संपर्क जानकारी',
      emergencyContact: 'आपातकालीन संपर्क',
      medicalInfo: 'चिकित्सा जानकारी',
      name: 'पूरा नाम',
      namePlaceholder: 'राज कुमार',
      email: 'ईमेल',
      emailPlaceholder: 'raj@example.com',
      dateOfBirth: 'जन्म तारीख',
      gender: 'लिंग',
      selectGender: 'लिंग चुनीं',
      male: 'पुरुष',
      female: 'महिला',
      other: 'दोसर',
      bloodGroup: 'खून के समूह',
      selectBloodGroup: 'खून के समूह चुनीं',
      phone: 'फोन',
      phonePlaceholder: '+91 98765 43210',
      address: 'पता',
      addressPlaceholder: 'सड़क के पता',
      pincode: 'पिन कोड',
      pincodePlaceholder: '6 अंक के पिन डालीं',
      pincodeHelper: 'शहर आ राज्य अपने आप भर जाई',
      state: 'राज्य',
      selectState: 'राज्य चुनीं',
      city: 'शहर',
      selectCity: 'शहर चुनीं',
      otherCity: 'दोसर (नीचे टाइप करीं)',
      emergencyName: 'आपातकालीन संपर्क के नाम',
      emergencyNamePlaceholder: 'रीना कुमार',
      relationship: 'रिश्ता',
      selectRelationship: 'रिश्ता चुनीं',
      spouse: 'पति/पत्नी',
      parent: 'माई-बाप',
      sibling: 'भाई-बहिन',
      child: 'बच्चा',
      friend: 'दोस्त',
      emergencyPhone: 'आपातकालीन फोन',
      emergencyPhonePlaceholder: '+91 98765 43211',
      allergies: 'एलर्जी',
      allergiesPlaceholder: 'पेनिसिलिन, मूंगफली, आदि',
      conditions: 'चिकित्सा स्थिति',
      conditionsPlaceholder: 'मधुमेह, उच्च रक्तचाप, आदि',
      medications: 'मौजूदा दवाई',
      medicationsPlaceholder: 'एस्पिरिन, मेटफॉर्मिन, आदि',
      notes: 'अउरी नोट',
      notesPlaceholder: 'कवनो दोसर जरूरी जानकारी...',
    },
    doctorReg: {
      title: 'डॉक्टर प्रोफाइल',
      personalInfo: 'व्यक्तिगत जानकारी',
      professionalInfo: 'व्यावसायिक जानकारी',
      name: 'पूरा नाम',
      email: 'ईमेल',
      phone: 'फोन',
      licenseNumber: 'चिकित्सा लाइसेंस नंबर',
      licensePlaceholder: 'MCI-12345',
      specialization: 'विशेषज्ञता',
      specializationPlaceholder: 'हृदय रोग, न्यूरोलॉजी, आदि',
      qualifications: 'योग्यता',
      qualificationsPlaceholder: 'MBBS, MD, आदि',
      experience: 'अनुभव के साल',
      experiencePlaceholder: '5',
      state: 'राज्य',
      city: 'शहर',
      saveProfile: 'प्रोफाइल सेव करीं',
      blockchainIdentity: 'ब्लॉकचेन पहचान',
      walletAddress: 'वॉलेट पता',
      status: 'स्थिति',
      authorized: 'मरीज रिकॉर्ड देखे के अधिकार बा',
      pendingAuth: 'प्राधिकरण लंबित बा',
    },
    dashboard: {
      welcome: 'स्वागत बा',
      patientDashboard: 'मरीज डैशबोर्ड',
      doctorDashboard: 'डॉक्टर डैशबोर्ड',
      overview: 'अवलोकन',
      recentActivity: 'हाल के गतिविधि',
      upcomingAppointments: 'आवे वाला अपॉइंटमेंट',
      noAppointments: 'कवनो अपॉइंटमेंट नइखे',
      quickActions: 'तुरंत काम',
      viewRecords: 'रिकॉर्ड देखीं',
      bookAppointment: 'अपॉइंटमेंट बुक करीं',
      uploadDocument: 'डॉक्यूमेंट अपलोड करीं',
      emergencyQR: 'आपातकालीन QR',
      healthMetrics: 'स्वास्थ्य मेट्रिक्स',
      bmi: 'बीएमआई',
      bloodPressure: 'रक्तचाप',
      heartRate: 'दिल के धड़कन',
      medications: 'दवाई',
      documents: 'डॉक्यूमेंट',
      advisoryTitle: 'स्वास्थ्य सलाह',
      totalPatients: 'कुल मरीज',
      underYourCare: 'रउआ के देखभाल में',
      today: 'आज',
      active: 'सक्रिय',
      consultations: 'परामर्श',
      pending: 'लंबित',
      records: 'रिकॉर्ड',
      new: 'नया',
      requests: 'अनुरोध',
      viewPatients: 'मरीज देखीं',
      accessRecords: 'मरीज रिकॉर्ड देखीं',
      createRecord: 'रिकॉर्ड बनाईं',
      addRecord: 'नया चिकित्सा रिकॉर्ड जोड़ीं',
      authorization: 'प्राधिकरण',
      newPatientAccess: 'नया मरीज के पहुंच मिल गइल',
      patientGrantedAccess: 'मरीज के पहुंच मिल गइल',
      recordCreated: 'चिकित्सा रिकॉर्ड बन गइल',
      recordForConsultation: 'परामर्श खातिर रिकॉर्ड',
      accessRequestReceived: 'पहुंच के अनुरोध मिल गइल',
      newPatientRequested: 'नया मरीज पहुंच मांगलस',
      hoursAgo: 'घंटा पहिले',
      dayAgo: 'दिन पहिले',
    },
    footer: {
      brandDescription: 'ब्लॉकचेन से चले वाला स्वास्थ्य रिकॉर्ड जवन जिनगी बचावेला। रउआ के स्वास्थ्य डेटा, रउआ के नियंत्रण—सुरक्षित तरीका से संग्रहित आ जरूरत के समय उपलब्ध।',
      quickLinks: 'तुरंत लिंक',
      home: 'होम',
      patientPortal: 'मरीज पोर्टल',
      doctorPortal: 'डॉक्टर पोर्टल',
      emergencyAccess: 'आपातकालीन पहुंच',
      features: 'फीचर',
      blockchainSecurity: 'ब्लॉकचेन सुरक्षा',
      emergencyQR: 'आपातकालीन QR कोड',
      medicalRecords: 'चिकित्सा रिकॉर्ड',
      doctorAccessControl: 'डॉक्टर पहुंच नियंत्रण',
      aboutProject: 'प्रोजेक्ट के बारे में',
      aboutDescription: 'अत्याधुनिक ब्लॉकचेन तकनीक से बनावल गइल बा ताकि रउआ के चिकित्सा रिकॉर्ड सुरक्षित, निजी आ आपातकाल में उपलब्ध रहे।',
      endToEndEncryption: 'एंड-टू-एंड एन्क्रिप्शन',
      instantEmergencyAccess: 'तुरंत आपातकालीन पहुंच',
      poweredByEthereum: 'इथेरियम से संचालित',
      allRightsReserved: 'स्वास्थ्य संचार। सब अधिकार सुरक्षित बा।',
      privacyPolicy: 'गोपनीयता नीति',
      termsOfService: 'सेवा के शर्तें',
      healthcareCompliance: 'स्वास्थ्य देखभाल अनुपालन',
    },
    emergency: {
      title: 'आपातकालीन चिकित्सा जानकारी',
      scanQR: 'चिकित्सा इतिहास तुरंत देखे खातिर QR कोड स्कैन करीं',
      patientInfo: 'मरीज के जानकारी',
      emergencyContact: 'आपातकालीन संपर्क',
      medicalHistory: 'चिकित्सा इतिहास',
      allergies: 'एलर्जी',
      conditions: 'चिकित्सा स्थिति',
      currentMedications: 'मौजूदा दवाई',
      blockchainNote: 'ई जानकारी सुरक्षित तरीका से ब्लॉकचेन पर रखल बा',
      backToHome: 'होम पर वापस जाईं',
    },
  },
}

export const languageNames: Record<Language, string> = {
  en: 'English',
  hi: 'हिन्दी',
  mr: 'मराठी',
  bh: 'भोजपुरी',
}
