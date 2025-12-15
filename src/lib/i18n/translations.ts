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
    emergency: string
    medicalRecords: string
    doctorAccess: string
    patients: string
    uploadRecords: string
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
  // Landing Page
  landing: {
    hero: {
      title1: string
      title2: string
      description: string
      signIn: string
      createAccount: string
      checkingAuth: string
    }
    howItWorks: {
      title: string
      description: string
      step1Title: string
      step1Content: string
      step2Title: string
      step2Content: string
      step3Title: string
      step3Content: string
      step4Title: string
      step4Content: string
    }
    blockchain: {
      title: string
      description: string
      feature1Title: string
      feature1Description: string
      feature2Title: string
      feature2Description: string
      feature3Title: string
      feature3Description: string
      feature4Title: string
      feature4Description: string
      feature5Title: string
      feature5Description: string
      feature6Title: string
      feature6Description: string
    }
    team: {
      title: string
      description: string
      member1Name: string
      member1Role: string
      member1Bio: string
      member2Name: string
      member2Role: string
      member2Bio: string
      member3Name: string
      member3Role: string
      member3Bio: string
      member4Name: string
      member4Role: string
      member4Bio: string
      member5Name: string
      member5Role: string
      member5Bio: string
    }
  }
  // Authentication
  auth: {
    welcomeBack: string
    welcomeBackDescription: string
    joinSwasthya: string
    joinSwasthyaDescription: string
    emailAddress: string
    password: string
    confirmPassword: string
    enterEmail: string
    enterPassword: string
    minChars: string
    confirmPasswordPlaceholder: string
    signIn: string
    signingIn: string
    createAccount: string
    creatingAccount: string
    iAmA: string
    patient: string
    doctor: string
    invalidCredentials: string
    passwordMismatch: string
    passwordMinLength: string
    accountCreatedButLoginFailed: string
    errorOccurred: string
    dontHaveAccount: string
    alreadyHaveAccount: string
    createOne: string
    signInLink: string
    testimonial1Name: string
    testimonial1Handle: string
    testimonial1Text: string
    testimonial2Name: string
    testimonial2Handle: string
    testimonial2Text: string
    testimonial3Name: string
    testimonial3Handle: string
    testimonial3Text: string
    testimonial4Name: string
    testimonial4Handle: string
    testimonial4Text: string
  }
  // Portal Pages
  portal: {
    patientHome: {
      welcomeBack: string
      completeRegistration: string
      completeRegistrationDesc: string
      registerNow: string
      bodyMassIndex: string
      bloodGroup: string
      currentMedications: string
      diagnosedWith: string
      since: string
      dietaryRecommendations: string
      medicationSchedule: string
      dosage: string
      timing: string
      noProfileData: string
      registerFirst: string
      prescribedBy: string
      common: string
      uncommon: string
      rare: string
      veryRare: string
      extremelyRare: string
      unknown: string
      underweight: string
      normal: string
      overweight: string
      obese: string
      doDietary: string
      dontDietary: string
    }
    doctorHome: {
      welcome: string
      dashboard: string
      recentPatients: string
      viewAll: string
      noPatients: string
      uploadRecords: string
      manageAccess: string
      totalPatients: string
      activePermissions: string
      patientsDiagnosed: string
      patients: string
      mostPrescribed: string
      prescriptions: string
      totalPrescriptions: string
    }
    emergency: {
      emergencyInfo: string
      scanQRForAccess: string
      patientDetails: string
      contactInfo: string
      medicalInfo: string
      loading: string
      notFound: string
      invalidAddress: string
      noWallet: string
      noWalletDesc: string
      goToRegistration: string
      medicalCard: string
      medicalCardDesc: string
      yourQRCode: string
      download: string
      print: string
      share: string
      qrDetails: string
      technicalInfo: string
      securityFeatures: string
      security1: string
      security2: string
      security3: string
      security4: string
      flipBack: string
      firstResponderView: string
      preview: string
      testPage: string
      howToUse: string
      step1: string
      step2: string
      step3: string
      step4: string
      infoShared: string
      bestPractices: string
      practice1: string
      practice2: string
      practice3: string
      practice4: string
      practice5: string
      helpline: string
      ambulance: string
      medical: string
      blockchainAddress: string
      emergencyPageUrl: string
      bloodType: string
      allergies: string
      conditions: string
      emergencyContactLabel: string
    }
    records: {
      myRecords: string
      uploadNew: string
      recordType: string
      uploadedOn: string
      uploadedBy: string
      noRecords: string
      uploadFirst: string
      download: string
      delete: string
      viewRecords: string
      backToDashboard: string
      myRecordsDesc: string
      noRecordsDesc: string
      active: string
      recordId: string
      uploadDate: string
      doctor: string
      unknown: string
      ipfsHash: string
      viewRecord: string
      medicalRecord: string
    }
    permissions: {
      doctorAccess: string
      grantAccess: string
      revokeAccess: string
      doctorName: string
      accessGranted: string
      accessExpires: string
      noDoctors: string
      grantAccessFirst: string
      active: string
      expired: string
    }
    upload: {
      uploadRecords: string
      selectPatient: string
      selectFile: string
      recordType: string
      uploadButton: string
      uploading: string
      success: string
      error: string
      noPatients: string
      selectPatientFirst: string
      pageTitle: string
      pageDescription: string
      uploadNew: string
      categoryLabel: string
      categoryPlaceholder: string
      uploadFileLabel: string
      descriptionLabel: string
      descriptionPlaceholder: string
      recentUploads: string
      noUploads: string
      fileSizeError: string
      fillAllFields: string
      supportedFormats: string
    }
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
      emergency: 'Emergency',
      medicalRecords: 'Medical Records',
      doctorAccess: 'Doctor Access',
      patients: 'Patients',
      uploadRecords: 'Upload Records',
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
    landing: {
      hero: {
        title1: 'Your Health Identity,',
        title2: 'Decentralized & Secure.',
        description: 'Empowering you with complete ownership of your medical history. Instant emergency access for first responders, seamless sharing for doctors, and privacy by design.',
        signIn: 'Sign In',
        createAccount: 'Create Account',
        checkingAuth: 'Checking authentication...',
      },
      howItWorks: {
        title: 'How It Works',
        description: 'Four simple steps from registration to life-saving emergency access. See how blockchain technology empowers you and protects your privacy.',
        step1Title: '1. Create Account',
        step1Content: 'Sign up securely using your email. We verify your identity to ensure a trusted network of patients and healthcare providers.',
        step2Title: '2. Add Medical History',
        step2Content: 'Upload your existing records, allergies, and medications. Your data is encrypted and stored on the blockchain, owned only by you.',
        step3Title: '3. Get Your QR Code',
        step3Content: 'Receive a unique QR code linked to your profile. This is your key to quick, secure sharing of vital information.',
        step4Title: '4. Emergency Access',
        step4Content: 'In an emergency, first responders scan your QR code to instantly access critical life-saving data like blood type and allergies.',
      },
      blockchain: {
        title: 'Why Blockchain for Healthcare?',
        description: 'Traditional systems fail when you need them most. Here\'s what makes us different.',
        feature1Title: 'You Own Your Data',
        feature1Description: 'No hospital, no government, no corporation owns your health records. Only you control who sees what with your private keys.',
        feature2Title: 'Emergency Ready',
        feature2Description: 'QR code on your ID gives first responders instant access to life-saving info like allergies and blood type—no wallet or login needed.',
        feature3Title: 'Permanent & Portable',
        feature3Description: 'Your records live on the blockchain forever. Change hospitals? Move cities? Your history follows you automatically without faxing papers.',
        feature4Title: 'Consent Based Sharing',
        feature4Description: 'Authorize specific doctors to view your records for a limited time. Revoke access anytime. Every access is logged transparently.',
        feature5Title: 'Global Access',
        feature5Description: 'Travel abroad? Your medical history is accessible worldwide, cutting through language and system barriers.',
        feature6Title: 'Tamper-Proof',
        feature6Description: 'Blockchain ensures your records can\'t be altered or deleted by malicious actors. Complete audit trail of every interaction.',
      },
      team: {
        title: 'Meet the Team',
        description: 'The passionate developers behind Swasthya Sanchar working to revolutionize healthcare data access.',
        member1Name: 'Sahil Kumar Singh',
        member1Role: 'Lead Developer',
        member1Bio: 'Full-stack developer passionate about blockchain and healthcare innovation. Leading the technical architecture of Swasthya Sanchar.',
        member2Name: 'Siddhant Tiwari',
        member2Role: 'Developer',
        member2Bio: 'Blockchain enthusiast and frontend specialist. Focused on creating seamless user experiences for patients and doctors.',
        member3Name: 'Akshit Thakur',
        member3Role: 'Developer',
        member3Bio: 'Backend wizard ensuring secure and efficient data handling. dedicated to building robust medical record systems.',
        member4Name: 'Shivam Rana',
        member4Role: 'Developer',
        member4Bio: 'Smart contract developer with a keen eye for security. Implementing the core decentralized logic of the platform.',
        member5Name: 'Nancy',
        member5Role: 'Developer',
        member5Bio: 'UI/UX designer and frontend developer creating intuitive healthcare interfaces. Ensuring accessibility and user-centered design.',
      },
    },
    auth: {
      welcomeBack: 'Welcome Back',
      welcomeBackDescription: 'Sign in to access your secure medical records.',
      joinSwasthya: 'Join Swasthya Sanchar',
      joinSwasthyaDescription: 'Create your account and take control of your health data.',
      emailAddress: 'Email Address',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      enterEmail: 'Enter your email',
      enterPassword: 'Enter your password',
      minChars: 'Min 8 chars',
      confirmPasswordPlaceholder: 'Confirm password',
      signIn: 'Sign In',
      signingIn: 'Signing in...',
      createAccount: 'Create Account',
      creatingAccount: 'Creating Account...',
      iAmA: 'I am a...',
      patient: 'Patient',
      doctor: 'Doctor',
      invalidCredentials: 'Invalid email or password',
      passwordMismatch: 'Passwords do not match',
      passwordMinLength: 'Password must be at least 8 characters',
      accountCreatedButLoginFailed: 'Account created but failed to sign in. Please try logging in.',
      errorOccurred: 'An error occurred. Please try again.',
      dontHaveAccount: 'Don\'t have an account?',
      alreadyHaveAccount: 'Already have an account?',
      createOne: 'Create one',
      signInLink: 'Sign in',
      testimonial1Name: 'Dr. Sarah Chen',
      testimonial1Handle: '@drchen_md',
      testimonial1Text: 'Swasthya Sanchar has revolutionized how I access patient history in emergencies.',
      testimonial2Name: 'Marcus Johnson',
      testimonial2Handle: '@marcus_j',
      testimonial2Text: 'I feel so much safer knowing my medical data is accessible to paramedics instantly.',
      testimonial3Name: 'Aiden T.',
      testimonial3Handle: '@aiden_tech',
      testimonial3Text: 'The blockchain security gives me peace of mind that my data is truly mine.',
      testimonial4Name: 'Emily R.',
      testimonial4Handle: '@emily_nur',
      testimonial4Text: 'As a nurse, this platform saves us critical minutes during emergency intake.',
    },
    portal: {
      patientHome: {
        welcomeBack: 'Welcome back',
        completeRegistration: 'Complete Your Blockchain Registration',
        completeRegistrationDesc: 'Register to unlock all features and secure your medical records.',
        registerNow: 'Register Now →',
        bodyMassIndex: 'Body Mass Index (BMI)',
        bloodGroup: 'Blood Group',
        currentMedications: 'Current Medications',
        diagnosedWith: 'Diagnosed With',
        since: 'Since',
        dietaryRecommendations: 'Dietary Recommendations',
        medicationSchedule: 'Medication Schedule',
        dosage: 'Dosage',
        timing: 'Timing',
        noProfileData: 'No profile data available. Please register on the blockchain first.',
        registerFirst: 'Please register on the blockchain first.',
        prescribedBy: 'Prescribed by',
        common: 'Common',
        uncommon: 'Uncommon',
        rare: 'Rare',
        veryRare: 'Very Rare',
        extremelyRare: 'Extremely Rare',
        unknown: 'Unknown',
        underweight: 'Underweight',
        normal: 'Normal',
        overweight: 'Overweight',
        obese: 'Obese',
        doDietary: 'Do:',
        dontDietary: "Don't:",
      },
      doctorHome: {
        welcome: 'Welcome',
        dashboard: 'Dashboard',
        recentPatients: 'Recent Patients',
        viewAll: 'View All',
        noPatients: 'No patients yet',
        uploadRecords: 'Upload Records',
        manageAccess: 'Manage Access',
        totalPatients: 'Total Patients',
        activePermissions: 'Active Permissions',
        patientsDiagnosed: 'Patients Diagnosed by Disease',
        patients: 'Patients',
        mostPrescribed: 'Most Prescribed Medications',
        prescriptions: 'prescriptions',
        totalPrescriptions: 'Total Prescriptions',
      },
      emergency: {
        emergencyInfo: 'Emergency Medical Information',
        scanQRForAccess: 'Scan QR Code for instant access to medical history',
        patientDetails: 'Patient Details',
        contactInfo: 'Contact Information',
        medicalInfo: 'Medical Information',
        loading: 'Loading...',
        notFound: 'Patient not found',
        invalidAddress: 'Invalid wallet address',
        noWallet: 'No Wallet Found',
        noWalletDesc: "Your account doesn't have a wallet address yet. Please complete patient registration first.",
        goToRegistration: 'Go to Registration',
        medicalCard: 'Emergency Medical Card',
        medicalCardDesc: 'Your emergency medical information for first responders',
        yourQRCode: 'Your Emergency QR Code',
        download: 'Download',
        print: 'Print',
        share: 'Share QR Code',
        qrDetails: 'QR Code Details',
        technicalInfo: 'Technical information',
        securityFeatures: '🔒 Security Features',
        security1: '• Blockchain-secured data',
        security2: '• No wallet required to scan',
        security3: '• Instant access for responders',
        security4: '• Tamper-proof records',
        flipBack: 'Hover to flip back',
        firstResponderView: 'First Responder View',
        preview: 'Emergency medical information preview',
        testPage: 'Test Emergency Page',
        howToUse: 'How to Use',
        step1: 'Download or print your QR code',
        step2: 'Keep it in your wallet or phone case',
        step3: 'Responders scan to access your info',
        step4: 'No wallet or crypto knowledge needed',
        infoShared: 'Information Shared',
        bestPractices: 'Best Practices',
        practice1: 'Print on waterproof paper',
        practice2: 'Keep multiple copies',
        practice3: 'Update if info changes',
        practice4: 'Share with family members',
        practice5: 'Add to phone lock screen',
        helpline: 'Emergency Helpline:',
        ambulance: 'Ambulance',
        medical: 'Medical',
        blockchainAddress: 'Blockchain Address',
        emergencyPageUrl: 'Emergency Page URL',
        bloodType: 'Blood Type',
        allergies: 'Allergies',
        conditions: 'Conditions',
        emergencyContactLabel: 'Emergency Contact',
      },
      records: {
        myRecords: 'My Medical Records',
        uploadNew: 'Upload New Record',
        recordType: 'Record Type',
        uploadedOn: 'Uploaded On',
        uploadedBy: 'Uploaded By',
        noRecords: 'No records found',
        uploadFirst: 'Upload your first medical record',
        download: 'Download',
        delete: 'Delete',
        viewRecords: 'View Records',
        backToDashboard: 'Back to Dashboard',
        myRecordsDesc: 'View and download your medical documents',
        noRecordsDesc: 'Your medical records will appear here once a doctor uploads them.',
        active: 'Active',
        recordId: 'Record ID',
        uploadDate: 'Upload Date',
        doctor: 'Doctor',
        unknown: 'Unknown',
        ipfsHash: 'IPFS Hash',
        viewRecord: 'View Record',
        medicalRecord: 'Medical Record',
      },
      permissions: {
        doctorAccess: 'Doctor Access Management',
        grantAccess: 'Grant Access',
        revokeAccess: 'Revoke Access',
        doctorName: 'Doctor Name',
        accessGranted: 'Access Granted',
        accessExpires: 'Access Expires',
        noDoctors: 'No doctors have access',
        grantAccessFirst: 'Grant access to doctors to view your records',
        active: 'Active',
        expired: 'Expired',
      },
      upload: {
        uploadRecords: 'Upload Medical Records',
        selectPatient: 'Select Patient',
        selectFile: 'Select File',
        recordType: 'Record Type',
        uploadButton: 'Upload',
        uploading: 'Uploading...',
        success: 'Upload successful',
        error: 'Upload failed',
        noPatients: 'No patients found',
        selectPatientFirst: 'Please select a patient first',
        pageTitle: 'Upload Medical Records',
        pageDescription: 'Upload medical records for patients who have granted you access',
        uploadNew: 'Upload New Record',
        categoryLabel: 'Category',
        categoryPlaceholder: 'Select category...',
        uploadFileLabel: 'Upload File',
        descriptionLabel: 'Description (Optional)',
        descriptionPlaceholder: 'Add any notes or description...',
        recentUploads: 'Recent Uploads',
        noUploads: 'No uploads yet',
        fileSizeError: 'File size should be less than 10MB',
        fillAllFields: 'Please fill in all required fields',
        supportedFormats: 'Supported: PDF, JPG, PNG, DOC, DOCX • Max 10MB',
      },
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
      emergency: 'आपातकाल',
      medicalRecords: 'चिकित्सा रिकॉर्ड',
      doctorAccess: 'डॉक्टर पहुंच',
      patients: 'मरीज',
      uploadRecords: 'रिकॉर्ड अपलोड करें',
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
      documents: 'दस्तवेज़',
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
    landing: {
      hero: {
        title1: 'आपकी स्वास्थ्य पहचान,',
        title2: 'विकेंद्रीकृत और सुरक्षित।',
        description: 'आपको अपने चिकित्सा इतिहास का पूर्ण स्वामित्व प्रदान करना। प्रथम उत्तरदाताओं के लिए तत्काल आपातकालीन पहुंच, डॉक्टरों के लिए सहज साझाकरण, और डिज़ाइन द्वारा गोपनीयता।',
        signIn: 'साइन इन करें',
        createAccount: 'खाता बनाएं',
        checkingAuth: 'प्रमाणीकरण जांच रहा है...',
      },
      howItWorks: {
        title: 'यह कैसे काम करता है',
        description: 'पंजीकरण से लेकर जीवन रक्षक आपातकालीन पहुंच तक चार सरल चरण। देखें कि ब्लॉकचेन तकनीक आपको कैसे सशक्त बनाती है और आपकी गोपनीयता की रक्षा करती है।',
        step1Title: '1. खाता बनाएं',
        step1Content: 'अपने ईमेल का उपयोग करके सुरक्षित रूप से साइन अप करें। हम रोगियों और स्वास्थ्य सेवा प्रदाताओं के विश्वसनीय नेटवर्क को सुनिश्चित करने के लिए आपकी पहचान सत्यापित करते हैं।',
        step2Title: '2. चिकित्सा इतिहास जोड़ें',
        step2Content: 'अपने मौजूदा रिकॉर्ड, एलर्जी और दवाएं अपलोड करें। आपका डेटा एन्क्रिप्ट किया गया है और ब्लॉकचेन पर संग्रहीत है, केवल आपके स्वामित्व में।',
        step3Title: '3. अपना QR कोड प्राप्त करें',
        step3Content: 'अपनी प्रोफ़ाइल से जुड़ा एक अद्वितीय QR कोड प्राप्त करें। यह महत्वपूर्ण जानकारी के त्वरित, सुरक्षित साझाकरण की आपकी कुंजी है।',
        step4Title: '4. आपातकालीन पहुंच',
        step4Content: 'आपातकाल में, प्रथम उत्तरदाता रक्त समूह और एलर्जी जैसे महत्वपूर्ण जीवन रक्षक डेटा तक तुरंत पहुंचने के लिए आपके QR कोड को स्कैन करते हैं।',
      },
      blockchain: {
        title: 'स्वास्थ्य सेवा के लिए ब्लॉकचेन क्यों?',
        description: 'पारंपरिक प्रणालियां तब विफल हो जाती हैं जब आपको उनकी सबसे अधिक आवश्यकता होती है। यहां बताया गया है कि हमें क्या अलग बनाता है।',
        feature1Title: 'आप अपने डेटा के मालिक हैं',
        feature1Description: 'कोई अस्पताल, कोई सरकार, कोई निगम आपके स्वास्थ्य रिकॉर्ड का मालिक नहीं है। केवल आप अपनी निजी कुंजियों के साथ नियंत्रित करते हैं कि कौन क्या देखता है।',
        feature2Title: 'आपातकालीन तैयार',
        feature2Description: 'आपकी आईडी पर QR कोड प्रथम उत्तरदाताओं को एलर्जी और रक्त समूह जैसी जीवन रक्षक जानकारी तक तुरंत पहुंच देता है—बिना वॉलेट या लॉगिन की आवश्यकता के।',
        feature3Title: 'स्थायी और पोर्टेबल',
        feature3Description: 'आपके रिकॉर्ड हमेशा के लिए ब्लॉकचेन पर रहते हैं। अस्पताल बदलें? शहर बदलें? आपका इतिहास बिना कागजात भेजे स्वचालित रूप से आपके साथ चलता है।',
        feature4Title: 'सहमति आधारित साझाकरण',
        feature4Description: 'विशिष्ट डॉक्टरों को सीमित समय के लिए आपके रिकॉर्ड देखने के लिए अधिकृत करें। किसी भी समय पहुंच रद्द करें। हर पहुंच पारदर्शी रूप से लॉग की जाती है।',
        feature5Title: 'वैश्विक पहुंच',
        feature5Description: 'विदेश यात्रा? आपका चिकित्सा इतिहास दुनिया भर में सुलभ है, भाषा और प्रणाली की बाधाओं को पार करते हुए।',
        feature6Title: 'छेड़छाड़-प्रूफ',
        feature6Description: 'ब्लॉकचेन सुनिश्चित करेला कि आपके रिकॉर्ड दुर्भावनापूर्ण अभिनेताओं द्वारा बदले या हटाए नहीं जा सकते। हर बातचीत का पूर्ण ऑडिट ट्रेल।',
      },
      team: {
        title: 'टीम से मिलें',
        description: 'स्वास्थ्य संचार के पीछे के भावुक डेवलपर्स जो स्वास्थ्य डेटा पहुंच में क्रांति लाने के लिए काम कर रहे हैं।',
        member1Name: 'साहिल कुमार सिंह',
        member1Role: 'लीड डेवलपर',
        member1Bio: 'ब्लॉकचेन और स्वास्थ्य सेवा नवाचार के बारे में भावुक फुल-स्टैक डेवलपर। स्वास्थ्य संचार की तकनीकी वास्तुकला का नेतृत्व कर रहे हैं।',
        member2Name: 'सिद्धांत तिवारी',
        member2Role: 'डेवलपर',
        member2Bio: 'ब्लॉकचेन उत्साही और फ्रंटएंड विशेषज्ञ। रोगियों और डॉक्टरों के लिए सहज उपयोगकर्ता अनुभव बनाने पर ध्यान केंद्रित।',
        member3Name: 'अक्षित ठाकुर',
        member3Role: 'डेवलपर',
        member3Bio: 'बैकएंड विज़ार्ड सुरक्षित और कुशल डेटा हैंडलिंग सुनिश्चित करते हैं। समर्पित चिकित्सा रिकॉर्ड प्रणाली बनाने के लिए।',
        member4Name: 'शिवम राणा',
        member4Role: 'डेवलपर',
        member4Bio: 'सुरक्षा के लिए गहरी नज़र रखने वाले स्मार्ट कॉन्ट्रैक्ट डेवलपर। प्लेटफ़ॉर्म के मुख्य विकेंद्रीकृत तर्क को लागू कर रहे हैं।',
        member5Name: 'नैन्सी',
        member5Role: 'डेवलपर',
        member5Bio: 'UI/UX डिज़ाइनर और फ्रंटएंड डेवलपर सहज स्वास्थ्य सेवा इंटरफेस बना रहे हैं। पहुंच और उपयोगकर्ता-केंद्रित डिज़ाइन सुनिश्चित करना।',
      },
    },
    auth: {
      welcomeBack: 'वापसी पर स्वागत है',
      welcomeBackDescription: 'अपने सुरक्षित चिकित्सा रिकॉर्ड तक पहुंचने के लिए साइन इन करें।',
      joinSwasthya: 'स्वास्थ्य संचार में शामिल हों',
      joinSwasthyaDescription: 'अपना खाता बनाएं और अपने स्वास्थ्य डेटा पर नियंत्रण रखें।',
      emailAddress: 'ईमेल पता',
      password: 'पासवर्ड',
      confirmPassword: 'पासवर्ड की पुष्टि करें',
      enterEmail: 'अपना ईमेल दर्ज करें',
      enterPassword: 'अपना पासवर्ड दर्ज करें',
      minChars: 'न्यूनतम 8 वर्ण',
      confirmPasswordPlaceholder: 'पासवर्ड की पुष्टि करें',
      signIn: 'साइन इन करें',
      signingIn: 'साइन इन हो रहा है...',
      createAccount: 'खाता बनाएं',
      creatingAccount: 'खाता बनाया जा रहा है...',
      iAmA: 'मैं हूं...',
      patient: 'रोगी',
      doctor: 'डॉक्टर',
      invalidCredentials: 'अमान्य ईमेल या पासवर्ड',
      passwordMismatch: 'पासवर्ड मेल नहीं खाते',
      passwordMinLength: 'पासवर्ड कम से कम 8 वर्णों का होना चाहिए',
      accountCreatedButLoginFailed: 'खाता बनाया गया लेकिन साइन इन करने में विफल। कृपया लॉग इन करने का प्रयास करें।',
      errorOccurred: 'एक त्रुटि हुई। कृपया पुनः प्रयास करें।',
      dontHaveAccount: 'खाता नहीं है?',
      alreadyHaveAccount: 'पहले से खाता है?',
      createOne: 'एक बनाएं',
      signInLink: 'साइन इन करें',
      testimonial1Name: 'डॉ. सारा चेन',
      testimonial1Handle: '@drchen_md',
      testimonial1Text: 'स्वास्थ्य संचार ने आपातकाल में रोगी इतिहास तक पहुंचने के तरीके में क्रांति ला दी है।',
      testimonial2Name: 'मार्कस जॉनसन',
      testimonial2Handle: '@marcus_j',
      testimonial2Text: 'मुझे यह जानकर बहुत सुरक्षित महसूस होता है कि मेरा चिकित्सा डेटा पैरामेडिक्स के लिए तुरंत सुलभ है।',
      testimonial3Name: 'एडेन टी.',
      testimonial3Handle: '@aiden_tech',
      testimonial3Text: 'ब्लॉकचेन सुरक्षा मुझे मानसिक शांति देती है कि मेरा डेटा वास्तव में मेरा है।',
      testimonial4Name: 'एमिली आर.',
      testimonial4Handle: '@emily_nur',
      testimonial4Text: 'एक नर्स के रूप में, यह प्लेटफ़ॉर्म आपातकालीन सेवन के दौरान हमारे महत्वपूर्ण मिनट बचाता है।',
    },
    portal: {
      patientHome: {
        welcomeBack: 'वापसी पर स्वागत है',
        completeRegistration: 'अपना ब्लॉकचेन पंजीकरण पूरा करें',
        completeRegistrationDesc: 'सभी सुविधाओं को अनलॉक करने और अपने चिकित्सा रिकॉर्ड को सुरक्षित करने के लिए पंजीकरण करें।',
        registerNow: 'अभी पंजीकरण करें →',
        bodyMassIndex: 'बॉडी मास इंडेक्स (BMI)',
        bloodGroup: 'रक्त समूह',
        currentMedications: 'वर्तमान दवाएं',
        diagnosedWith: 'निदान',
        since: 'से',
        dietaryRecommendations: 'आहार सिफारिशें',
        medicationSchedule: 'दवा अनुसूची',
        dosage: 'खुराक',
        timing: 'समय',
        noProfileData: 'कोई प्रोफ़ाइल डेटा उपलब्ध नहीं है। कृपया पहले ब्लॉकचेन पर पंजीकरण करें।',
        registerFirst: 'कृपया पहले ब्लॉकचेन पर पंजीकरण करें।',
        prescribedBy: 'द्वारा निर्धारित',
        common: 'सामान्य',
        uncommon: 'असामान्य',
        rare: 'दुर्लभ',
        veryRare: 'बहुत दुर्लभ',
        extremelyRare: 'अत्यंत दुर्लभ',
        unknown: 'अज्ञात',
        underweight: 'कम वजन',
        normal: 'सामान्य',
        overweight: 'अधिक वजन',
        obese: 'मोटापा',
        doDietary: 'करें:',
        dontDietary: 'न करें:',
      },
      doctorHome: {
        welcome: 'स्वागत है',
        dashboard: 'डैशबोर्ड',
        recentPatients: 'हाल के मरीज',
        viewAll: 'सभी देखें',
        noPatients: 'अभी तक कोई मरीज नहीं',
        uploadRecords: 'रिकॉर्ड अपलोड करें',
        manageAccess: 'पहुंच प्रबंधित करें',
        totalPatients: 'कुल मरीज',
        activePermissions: 'सक्रिय अनुमतियां',
        patientsDiagnosed: 'बीमारी के अनुसार निदान किए गए मरीज',
        patients: 'मरीज',
        mostPrescribed: 'सबसे अधिक निर्धारित दवाएं',
        prescriptions: 'नुस्खे',
        totalPrescriptions: 'कुल नुस्खे',
      },
      emergency: {
        emergencyInfo: 'आपातकालीन चिकित्सा जानकारी',
        scanQRForAccess: 'चिकित्सा इतिहास तक त्वरित पहुंच के लिए QR कोड स्कैन करें',
        patientDetails: 'रोगी विवरण',
        contactInfo: 'संपर्क जानकारी',
        medicalInfo: 'चिकित्सा जानकारी',
        loading: 'लोड हो रहा है...',
        notFound: 'रोगी नहीं मिला',
        invalidAddress: 'अमान्य वॉलेट पता',
        noWallet: 'कोई वॉलेट नहीं मिला',
        noWalletDesc: 'आपके खाते में अभी तक कोई वॉलेट पता नहीं है। कृपया पहले रोगी पंजीकरण पूरा करें।',
        goToRegistration: 'पंजीकरण पर जाएं',
        medicalCard: 'आपातकालीन चिकित्सा कार्ड',
        medicalCardDesc: 'पहले उत्तरदाताओं के लिए आपकी आपातकालीन चिकित्सा जानकारी',
        yourQRCode: 'आपका आपातकालीन QR कोड',
        download: 'डाउनलोड करें',
        print: 'प्रिंट करें',
        share: 'QR कोड साझा करें',
        qrDetails: 'QR कोड विवरण',
        technicalInfo: 'तकनीकी जानकारी',
        securityFeatures: '🔒 सुरक्षा विशेषताएं',
        security1: '• ब्लॉकचेन-सुरक्षित डेटा',
        security2: '• स्कैन करने के लिए वॉलेट की आवश्यकता नहीं',
        security3: '• उत्तरदाताओं के लिए त्वरित पहुंच',
        security4: '• छेड़छाड़-रहित रिकॉर्ड',
        flipBack: 'वापस पलटने के लिए होवर करें',
        firstResponderView: 'फर्स्ट रिस्पॉन्डर व्यू',
        preview: 'आपातकालीन चिकित्सा जानकारी पूर्वावलोकन',
        testPage: 'आपातकालीन पृष्ठ का परीक्षण करें',
        howToUse: 'कैसे उपयोग करें',
        step1: 'अपना QR कोड डाउनलोड या प्रिंट करें',
        step2: 'इसे अपने बटुए या फोन केस में रखें',
        step3: 'रिस्पॉन्डर्स आपकी जानकारी तक पहुंचने के लिए स्कैन करते हैं',
        step4: 'किसी वॉलेट या क्रिप्टो ज्ञान की आवश्यकता नहीं है',
        infoShared: 'साझा की गई जानकारी',
        bestPractices: 'सर्वोत्तम प्रथाएं',
        practice1: 'वाटरप्रूफ कागज पर प्रिंट करें',
        practice2: 'कई प्रतियां रखें',
        practice3: 'यदि जानकारी बदलती है तो अपडेट करें',
        practice4: 'परिवार के सदस्यों के साथ साझा करें',
        practice5: 'फोन लॉक स्क्रीन पर जोड़ें',
        helpline: 'आपातकालीन हेल्पलाइन:',
        ambulance: 'एम्बुलेंस',
        medical: 'चिकित्सा',
        blockchainAddress: 'ब्लॉकचेन पता',
        emergencyPageUrl: 'आपातकालीन पृष्ठ URL',
        bloodType: 'रक्त प्रकार',
        allergies: 'एलर्जी',
        conditions: 'चिकित्सा स्थिति',
        emergencyContactLabel: 'आपातकालीन संपर्क',
      },
      records: {
        myRecords: 'मेरे चिकित्सा रिकॉर्ड',
        uploadNew: 'नया रिकॉर्ड अपलोड करें',
        recordType: 'रिकॉर्ड प्रकार',
        uploadedOn: 'अपलोड किया गया',
        uploadedBy: 'द्वारा अपलोड किया गया',
        noRecords: 'कोई रिकॉर्ड नहीं मिला',
        uploadFirst: 'अपना पहला चिकित्सा रिकॉर्ड अपलोड करें',
        download: 'डाउनलोड करें',
        delete: 'हटाएं',
        viewRecords: 'रिकॉर्ड देखें',
        backToDashboard: 'डैशबोर्ड पर वापस जाएं',
        myRecordsDesc: 'अपने चिकित्सा दस्तावेज़ देखें और डाउनलोड करें',
        noRecordsDesc: 'डॉक्टर द्वारा अपलोड किए जाने के बाद आपके चिकित्सा रिकॉर्ड यहां दिखाई देंगे।',
        active: 'सक्रिय',
        recordId: 'रिकॉर्ड आईडी',
        uploadDate: 'अपलोड तिथि',
        doctor: 'डॉक्टर',
        unknown: 'अज्ञात',
        ipfsHash: 'IPFS हैश',
        viewRecord: 'रिकॉर्ड देखें',
        medicalRecord: 'चिकित्सा रिकॉर्ड',
      },
      permissions: {
        doctorAccess: 'डॉक्टर पहुंच प्रबंधन',
        grantAccess: 'पहुंच प्रदान करें',
        revokeAccess: 'पहुंच रद्द करें',
        doctorName: 'डॉक्टर का नाम',
        accessGranted: 'पहुंच प्रदान की गई',
        accessExpires: 'पहुंच समाप्त होती है',
        noDoctors: 'किसी भी डॉक्टर के पास पहुंच नहीं है',
        grantAccessFirst: 'अपने रिकॉर्ड देखने के लिए डॉक्टरों को पहुंच प्रदान करें',
        active: 'सक्रिय',
        expired: 'समाप्त',
      },
      upload: {
        uploadRecords: 'चिकित्सा रिकॉर्ड अपलोड करें',
        selectPatient: 'मरीज चुनें',
        selectFile: 'फ़ाइल चुनें',
        recordType: 'रिकॉर्ड प्रकार',
        uploadButton: 'अपलोड करें',
        uploading: 'अपलोड हो रहा है...',
        success: 'अपलोड सफल',
        error: 'अपलोड विफल',
        noPatients: 'कोई मरीज नहीं मिला',
        selectPatientFirst: 'कृपया पहले एक मरीज का चयन करें',
        pageTitle: 'चिकित्सा रिकॉर्ड अपलोड करें',
        pageDescription: 'उन मरीजों के लिए चिकित्सा रिकॉर्ड अपलोड करें जिन्होंने आपको पहुंच प्रदान की है',
        uploadNew: 'नया रिकॉर्ड अपलोड करें',
        categoryLabel: 'श्रेणी',
        categoryPlaceholder: 'श्रेणी चुनें...',
        uploadFileLabel: 'फाइल अपलोड करें',
        descriptionLabel: 'विवरण (वैकल्पिक)',
        descriptionPlaceholder: 'कोई नोट या विवरण जोड़ें...',
        recentUploads: 'हाल के अपलोड',
        noUploads: 'अभी तक कोई अपलोड नहीं',
        fileSizeError: 'फाइल का आकार 10MB से कम होना चाहिए',
        fillAllFields: 'कृपया सभी आवश्यक क्षेत्र भरें',
        supportedFormats: 'समर्थित: PDF, JPG, PNG, DOC, DOCX • अधिकतम 10MB',
      },
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
      emergency: 'आणीबाणी',
      medicalRecords: 'वैद्यकीय रेकॉर्ड',
      doctorAccess: 'डॉक्टर प्रवेश',
      patients: 'रुग्ण',
      uploadRecords: 'रेकॉर्ड अपलोड करा',
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
    landing: {
      hero: {
        title1: 'तुमची आरोग्य ओळख,',
        title2: 'विकेंद्रित आणि सुरक्षित.',
        description: 'तुम्हाला तुमच्या वैद्यकीय इतिहासाची संपूर्ण मालकी प्रदान करणे. प्रथम प्रतिसादकर्त्यांसाठी त्वरित आणीबाणी प्रवेश, डॉक्टरांसाठी अखंड सामायिकरण, आणि डिझाइनद्वारे गोपनीयता.',
        signIn: 'साइन इन करा',
        createAccount: 'खाते तयार करा',
        checkingAuth: 'प्रमाणीकरण तपासत आहे...',
      },
      howItWorks: {
        title: 'हे कसे कार्य करते',
        description: 'नोंदणीपासून जीवन वाचवणाऱ्या आणीबाणी प्रवेशापर्यंत चार सोप्या पायऱ्या. पहा की ब्लॉकचेन तंत्रज्ञान तुम्हाला कसे सशक्त करते आणि तुमच्या गोपनीयतेचे संरक्षण करते.',
        step1Title: '1. खाते तयार करा',
        step1Content: 'तुमचा ईमेल वापरून सुरक्षितपणे साइन अप करा. आम्ही रुग्ण आणि आरोग्य सेवा प्रदात्यांचे विश्वसनीय नेटवर्क सुनिश्चित करण्यासाठी तुमची ओळख सत्यापित करतो.',
        step2Title: '2. वैद्यकीय इतिहास जोडा',
        step2Content: 'तुमचे विद्यमान रेकॉर्ड, ऍलर्जी आणि औषधे अपलोड करा. तुमचा डेटा एन्क्रिप्ट केलेला आहे आणि ब्लॉकचेनवर संग्रहित आहे, फक्त तुमच्या मालकीचा.',
        step3Title: '3. तुमचा QR कोड मिळवा',
        step3Content: 'तुमच्या प्रोफाइलशी जोडलेला एक अनन्य QR कोड प्राप्त करा. महत्त्वाच्या माहितीच्या जलद, सुरक्षित सामायिकरणाची ही तुमची किल्ली आहे.',
        step4Title: '4. आणीबाणी प्रवेश',
        step4Content: 'आणीबाणीच्या वेळी, प्रथम प्रतिसादकर्ते रक्तगट आणि ऍलर्जी यासारख्या गंभीर जीवन वाचवणाऱ्या डेटामध्ये त्वरित प्रवेश करण्यासाठी तुमचा QR कोड स्कॅन करतात.',
      },
      blockchain: {
        title: 'आरोग्यसेवेसाठी ब्लॉकचेन का?',
        description: 'पारंपारिक प्रणाली जेव्हा तुम्हाला त्यांची सर्वात जास्त गरज असते तेव्हा अपयशी ठरतात. येथे आम्हाला काय वेगळे बनवते ते आहे.',
        feature1Title: 'तुम्ही तुमच्या डेटाचे मालक आहात',
        feature1Description: 'कोणतेही रुग्णालय, कोणतीही सरकार, कोणतीही कॉर्पोरेशन तुमच्या आरोग्य रेकॉर्डची मालक नाही. फक्त तुम्ही तुमच्या खाजगी कीसह नियंत्रित करता की कोण काय पाहतो.',
        feature2Title: 'आणीबाणी तयार',
        feature2Description: 'तुमच्या आयडीवरील QR कोड प्रथम प्रतिसादकर्त्यांना ऍलर्जी आणि रक्तगट यासारख्या जीवन वाचवणाऱ्या माहितीमध्ये त्वरित प्रवेश देतो—वॉलेट किंवा लॉगिनची आवश्यकता नाही.',
        feature3Title: 'कायमस्वरूपी आणि पोर्टेबल',
        feature3Description: 'तुमचे रेकॉर्ड कायमचे ब्लॉकचेनवर राहतात. रुग्णालय बदलणे? शहर हलवणे? तुमचा इतिहास कागदपत्रे पाठवल्याशिवाय आपोआप तुमच्या सोबत येतो.',
        feature4Title: 'संमती आधारित सामायिकरण',
        feature4Description: 'विशिष्ट डॉक्टरांना मर्यादित कालावधीसाठी तुमचे रेकॉर्ड पाहण्यासाठी अधिकृत करा. कधीही प्रवेश रद्द करा. प्रत्येक प्रवेश पारदर्शकपणे लॉग केला जातो.',
        feature5Title: 'जागतिक प्रवेश',
        feature5Description: 'परदेशात प्रवास? तुमचा वैद्यकीय इतिहास जगभर उपलब्ध आहे, भाषा आणि प्रणालीच्या अडथळ्यांना तोडत.',
        feature6Title: 'छेडछाड-प्रूफ',
        feature6Description: 'ब्लॉकचेन सुनिश्चित करते की तुमचे रेकॉर्ड दुर्भावनापूर्ण कलाकारांद्वारे बदलले किंवा हटवले जाऊ शकत नाहीत. प्रत्येक परस्परसंवादाचा संपूर्ण ऑडिट ट्रेल.',
      },
      team: {
        title: 'टीमला भेटा',
        description: 'स्वास्थ्य संचाराच्या मागे असलेले उत्कट विकासक जे आरोग्य डेटा प्रवेशात क्रांती घडवण्यासाठी कार्य करत आहेत.',
        member1Name: 'साहिल कुमार सिंह',
        member1Role: 'लीड डेव्हलपर',
        member1Bio: 'ब्लॉकचेन आणि आरोग्य सेवा नवकल्पनाबद्दल उत्कट फुल-स्टॅक डेव्हलपर. स्वास्थ्य संचाराच्या तांत्रिक वास्तुकलाचे नेतृत्व करत आहे.',
        member2Name: 'सिद्धांत तिवारी',
        member2Role: 'डेव्हलपर',
        member2Bio: 'ब्लॉकचेन उत्साही आणि फ्रंटएंड तज्ञ. रुग्ण आणि डॉक्टरांसाठी अखंड वापरकर्ता अनुभव तयार करण्यावर लक्ष केंद्रित.',
        member3Name: 'अक्षित ठाकूर',
        member3Role: 'डेव्हलपर',
        member3Bio: 'बॅकएंड विझार्ड सुरक्षित आणि कार्यक्षम डेटा हाताळणी सुनिश्चित करतो. मजबूत वैद्यकीय रेकॉर्ड प्रणाली तयार करण्यासाठी समर्पित.',
        member4Name: 'शिवम राणा',
        member4Role: 'डेव्हलपर',
        member4Bio: 'सुरक्षेसाठी तीक्ष्ण नजर असलेले स्मार्ट कॉन्ट्रॅक्ट डेव्हलपर. प्लॅटफॉर्मचे मुख्य विकेंद्रित तर्क अंमलात आणत आहे.',
        member5Name: 'नॅन्सी',
        member5Role: 'डेव्हलपर',
        member5Bio: 'UI/UX डिझायनर आणि फ्रंटएंड डेव्हलपर सहज आरोग्य सेवा इंटरफेस तयार करत आहे. प्रवेशयोग्यता आणि वापरकर्ता-केंद्रित डिझाइन सुनिश्चित करणे.',
      },
    },
    auth: {
      welcomeBack: 'परत स्वागत आहे',
      welcomeBackDescription: 'तुमच्या सुरक्षित वैद्यकीय रेकॉर्डमध्ये प्रवेश करण्यासाठी साइन इन करा.',
      joinSwasthya: 'स्वास्थ्य संचारात सामील व्हा',
      joinSwasthyaDescription: 'तुमचे खाते तयार करा आणि तुमच्या आरोग्य डेटावर नियंत्रण ठेवा.',
      emailAddress: 'ईमेल पत्ता',
      password: 'पासवर्ड',
      confirmPassword: 'पासवर्डची पुष्टी करा',
      enterEmail: 'तुमचा ईमेल प्रविष्ट करा',
      enterPassword: 'तुमचा पासवर्ड प्रविष्ट करा',
      minChars: 'किमान 8 वर्ण',
      confirmPasswordPlaceholder: 'पासवर्डची पुष्टी करा',
      signIn: 'साइन इन करा',
      signingIn: 'साइन इन करत आहे...',
      createAccount: 'खाते तयार करा',
      creatingAccount: 'खाते तयार करत आहे...',
      iAmA: 'मी आहे...',
      patient: 'रुग्ण',
      doctor: 'डॉक्टर',
      invalidCredentials: 'अवैध ईमेल किंवा पासवर्ड',
      passwordMismatch: 'पासवर्ड जुळत नाहीत',
      passwordMinLength: 'पासवर्ड किमान 8 वर्णांचा असणे आवश्यक आहे',
      accountCreatedButLoginFailed: 'खाते तयार केले परंतु साइन इन करण्यात अयशस्वी. कृपया लॉग इन करण्याचा प्रयत्न करा.',
      errorOccurred: 'एक त्रुटी आली. कृपया पुन्हा प्रयत्न करा.',
      dontHaveAccount: 'खाते नाही?',
      alreadyHaveAccount: 'आधीपासूनच खाते आहे?',
      createOne: 'एक तयार करा',
      signInLink: 'साइन इन करा',
      testimonial1Name: 'डॉ. सारा चेन',
      testimonial1Handle: '@drchen_md',
      testimonial1Text: 'स्वास्थ्य संचाराने आणीबाणीमध्ये रुग्ण इतिहासात प्रवेश करण्याच्या पद्धतीत क्रांती घडवली आहे.',
      testimonial2Name: 'मार्कस जॉन्सन',
      testimonial2Handle: '@marcus_j',
      testimonial2Text: 'माझा वैद्यकीय डेटा पॅरामेडिक्ससाठी त्वरित उपलब्ध आहे हे जाणून मला खूप सुरक्षित वाटते.',
      testimonial3Name: 'एडन टी.',
      testimonial3Handle: '@aiden_tech',
      testimonial3Text: 'ब्लॉकचेन सुरक्षा मला मानसिक शांती देते की माझा डेटा खरोखर माझा आहे.',
      testimonial4Name: 'एमिली आर.',
      testimonial4Handle: '@emily_nur',
      testimonial4Text: 'एक नर्स म्हणून, हे प्लॅटफॉर्म आणीबाणी सेवन दरम्यान आमचे महत्त्वाचे मिनिटे वाचवते.',
    },
    portal: {
      patientHome: {
        welcomeBack: 'परत स्वागत आहे',
        completeRegistration: 'तुमचे ब्लॉकचेन नोंदणी पूर्ण करा',
        completeRegistrationDesc: 'सर्व वैशिष्ट्ये अनलॉक करण्यासाठी आणि तुमचे वैद्यकीय रेकॉर्ड सुरक्षित करण्यासाठी नोंदणी करा.',
        registerNow: 'आता नोंदणी करा →',
        bodyMassIndex: 'बॉडी मास इंडेक्स (BMI)',
        bloodGroup: 'रक्तगट',
        currentMedications: 'वर्तमान औषधे',
        diagnosedWith: 'निदान',
        since: 'पासून',
        dietaryRecommendations: 'आहार शिफारसी',
        medicationSchedule: 'औषध वेळापत्रक',
        dosage: 'डोस',
        timing: 'वेळ',
        noProfileData: 'कोणतीही प्रोफाइल डेटा उपलब्ध नाही. कृपया प्रथम ब्लॉकचेनवर नोंदणी करा.',
        registerFirst: 'कृपया प्रथम ब्लॉकचेनवर नोंदणी करा.',
        prescribedBy: 'द्वारे विहित',
        common: 'सामान्य',
        uncommon: 'असामान्य',
        rare: 'दुर्मिळ',
        veryRare: 'अत्यंत दुर्मिळ',
        extremelyRare: 'अत्यंत दुर्मिळ',
        unknown: 'अज्ञात',
        underweight: 'कमी वजन',
        normal: 'सामान्य',
        overweight: 'जास्त वजन',
        obese: 'लठ्ठपणा',
        doDietary: 'करा:',
        dontDietary: 'नको:',
      },
      doctorHome: {
        welcome: 'स्वागत आहे',
        dashboard: 'डॅशबोर्ड',
        recentPatients: 'अलीकडील रुग्ण',
        viewAll: 'सर्व पहा',
        noPatients: 'अदून कोणतेही रुग्ण नाहीत',
        uploadRecords: 'रेकॉर्ड अपलोड करा',
        manageAccess: 'प्रवेश व्यवस्थापित करा',
        totalPatients: 'एकूण रुग्ण',
        activePermissions: 'सक्रिय परवानग्या',
        patientsDiagnosed: 'रोगांनुसार निदान झालेले रुग्ण',
        patients: 'रुग्ण',
        mostPrescribed: 'सर्वाधिक लिहून दिलेली औषधे',
        prescriptions: 'प्रिस्क्रिप्शन',
        totalPrescriptions: 'एकूण प्रिस्क्रिप्शन',
      },
      emergency: {
        emergencyInfo: 'आणीबाणी वैद्यकीय माहिती',
        scanQRForAccess: 'वैद्यकीय इतिहासात त्वरित प्रवेशासाठी QR कोड स्कॅन करा',
        patientDetails: 'रुग्णाचे तपशील',
        contactInfo: 'संपर्क माहिती',
        medicalInfo: 'वैद्यकीय माहिती',
        loading: 'लोड होत आहे...',
        notFound: 'रुग्ण सापडला नाही',
        invalidAddress: 'अवैध वॉलेट पत्ता',
        noWallet: 'वॉलेट सापडले नाही',
        noWalletDesc: 'तुमच्या खात्यात अद्याप वॉलेट पत्ता नाही. कृपया प्रथम रुग्ण नोंदणी पूर्ण करा.',
        goToRegistration: 'नोंदणीवर जा',
        medicalCard: 'आणीबाणी वैद्यकीय कार्ड',
        medicalCardDesc: 'पहिल्या प्रतिसादकर्त्यांसाठी तुमची आणीबाणी वैद्यकीय माहिती',
        yourQRCode: 'तुमचा आणीबाणी QR कोड',
        download: 'डाउनलोड करा',
        print: 'प्रिंट करा',
        share: 'QR कोड शेअर करा',
        qrDetails: 'QR कोड तपशील',
        technicalInfo: 'तांत्रिक माहिती',
        securityFeatures: '🔒 सुरक्षा वैशिष्ट्ये',
        security1: '• ब्लॉकचेन-सुरक्षित डेटा',
        security2: '• स्कॅन करण्यासाठी वॉलेटची आवश्यकता नाही',
        security3: '• प्रतिसादकर्त्यांसाठी त्वरित प्रवेश',
        security4: '• फेरफार-मुक्त रेकॉर्ड',
        flipBack: 'परत फिरवण्यासाठी होवर करा',
        firstResponderView: 'फर्स्ट रिस्पॉन्डर व्ह्यू',
        preview: 'आणीबाणी वैद्यकीय माहिती पूर्वावलोकन',
        testPage: 'आणीबाणी पृष्ठाची चाचणी करा',
        howToUse: 'कसे वापरावे',
        step1: 'तुमचा QR कोड डाउनलोड करा किंवा प्रिंट करा',
        step2: 'ते तुमच्या पाकीटात किंवा फोन केसमध्ये ठेवा',
        step3: 'रिस्पॉन्डर्स तुमच्या माहितीमध्ये प्रवेश करण्यासाठी स्कॅन करतात',
        step4: 'कोणत्याही वॉलेट किंवा क्रिप्टो ज्ञानाची आवश्यकता नाही',
        infoShared: 'शेअर केलेली माहिती',
        bestPractices: 'सर्वोत्तम पद्धती',
        practice1: 'वॉटरप्रूफ कागदावर प्रिंट करा',
        practice2: 'अनेक प्रती ठेवा',
        practice3: 'माहिती बदलल्यास अपडेट करा',
        practice4: 'कुटुंबातील सदस्यांसह शेअर करा',
        practice5: 'फोन लॉक स्क्रीनवर जोडा',
        helpline: 'आणीबाणी हेल्पलाइन:',
        ambulance: ' रुग्णवाहिका',
        medical: 'वैद्यकीय',
        blockchainAddress: 'ब्लॉकचेन पत्ता',
        emergencyPageUrl: 'आणीबाणी पृष्ठ URL',
        bloodType: 'रक्त प्रकार',
        allergies: 'ऍलर्जी',
        conditions: 'वैद्यकीय स्थिती',
        emergencyContactLabel: 'आणीबाणी संपर्क',
      },
      records: {
        myRecords: 'माझे वैद्यकीय रेकॉर्ड',
        uploadNew: 'नवा रेकॉर्ड अपलोड करा',
        recordType: 'रेकॉर्ड प्रकार',
        uploadedOn: 'अपलोड केले',
        uploadedBy: 'द्वारे अपलोड केले',
        noRecords: 'कोणतेही रेकॉर्ड सापडले नाहीत',
        uploadFirst: 'तुमचे पहिले वैद्यकीय रेकॉर्ड अपलोड करा',
        download: 'डाउनलोड करा',
        delete: 'हटवा',
        viewRecords: 'रेकॉर्ड पहा',
        backToDashboard: 'डॅशबोर्डवर परत जा',
        myRecordsDesc: 'तुमचे वैद्यकीय दस्तऐवज पहा आणि डाउनलोड करा',
        noRecordsDesc: 'डॉ डॉक्टरांनी अपलोड केल्यानंतर तुमचे वैद्यकीय रेकॉर्ड येथे दिसतील.',
        active: 'सक्रिय',
        recordId: 'रेकॉर्ड आयडी',
        uploadDate: 'अपलोड तारीख',
        doctor: 'डॉक्टर',
        unknown: 'अज्ञात',
        ipfsHash: 'IPFS हॅश',
        viewRecord: 'रेकॉर्ड पहा',
        medicalRecord: 'वैद्यकीय रेकॉर्ड',
      },
      permissions: {
        doctorAccess: 'डॉक्टर प्रवेश व्यवस्थापन',
        grantAccess: 'प्रवेश द्या',
        revokeAccess: 'प्रवेश रद्द करा',
        doctorName: 'डॉक्टराचे नाव',
        accessGranted: 'प्रवेश दिला',
        accessExpires: 'प्रवेश संपतो',
        noDoctors: 'कोणत्याही डॉक्टरांना प्रवेश नाही',
        grantAccessFirst: 'तुमचे रेकॉर्ड पाहण्यासाठी डॉक्टरांना प्रवेश द्या',
        active: 'सक्रिय',
        expired: 'संपले',
      },
      upload: {
        uploadRecords: 'वैद्यकीय रेकॉर्ड अपलोड करा',
        selectPatient: 'रुग्ण निवडा',
        selectFile: 'फाइल निवडा',
        recordType: 'रेकॉर्ड प्रकार',
        uploadButton: 'अपलोड करा',
        uploading: 'अपलोड होत आहे...',
        success: 'अपलोड यशस्वी',
        error: 'अपलोड अयशस्वी',
        noPatients: 'कोणतेही रुग्ण आढळले नाहीत',
        selectPatientFirst: 'कृपया आधी रुग्ण निवडा',
        pageTitle: 'वैद्यकीय रेकॉर्ड अपलोड करा',
        pageDescription: 'ज्या रुग्णांनी तुम्हाला ऍक्सेस दिले आहे त्यांच्यासाठी वैद्यकीय रेकॉर्ड अपलोड करा',
        uploadNew: 'नवीन रेकॉर्ड अपलोड करा',
        categoryLabel: 'श्रेणी',
        categoryPlaceholder: 'श्रेणी निवडा...',
        uploadFileLabel: 'फाइल अपलोड करा',
        descriptionLabel: 'वर्णन (वैकल्पिक)',
        descriptionPlaceholder: 'कोणतीही टीप किंवा वर्णन जोडा...',
        recentUploads: 'अलीकडील अपलोड',
        noUploads: 'अद्याप कोणतेही अपलोड नाहीत',
        fileSizeError: 'फाइलचा आकार 10MB पेक्षा कमी असावा',
        fillAllFields: 'कृपया सर्व आवश्यक फील्ड भरा',
        supportedFormats: 'समर्थित: PDF, JPG, PNG, DOC, DOCX • कमाल 10MB',
      },
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
      emergency: 'आपातकाल',
      medicalRecords: 'चिकित्सा रिकॉर्ड',
      doctorAccess: 'डॉक्टर पहुंच',
      patients: 'मरीज',
      uploadRecords: 'रिकॉर्ड अपलोड करीं',
    },
    common: {
      save: 'सेव करीं',
      cancel: 'रद्द करीं',
      edit: 'एडित करीं',
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
    landing: {
      hero: {
        title1: 'रउआ के स्वास्थ्य पहचान,',
        title2: 'विकेंद्रीकृत आ सुरक्षित।',
        description: 'रउआ के अपना चिकित्सा इतिहास के पूरा स्वामित्व देवल। प्रथम उत्तरदाता खातिर तुरंत आपातकालीन पहुंच, डॉक्टर खातिर सहज साझाकरण, आ डिज़ाइन से गोपनीयता।',
        signIn: 'साइन इन करीं',
        createAccount: 'खाता बनाईं',
        checkingAuth: 'प्रमाणीकरण जांच रहल बा...',
      },
      howItWorks: {
        title: 'ई कइसे काम करेला',
        description: 'पंजीकरण से लेके जीवन बचावे वाला आपातकालीन पहुंच तक चार सरल कदम। देखीं कि ब्लॉकचेन तकनीक रउआ के कइसे सशक्त बनावेला आ रउआ के गोपनीयता के रक्षा करेला।',
        step1Title: '1. खाता बनाईं',
        step1Content: 'अपना ईमेल के इस्तेमाल करके सुरक्षित तरीका से साइन अप करीं। हम मरीज आ स्वास्थ्य सेवा प्रदाता के विश्वसनीय नेटवर्क सुनिश्चित करे खातिर रउआ के पहचान सत्यापित करीला।',
        step2Title: '2. चिकित्सा इतिहास जोड़ीं',
        step2Content: 'अपना मौजूदा रिकॉर्ड, एलर्जी आ दवाई अपलोड करीं। रउआ के डेटा एन्क्रिप्ट बा आ ब्लॉकचेन पर संग्रहीत बा, सिर्फ रउआ के स्वामित्व में।',
        step3Title: '3. अपना QR कोड पाईं',
        step3Content: 'अपना प्रोफाइल से जुड़ल एगो अनोखा QR कोड पाईं। ई महत्वपूर्ण जानकारी के तुरंत, सुरक्षित साझाकरण के रउआ के चाभी बा।',
        step4Title: '4. आपातकालीन पहुंच',
        step4Content: 'आपातकाल में, प्रथम उत्तरदाता खून के समूह आ एलर्जी जइसन महत्वपूर्ण जीवन बचावे वाला डेटा तक तुरंत पहुंचे खातिर रउआ के QR कोड स्कैन करेला।',
      },
      blockchain: {
        title: 'स्वास्थ्य सेवा खातिर ब्लॉकचेन काहे?',
        description: 'पारंपरिक प्रणाली तब विफल हो जाला जब रउआ के ओकर सबसे जादे जरूरत होला। इहां बतावल गइल बा कि हमनी के का अलग बनावेला।',
        feature1Title: 'रउआ अपना डेटा के मालिक बानी',
        feature1Description: 'कवनो अस्पताल, कवनो सरकार, कवनो निगम रउआ के स्वास्थ्य रिकॉर्ड के मालिक ना बा। सिर्फ रउआ अपना निजी कुंजी से नियंत्रित करीला कि के का देखेला।',
        feature2Title: 'आपातकालीन तैयार',
        feature2Description: 'रउआ के आईडी पर QR कोड प्रथम उत्तरदाता के एलर्जी आ खून के समूह जइसन जीवन बचावे वाला जानकारी तक तुरंत पहुंच देला—बिना वॉलेट या लॉगिन के जरूरत के।',
        feature3Title: 'स्थायी आ पोर्टेबल',
        feature3Description: 'रउआ के रिकॉर्ड हमेशा खातिर ब्लॉकचेन पर रहेला। अस्पताल बदलीं? शहर बदलीं? रउआ के इतिहास बिना कागजात भेजले अपने आप रउआ के साथ चलेला।',
        feature4Title: 'सहमति आधारित साझाकरण',
        feature4Description: 'विशिष्ट डॉक्टर के सीमित समय खातिर रउआ के रिकॉर्ड देखे के अधिकृत करीं। कवनो भी समय पहुंच रद्द करीं। हर पहुंच पारदर्शी तरीका से लॉग कइल जाला।',
        feature5Title: 'वैश्विक पहुंच',
        feature5Description: 'विदेश यात्रा? रउआ के चिकित्सा इतिहास दुनिया भर में उपलब्ध बा, भाषा आ प्रणाली के बाधा के पार करत।',
        feature6Title: 'छेड़छाड़-प्रूफ',
        feature6Description: 'ब्लॉकचेन सुनिश्चित करेला कि रउआ के रिकॉर्ड दुर्भावनापूर्ण अभिनेता द्वारा बदलल या हटावल ना जा सकेला। हर बातचीत के पूरा ऑडिट ट्रेल।',
      },
      team: {
        title: 'टीम से मिलीं',
        description: 'स्वास्थ्य संचार के पीछे के भावुक डेवलपर जवन स्वास्थ्य डेटा पहुंच में क्रांति लावे खातिर काम कर रहल बा।',
        member1Name: 'साहिल कुमार सिंह',
        member1Role: 'लीड डेवलपर',
        member1Bio: 'ब्लॉकचेन आ स्वास्थ्य सेवा नवाचार के बारे में भावुक फुल-स्टैक डेवलपर। स्वास्थ्य संचार के तकनीकी वास्तुकला के नेतृत्व कर रहल बा।',
        member2Name: 'सिद्धांत तिवारी',
        member2Role: 'डेवलपर',
        member2Bio: 'ब्लॉकचेन उत्साही आ फ्रंटएंड विशेषज्ञ। मरीज आ डॉक्टर खातिर सहज उपयोगकर्ता अनुभव बनावे पर ध्यान केंद्रित।',
        member3Name: 'अक्षित ठाकुर',
        member3Role: 'डेवलपर',
        member3Bio: 'बैकएंड विज़ार्ड सुरक्षित आ कुशल डेटा हैंडलिंग सुनिश्चित करेला। मजबूत चिकित्सा रिकॉर्ड प्रणाली बनावे खातिर समर्पित।',
        member4Name: 'शिवम राणा',
        member4Role: 'डेवलपर',
        member4Bio: 'सुरक्षा खातिर गहरी नजर रखे वाला स्मार्ट कॉन्ट्रैक्ट डेवलपर। प्लेटफॉर्म के मुख्य विकेंद्रीकृत तर्क लागू कर रहल बा।',
        member5Name: 'नैन्सी',
        member5Role: 'डेवलपर',
        member5Bio: 'UI/UX डिज़ाइनर आ फ्रंटएंड डेवलपर सहज स्वास्थ्य सेवा इंटरफेस बना रहल बा। पहुंच आ उपयोगकर्ता-केंद्रित डिज़ाइन सुनिश्चित करल।',
      },
    },
    auth: {
      welcomeBack: 'वापसी पर स्वागत बा',
      welcomeBackDescription: 'अपना सुरक्षित चिकित्सा रिकॉर्ड तक पहुंचे खातिर साइन इन करीं।',
      joinSwasthya: 'स्वास्थ्य संचार में शामिल होईं',
      joinSwasthyaDescription: 'अपना खाता बनाईं आ अपना स्वास्थ्य डेटा पर नियंत्रण रखीं।',
      emailAddress: 'ईमेल पता',
      password: 'पासवर्ड',
      confirmPassword: 'पासवर्ड के पुष्टि करीं',
      enterEmail: 'अपना ईमेल दर्ज करीं',
      enterPassword: 'अपना पासवर्ड दर्ज करीं',
      minChars: 'न्यूनतम 8 वर्ण',
      confirmPasswordPlaceholder: 'पासवर्ड के पुष्टि करीं',
      signIn: 'साइन इन करीं',
      signingIn: 'साइन इन हो रहल बा...',
      createAccount: 'खाता बनाईं',
      creatingAccount: 'खाता बनावल जा रहल बा...',
      iAmA: 'हम बानी...',
      patient: 'मरीज',
      doctor: 'डॉक्टर',
      invalidCredentials: 'अमान्य ईमेल या पासवर्ड',
      passwordMismatch: 'पासवर्ड मेल ना खात',
      passwordMinLength: 'पासवर्ड कम से कम 8 वर्ण के होखे के चाहीं',
      accountCreatedButLoginFailed: 'खाता बन गइल बाकिर साइन इन करे में विफल। कृपया लॉग इन करे के कोशिश करीं।',
      errorOccurred: 'एगो त्रुटि भइल। कृपया फेर से कोशिश करीं।',
      dontHaveAccount: 'खाता नइखे?',
      alreadyHaveAccount: 'पहिले से खाता बा?',
      createOne: 'एगो बनाईं',
      signInLink: 'साइन इन करीं',
      testimonial1Name: 'डॉ. सारा चेन',
      testimonial1Handle: '@drchen_md',
      testimonial1Text: 'स्वास्थ्य संचार आपातकाल में मरीज इतिहास तक पहुंचे के तरीका में क्रांति ला दिहलस।',
      testimonial2Name: 'मार्कस जॉनसन',
      testimonial2Handle: '@marcus_j',
      testimonial2Text: 'हमरा ई जान के बहुत सुरक्षित लागेला कि हमार चिकित्सा डेटा पैरामेडिक्स खातिर तुरंत उपलब्ध बा।',
      testimonial3Name: 'एडेन टी.',
      testimonial3Handle: '@aiden_tech',
      testimonial3Text: 'ब्लॉकचेन सुरक्षा हमका मानसिक शांति देला कि हमार डेटा वास्तव में हमार बा।',
      testimonial4Name: 'एमिली आर.',
      testimonial4Handle: '@emily_nur',
      testimonial4Text: 'एगो नर्स के रूप में, ई प्लेटफॉर्म आपातकालीन सेवन के दौरान हमार महत्वपूर्ण मिनट बचावेला।',
    },
    portal: {
      patientHome: {
        welcomeBack: 'वापसी पर स्वागत बा',
        completeRegistration: 'अपना ब्लॉकचेन पंजीकरण पूरा करीं',
        completeRegistrationDesc: 'सभ सुविधा अनलॉक करे खातिर आ अपना चिकित्सा रिकॉर्ड सुरक्षित करे खातिर पंजीकरण करीं।',
        registerNow: 'अभी पंजीकरण करीं →',
        bodyMassIndex: 'बॉडी मास इंडेक्स (BMI)',
        bloodGroup: 'खून के समूह',
        currentMedications: 'मौजूदा दवाई',
        diagnosedWith: 'निदान',
        since: 'से',
        dietaryRecommendations: 'आहार सिफारिश',
        medicationSchedule: 'दवाई अनुसूची',
        dosage: 'खुराक',
        timing: 'समय',
        noProfileData: 'कवनो प्रोफाइल डेटा उपलब्ध नइखे। कृपया पहिले ब्लॉकचेन पर पंजीकरण करीं।',
        registerFirst: 'कृपया पहिले ब्लॉकचेन पर पंजीकरण करीं।',
        prescribedBy: 'द्वारा निर्धारित',
        common: 'सामान्य',
        uncommon: 'असामान्य',
        rare: 'दुर्लभ',
        veryRare: 'बहुत दुर्लभ',
        extremelyRare: 'अत्यंत दुर्लभ',
        unknown: 'अज्ञात',
        underweight: 'कम वजन',
        normal: 'सामान्य',
        overweight: 'जादे वजन',
        obese: 'मोटापा',
        doDietary: 'करीं:',
        dontDietary: 'न करीं:',
      },
      doctorHome: {
        welcome: 'स्वागत बा',
        dashboard: 'डैशबोर्ड',
        recentPatients: 'हाल के मरीज',
        viewAll: 'सभ देखीं',
        noPatients: 'अभी तक कवनो मरीज नइखे',
        uploadRecords: 'रिकॉर्ड अपलोड करीं',
        manageAccess: 'पहुंच प्रबंधित करीं',
        totalPatients: 'कुल मरीज',
        activePermissions: 'सक्रिय अनुमति',
        patientsDiagnosed: 'बीमारी के हिसाब से मरीज',
        patients: 'मरीज',
        mostPrescribed: 'सबसे जादे लिखल गइल दवाई',
        prescriptions: 'परचा',
        totalPrescriptions: 'कुल परचा',
      },
      emergency: {
        emergencyInfo: 'आपातकालीन चिकित्सा जानकारी',
        scanQRForAccess: 'चिकित्सा इतिहास तुरंत देखे खातिर QR कोड स्कैन करीं',
        patientDetails: 'मरीज के विवरण',
        contactInfo: 'संपर्क जानकारी',
        medicalInfo: 'चिकित्सा जानकारी',
        loading: 'लोड हो रहल बा...',
        notFound: 'मरीज ना मिलल',
        invalidAddress: 'अमान्य वॉलेट पता',
        noWallet: 'कवनो वॉलेट ना मिलल',
        noWalletDesc: 'रउरा खाता में अबही ले कवनो वॉलेट पता नइखे। कृपया पहिले मरीज पंजीकरण पूरा करीं।',
        goToRegistration: 'पंजीकरण पर जाईं',
        medicalCard: 'आपातकालीन चिकित्सा कार्ड',
        medicalCardDesc: 'पहिला उत्तरदाता लोग खातिर रउरा आपातकालीन चिकित्सा जानकारी',
        yourQRCode: 'रउरा आपातकालीन QR कोड',
        download: 'डाउनलोड करीं',
        print: 'प्रिंट करीं',
        share: 'QR कोड साझा करीं',
        qrDetails: 'QR कोड विवरण',
        technicalInfo: 'तकनीकी जानकारी',
        securityFeatures: '🔒 सुरक्षा विशेषता',
        security1: '• ब्लॉकचेन-सुरक्षित डेटा',
        security2: '• स्कैन करे खातिर वॉलेट के जरूरत नइखे',
        security3: '• उत्तरदाता लोग खातिर तुरंत पहुंच',
        security4: '• छेड़छाड़-रहित रिकॉर्ड',
        flipBack: 'वापस पलटे खातिर होवर करीं',
        firstResponderView: 'फर्स्ट रिस्पॉन्डर व्यू',
        preview: 'आपातकालीन चिकित्सा जानकारी पूर्वावलोकन',
        testPage: 'आपातकालीन पन्ना के टेस्ट करीं',
        howToUse: 'कईसे इस्तेमाल करीं',
        step1: 'अपना QR कोड डाउनलोड या प्रिंट करीं',
        step2: 'एकरा के अपना बटुआ या फोन केस में राखीं',
        step3: 'रिस्पॉन्डर लोग रउरा जानकारी तक पहुंचे खातिर स्कैन करेला',
        step4: 'कवनो वॉलेट या क्रिप्टो ज्ञान के जरूरत नइखे',
        infoShared: 'साझा कइल गइल जानकारी',
        bestPractices: 'सर्वोत्तम प्रथा',
        practice1: 'वाटरप्रूफ कागज पर प्रिंट करीं',
        practice2: 'कई गो कॉपी राखीं',
        practice3: 'अगर जानकारी बदलेला त अपडेट करीं',
        practice4: 'परिवार के सदस्य लोग के साथ साझा करीं',
        practice5: 'फोन लॉक स्क्रीन पर जोड़ीं',
        helpline: 'आपातकालीन हेल्पलाइन:',
        ambulance: 'एम्बुलेंस',
        medical: 'चिकित्सा',
        blockchainAddress: 'ब्लॉकचेन पता',
        emergencyPageUrl: 'आपातकालीन पन्ना URL',
        bloodType: 'खून के प्रकार',
        allergies: 'एलर्जी',
        conditions: 'बीमारी',
        emergencyContactLabel: 'आपातकालीन संपर्क',
      },
      records: {
        myRecords: 'हमार चिकित्सा रिकॉर्ड',
        uploadNew: 'नया रिकॉर्ड अपलोड करीं',
        recordType: 'रिकॉर्ड प्रकार',
        uploadedOn: 'अपलोड कइल गइल',
        uploadedBy: 'द्वारा अपलोड कइल गइल',
        noRecords: 'कवनो रिकॉर्ड ना मिलल',
        uploadFirst: 'अपना पहिला चिकित्सा रिकॉर्ड अपलोड करीं',
        download: 'डाउनलोड करीं',
        delete: 'हटाईं',
        viewRecords: 'रिकॉर्ड देखीं',
        backToDashboard: 'डैशबोर्ड पर वापस जाईं',
        myRecordsDesc: 'अपना चिकित्सा दस्तावेज़ देखीं आ डाउनलोड करीं',
        noRecordsDesc: 'डॉक्टर द्वारा अपलोड कइला के बाद रउरा चिकित्सा रिकॉर्ड इहवां लउकी।',
        active: 'सक्रिय',
        recordId: 'रिकॉर्ड आईडी',
        uploadDate: 'अपलोड तारीख',
        doctor: 'डॉक्टर',
        unknown: 'अज्ञात',
        ipfsHash: 'IPFS हैश',
        viewRecord: 'रिकॉर्ड देखीं',
        medicalRecord: 'चिकित्सा रिकॉर्ड',
      },
      permissions: {
        doctorAccess: 'डॉक्टर पहुंच प्रबंधन',
        grantAccess: 'पहुंच दीं',
        revokeAccess: 'पहुंच रद्द करीं',
        doctorName: 'डॉक्टर के नाम',
        accessGranted: 'पहुंच देल गइल',
        accessExpires: 'पहुंच समाप्त होएला',
        noDoctors: 'कवनो भी डॉक्टर के पास पहुंच नइखे',
        grantAccessFirst: 'अपना रिकॉर्ड देखे खातिर डॉक्टर के पहुंच दीं',
        active: 'सक्रिय',
        expired: 'समाप्त',
      },
      upload: {
        uploadRecords: 'चिकित्सा रिकॉर्ड अपलोड करीं',
        selectPatient: 'मरीज चुनीं',
        selectFile: 'फाइल चुनीं',
        recordType: 'रिकॉर्ड प्रकार',
        uploadButton: 'अपलोड करीं',
        uploading: 'अपलोड हो रहल बा...',
        success: 'अपलोड सफल',
        error: 'अपलोड विफल',
        noPatients: 'कवनो मरीज ना मिलल',
        selectPatientFirst: 'रउरा पहिले एगो मरीज के चुनीं',
        pageTitle: 'चिकित्सा रिकॉर्ड अपलोड करीं',
        pageDescription: 'ओह मरीज लोग खातिर चिकित्सा रिकॉर्ड अपलोड करीं जे रउरा के पहुंच देले बाड़े',
        uploadNew: 'नया रिकॉर्ड अपलोड करीं',
        categoryLabel: 'श्रेणी',
        categoryPlaceholder: 'श्रेणी चुनीं...',
        uploadFileLabel: 'फाइल अपलोड करीं',
        descriptionLabel: 'विवरण (वैकल्पिक)',
        descriptionPlaceholder: 'कवनो नोट या विवरण जोड़ीं...',
        recentUploads: 'हाल के अपलोड',
        noUploads: 'अभी तक कवनो अपलोड नइखे',
        fileSizeError: 'फाइल के साइज 10MB से कम होखे के चाहीं',
        fillAllFields: 'कृपया सब जरूरी जानकारी भरीं',
        supportedFormats: 'समर्थित: PDF, JPG, PNG, DOC, DOCX • अधिकतम 10MB',
      },
    },
  },
}

export const languageNames: Record<Language, string> = {
  en: 'English',
  hi: 'हिन्दी',
  mr: 'मराठी',
  bh: 'भोजपुरी',
}
