import React, { createContext, useContext, useState } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, FlatList } from 'react-native';

const translations = {
  en: {
    // App Name
    appName: "AquaChain",
    tagline: "Field Data Collection Portal",
    
    // Login Screen
    login: "Login",
    signup: "Signup",
    enterName: "Enter your name",
    enterAgentId: "Enter Agent ID or Email",
    enterPassword: "Enter Password",
    accountCreated: "Account created successfully!",
    accountNotExist: "Account does not exist.",
    fillAllFields: "Please fill in all fields.",
    
    // Main Screen
    hello: "Hello",
    agentId: "Agent ID",
    whatToDo: "What would you like to do today?",
    createReport: "+ Create New Report",
    viewReports: "View Saved Reports",
    logout: "Logout",
    
    // Report Screen
    projectName: "Project Name",
    enterProjectName: "Enter project name",
    addPhoto: "Add Photo",
    getGPSLocation: "Get GPS Location",
    submit: "Submit",
    validation: "Validation",
    enterProjectNameMsg: "Please enter Project Name.",
    takePhotosMsg: "Please take at least 3 photos.",
    success: "Success!",
    reportUploaded: "Report uploaded. Server id:",
    uploadFailed: "Upload failed",
    uploadFailedMsg: "Could not reach backend. Please try again.",
    
    // Photo Modal
    datetime: "Datetime",
    gpsLatitude: "GPS Latitude",
    gpsLongitude: "GPS Longitude",
    fileSize: "File Size",
    close: "Close",
    bytes: "bytes",
    
    // Saved Reports Screen
    savedReports: "Saved Reports",
    loadingReports: "Loading reports...",
    noReports: "No reports yet.",
    status: "Status",
    photos: "Photos",
    pending: "Pending",
    retry: "Retry",
    
    // Location Errors
    locationPermission: "Permission denied",
    locationPermissionMsg: "Location permission is required for geotagging.",
    locationError: "Location Error",
    locationErrorMsg: "Could not get GPS location.",
    
    // Common
    untitled: "Untitled",
    na: "N/A",
    selectLanguage: "Select Language"
  },
  
  hi: {
    // App Name
    appName: "एक्वाचेन",
    tagline: "फील्ड डेटा कलेक्शन पोर्टल",
    
    // Login Screen
    login: "लॉगिन",
    signup: "साइनअप",
    enterName: "अपना नाम दर्ज करें",
    enterAgentId: "एजेंट आईडी या ईमेल दर्ज करें",
    enterPassword: "पासवर्ड दर्ज करें",
    accountCreated: "खाता सफलतापूर्वक बनाया गया!",
    accountNotExist: "खाता मौजूद नहीं है।",
    fillAllFields: "कृपया सभी फ़ील्ड भरें।",
    
    // Main Screen
    hello: "नमस्ते",
    agentId: "एजेंट आईडी",
    whatToDo: "आज आप क्या करना चाहेंगे?",
    createReport: "+ नई रिपोर्ट बनाएं",
    viewReports: "सहेजी गई रिपोर्ट देखें",
    logout: "लॉगआउट",
    
    // Report Screen
    projectName: "प्रोजेक्ट का नाम",
    enterProjectName: "प्रोजेक्ट का नाम दर्ज करें",
    addPhoto: "फोटो जोड़ें",
    getGPSLocation: "जीपीएस स्थान प्राप्त करें",
    submit: "जमा करें",
    validation: "सत्यापन",
    enterProjectNameMsg: "कृपया प्रोजेक्ट का नाम दर्ज करें।",
    takePhotosMsg: "कृपया कम से कम 3 फोटो लें।",
    success: "सफलता!",
    reportUploaded: "रिपोर्ट अपलोड की गई। सर्वर आईडी:",
    uploadFailed: "अपलोड असफल",
    uploadFailedMsg: "बैकएंड तक नहीं पहुंच सके। कृपया पुनः प्रयास करें।",
    
    // Photo Modal
    datetime: "दिनांक समय",
    gpsLatitude: "जीपीएस अक्षांश",
    gpsLongitude: "जीपीएस देशांतर",
    fileSize: "फ़ाइल का आकार",
    close: "बंद करें",
    bytes: "बाइट्स",
    
    // Saved Reports Screen
    savedReports: "सहेजी गई रिपोर्ट",
    loadingReports: "रिपोर्ट लोड हो रही हैं...",
    noReports: "अभी तक कोई रिपोर्ट नहीं।",
    status: "स्थिति",
    photos: "फोटो",
    pending: "लंबित",
    retry: "पुनः प्रयास",
    
    // Location Errors
    locationPermission: "अनुमति अस्वीकृत",
    locationPermissionMsg: "जियोटैगिंग के लिए स्थान की अनुमति आवश्यक है।",
    locationError: "स्थान त्रुटि",
    locationErrorMsg: "जीपीएस स्थान प्राप्त नहीं कर सका।",
    
    // Common
    untitled: "शीर्षकहीन",
    na: "उपलब्ध नहीं",
    selectLanguage: "भाषा चुनें"
  },
  
  bn: {
    // App Name  
    appName: "অ্যাকুয়াচেইন",
    tagline: "ফিল্ড ডেটা সংগ্রহ পোর্টাল",
    
    // Login Screen
    login: "লগইন",
    signup: "সাইনআপ",
    enterName: "আপনার নাম লিখুন",
    enterAgentId: "এজেন্ট আইডি বা ইমেইল লিখুন",
    enterPassword: "পাসওয়ার্ড লিখুন",
    accountCreated: "অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!",
    accountNotExist: "অ্যাকাউন্ট বিদ্যমান নেই।",
    fillAllFields: "দয়া করে সব ক্ষেত্র পূরণ করুন।",
    
    // Main Screen
    hello: "হ্যালো",
    agentId: "এজেন্ট আইডি",
    whatToDo: "আজ আপনি কি করতে চান?",
    createReport: "+ নতুন রিপোর্ট তৈরি করুন",
    viewReports: "সংরক্ষিত রিপোর্ট দেখুন",
    logout: "লগআউট",
    
    // Report Screen
    projectName: "প্রকল্পের নাম",
    enterProjectName: "প্রকল্পের নাম লিখুন",
    addPhoto: "ছবি যোগ করুন",
    getGPSLocation: "জিপিএস অবস্থান নিন",
    submit: "জমা দিন",
    validation: "যাচাইকরণ",
    enterProjectNameMsg: "দয়া করে প্রকল্পের নাম লিখুন।",
    takePhotosMsg: "দয়া করে কমপক্ষে ৩টি ছবি তুলুন।",
    success: "সফল!",
    reportUploaded: "রিপোর্ট আপলোড হয়েছে। সার্ভার আইডি:",
    uploadFailed: "আপলোড ব্যর্থ",
    uploadFailedMsg: "ব্যাকএন্ডে পৌঁছানো যায়নি। দয়া করে আবার চেষ্টা করুন।",
    
    // Photo Modal
    datetime: "তারিখ সময়",
    gpsLatitude: "জিপিএস অক্ষাংশ",
    gpsLongitude: "জিপিএস দ্রাঘিমাংশ",
    fileSize: "ফাইলের আকার",
    close: "বন্ধ",
    bytes: "বাইট",
    
    // Saved Reports Screen
    savedReports: "সংরক্ষিত রিপোর্ট",
    loadingReports: "রিপোর্ট লোড হচ্ছে...",
    noReports: "এখনো কোনো রিপোর্ট নেই।",
    status: "অবস্থা",
    photos: "ছবি",
    pending: "অপেক্ষমাণ",
    retry: "আবার চেষ্টা করুন",
    
    // Location Errors
    locationPermission: "অনুমতি প্রত্যাখ্যাত",
    locationPermissionMsg: "জিওট্যাগিংয়ের জন্য অবস্থানের অনুমতি প্রয়োজন।",
    locationError: "অবস্থান ত্রুটি",
    locationErrorMsg: "জিপিএস অবস্থান পেতে পারেনি।",
    
    // Common
    untitled: "শিরোনামহীন",
    na: "উপলব্ধ নয়",
    selectLanguage: "ভাষা নির্বাচন"
  },
  
  te: {
    // App Name
    appName: "ఆక్వాచెయిన్",
    tagline: "ఫీల్డ్ డేటా కలెక్షన్ పోర్టల్",
    
    // Login Screen
    login: "లాగిన్",
    signup: "సైనప్",
    enterName: "మీ పేరు నమోదు చేయండి",
    enterAgentId: "ఏజెంట్ ID లేదా ఇమెయిల్ నమోదు చేయండి",
    enterPassword: "పాస్‌వర్డ్ నమోదు చేయండి",
    accountCreated: "ఖాతా విజయవంతంగా సృష్టించబడింది!",
    accountNotExist: "ఖాతా లేదు.",
    fillAllFields: "దయచేసి అన్ని ఫీల్డ్‌లను పూరించండి.",
    
    // Main Screen
    hello: "హలో",
    agentId: "ఏజెంట్ ID",
    whatToDo: "ఈరోజు మీరు ఏమి చేయాలనుకుంటున్నారు?",
    createReport: "+ కొత్త రిపోర్ట్ సృష్టించండి",
    viewReports: "సేవ్ చేసిన రిపోర్ట్‌లను చూడండి",
    logout: "లాగ్అవుట్",
    
    // Report Screen
    projectName: "ప్రాజెక్ట్ పేరు",
    enterProjectName: "ప్రాజెక్ట్ పేరు నమోదు చేయండి",
    addPhoto: "ఫోటో జోడించండి",
    getGPSLocation: "GPS లొకేషన్ పొందండి",
    submit: "సమర్పించండి",
    validation: "ధృవీకరణ",
    enterProjectNameMsg: "దయచేసి ప్రాజెక్ట్ పేరు నమోదు చేయండి.",
    takePhotosMsg: "దయచేసి కనీసం 3 ఫోటోలు తీయండి.",
    success: "విజయం!",
    reportUploaded: "రిపోర్ట్ అప్‌లోడ్ చేయబడింది। సర్వర్ ID:",
    uploadFailed: "అప్‌లోడ్ విఫలమైంది",
    uploadFailedMsg: "బ్యాకెండ్‌ను చేరుకోలేకపోయాం। దయచేసి మళ్లీ ప్రయత్నించండి.",
    
    // Photo Modal
    datetime: "తేదీ సమయం",
    gpsLatitude: "GPS అక్షాంశం",
    gpsLongitude: "GPS రేఖాంశం",
    fileSize: "ఫైల్ పరిమాణం",
    close: "మూసివేయండి",
    bytes: "బైట్స్",
    
    // Saved Reports Screen
    savedReports: "సేవ్ చేసిన రిపోర్ట్‌లు",
    loadingReports: "రిపోర్ట్‌లు లోడ్ అవుతున్నాయి...",
    noReports: "ఇంకా రిపోర్ట్‌లు లేవు.",
    status: "స్థితి",
    photos: "ఫోటోలు",
    pending: "పెండింగ్",
    retry: "మళ్లీ ప్రయత్నించండి",
    
    // Location Errors
    locationPermission: "అనుమతి తిరస్కరించబడింది",
    locationPermissionMsg: "జియోట్యాగింగ్ కోసం లొకేషన్ అనుమతి అవసరం.",
    locationError: "లొకేషన్ ఎర్రర్",
    locationErrorMsg: "GPS లొకేషన్ పొందలేకపోయాం.",
    
    // Common
    untitled: "శీర్షిక లేని",
    na: "అందుబాటులో లేదు",
    selectLanguage: "భాష ఎంచుకోండి"
  },
  
  ta: {
    // App Name
    appName: "அக்வாசேன்",
    tagline: "களத் தரவு சேகரிப்பு போர்டல்",
    
    // Login Screen
    login: "உள்நுழை",
    signup: "பதிவு செய்",
    enterName: "உங்கள் பெயரை உள்ளிடவும்",
    enterAgentId: "ஏஜென்ட் ஐடி அல்லது மின்னஞ்சலை உள்ளிடவும்",
    enterPassword: "கடவுச்சொல்லை உள்ளிடவும்",
    accountCreated: "கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது!",
    accountNotExist: "கணக்கு இல்லை.",
    fillAllFields: "தயவுசெய்து அனைத்து புலங்களையும் நிரப்பவும்.",
    
    // Main Screen
    hello: "வணக்கம்",
    agentId: "ஏஜென்ட் ஐடி",
    whatToDo: "இன்று நீங்கள் என்ன செய்ய விரும்புகிறீர்கள்?",
    createReport: "+ புதிய அறிக்கை உருவாக்கு",
    viewReports: "சேமித்த அறிக்கைகளைப் பார்க்கவும்",
    logout: "வெளியேறு",
    
    // Report Screen
    projectName: "திட்டத்தின் பெயர்",
    enterProjectName: "திட்டத்தின் பெயரை உள்ளிடவும்",
    addPhoto: "புகைப்படம் சேர்",
    getGPSLocation: "GPS இருப்பிடம் பெறு",
    submit: "சமர்ப்பி",
    validation: "சரிபார்ப்பு",
    enterProjectNameMsg: "தயவுசெய்து திட்டத்தின் பெயரை உள்ளிடவும்.",
    takePhotosMsg: "தயவுசெய்து குறைந்தது 3 புகைப்படங்களை எடுங்கள்.",
    success: "வெற்றி!",
    reportUploaded: "அறிக்கை பதிவேற்றப்பட்டது। சேவையக ஐடி:",
    uploadFailed: "பதிவேற்றம் தோல்வி",
    uploadFailedMsg: "பின்முனையை அடைய முடியவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
    
    // Photo Modal
    datetime: "தேதி நேரம்",
    gpsLatitude: "GPS அட்சரேகை",
    gpsLongitude: "GPS தீர்க்கரேகை",
    fileSize: "கோப்பு அளவு",
    close: "மூடு",
    bytes: "பைட்ஸ்",
    
    // Saved Reports Screen
    savedReports: "சேமித்த அறிக்கைகள்",
    loadingReports: "அறிக்கைகள் ஏற்றப்படுகின்றன...",
    noReports: "இதுவரை அறிக்கைகள் இல்லை.",
    status: "நிலை",
    photos: "புகைப்படங்கள்",
    pending: "நிலுவையில்",
    retry: "மீண்டும் முயற்சி",
    
    // Location Errors
    locationPermission: "அனுமதி மறுக்கப்பட்டது",
    locationPermissionMsg: "ஜியோட்டாகிங்கிற்கு இருப்பிட அனுமதி தேவை.",
    locationError: "இருப்பிட பிழை",
    locationErrorMsg: "GPS இருப்பிடத்தைப் பெற முடியவில்லை.",
    
    // Common
    untitled: "தலைப்பில்லாத",
    na: "கிடைக்கவில்லை",
    selectLanguage: "மொழி தேர்வு"
  }
};

// Language Context (Simple version without AsyncStorage)
const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Simple Language Provider Component (no AsyncStorage)
export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const changeLanguage = (languageCode) => {
    if (translations[languageCode]) {
      setCurrentLanguage(languageCode);
    }
  };

  const t = (key) => {
    return translations[currentLanguage]?.[key] || translations['en'][key] || key;
  };

  const availableLanguages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' }
  ];

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    availableLanguages
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Language Selector Component
export const LanguageSelector = ({ visible, onClose }) => {
  const { availableLanguages, currentLanguage, changeLanguage, t } = useLanguage();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={languageStyles.modalOverlay}>
        <View style={languageStyles.languageModal}>
          <Text style={languageStyles.modalTitle}>{t("selectLanguage")}</Text>
          
          <FlatList
            data={availableLanguages}
            keyExtractor={item => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  languageStyles.languageOption,
                  currentLanguage === item.code && languageStyles.selectedLanguage
                ]}
                onPress={() => {
                  changeLanguage(item.code);
                  onClose();
                }}
              >
                <Text style={[
                  languageStyles.languageText,
                  currentLanguage === item.code && languageStyles.selectedLanguageText
                ]}>
                  {item.nativeName}
                </Text>
                <Text style={[
                  languageStyles.languageSubText,
                  currentLanguage === item.code && languageStyles.selectedLanguageText
                ]}>
                  {item.name}
                </Text>
                {currentLanguage === item.code && (
                  <Text style={languageStyles.checkMark}>✓</Text>
                )}
              </TouchableOpacity>
            )}
          />
          
          <TouchableOpacity style={languageStyles.closeButton} onPress={onClose}>
            <Text style={languageStyles.closeButtonText}>{t("close")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};


// Language Toggle Button Component
// Language Toggle Button Component
export const LanguageToggle = ({ onPress }) => {
  const { currentLanguage, availableLanguages } = useLanguage();
  const currentLang = availableLanguages.find(lang => lang.code === currentLanguage);
  
  return (
    <TouchableOpacity style={languageStyles.languageToggle} onPress={onPress}>
      <Text style={languageStyles.languageToggleText}>
        🌐 {currentLang?.nativeName || 'EN'}
      </Text>
    </TouchableOpacity>
  );
};


// Custom styles for language components
export const languageStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageModal: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e40af',
    textAlign: 'center',
    marginBottom: 20,
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedLanguage: {
    backgroundColor: '#1e40af',
    borderColor: '#1e40af',
  },
  languageText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    flex: 1,
  },
  languageSubText: {
    fontSize: 14,
    color: '#64748B',
    flex: 1,
    textAlign: 'right',
    marginRight: 8,
  },
  selectedLanguageText: {
    color: '#FFFFFF',
  },
  checkMark: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#64748B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
 languageToggle: {
  position: 'absolute',
  top: -130,        // Distance from top
  left: -10,       // Distance from left
  backgroundColor: '#FFFFFF',
  paddingVertical: 6,
  paddingHorizontal: 10,
  borderRadius: 20,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 4,
  borderWidth: 1,
  borderColor: '#E2E8F0',
  zIndex: 100,    // makes sure it stays above other elements
},
languageToggleText: {
  fontSize: 14,
  fontWeight: '600',
  color: '#1e40af',
},
},

);