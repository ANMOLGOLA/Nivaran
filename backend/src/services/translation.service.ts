export class TranslationService {
  /**
   * Simple regex-based language detector targeting Indian scripts.
   */
  public detectLanguage(text: string): 'hi' | 'ta' | 'te' | 'en' {
    if (!text) return 'en';
    // Hindi (Devanagari): \u0900-\u097F
    if (/[\u0900-\u097F]/.test(text)) return 'hi';
    // Tamil: \u0B80-\u0BFF
    if (/[\u0B80-\u0BFF]/.test(text)) return 'ta';
    // Telugu: \u0C00-\u0C7F
    if (/[\u0C00-\u0C7F]/.test(text)) return 'te';
    return 'en';
  }

  /**
   * Translates incoming query text to English for core RAG processing.
   */
  public async translateToEnglish(text: string, sourceLang: 'hi' | 'ta' | 'te' | 'en'): Promise<string> {
    if (sourceLang === 'en') return text;

    const normalized = text.trim().toLowerCase();

    // Standard translation dictionary mappings for the hackathon demo
    if (sourceLang === 'hi') {
      if (normalized.includes('किसान') || normalized.includes('kisan')) {
        return 'Tell me about PM-KISAN benefits and eligibility';
      }
      if (normalized.includes('आयुष्मान') || normalized.includes('ayushman') || normalized.includes('स्वास्थ्य') || normalized.includes('बीमा')) {
        return 'Tell me about Ayushman Bharat health insurance benefits';
      }
      if (normalized.includes('आवास') || normalized.includes('घर') || normalized.includes('pmay')) {
        return 'What are the benefits of Pradhan Mantri Awas Yojana PMAY';
      }
      if (normalized.includes('कचरा') || normalized.includes('शिकायत') || normalized.includes('सड़क') || normalized.includes('गंदगी')) {
        return 'I want to report a complaint about garbage and water leak on my road';
      }
    }

    if (sourceLang === 'ta') {
      if (normalized.includes('விவசாயி') || normalized.includes('கிசான்')) {
        return 'Tell me about PM-KISAN benefits and eligibility';
      }
      if (normalized.includes('ஆயுஷ்மான்') || normalized.includes('காப்பீடு') || normalized.includes('மருத்துவமனை')) {
        return 'Tell me about Ayushman Bharat health insurance benefits';
      }
      if (normalized.includes('வீடு') || normalized.includes('ஆவாஸ்') || normalized.includes('வீட்டு')) {
        return 'What are the benefits of Pradhan Mantri Awas Yojana PMAY';
      }
      if (normalized.includes('புகார்') || normalized.includes('குப்பை') || normalized.includes('சாலை')) {
        return 'I want to report a complaint about garbage and water leak on my road';
      }
    }

    if (sourceLang === 'te') {
      if (normalized.includes('రైతు') || normalized.includes('కిసాన్')) {
        return 'Tell me about PM-KISAN benefits and eligibility';
      }
      if (normalized.includes('ఆయుష్మాన్') || normalized.includes('ఆరోగ్య') || normalized.includes('భీమా')) {
        return 'Tell me about Ayushman Bharat health insurance benefits';
      }
      if (normalized.includes('ఇల్లు') || normalized.includes('ఆవాస్')) {
        return 'What are the benefits of Pradhan Mantri Awas Yojana PMAY';
      }
      if (normalized.includes('ఫిర్యాదు') || normalized.includes('చెత్త') || normalized.includes('రోడ్డు')) {
        return 'I want to report a complaint about garbage and water leak on my road';
      }
    }

    return text; // Fallback
  }

  /**
   * Translates final output text back to the citizen's detected language.
   */
  public async translateFromEnglish(text: string, targetLang: 'hi' | 'ta' | 'te' | 'en'): Promise<string> {
    if (targetLang === 'en') return text;

    if (targetLang === 'hi') {
      let hiText = text;
      hiText = hiText.replace(/Benefits:/g, 'लाभ:');
      hiText = hiText.replace(/Eligibility:/g, 'पात्रता:');
      hiText = hiText.replace(/Required Documents:/g, 'आवश्यक दस्तावेज:');
      hiText = hiText.replace(/FAQ:/g, 'सामान्य प्रश्न:');
      
      // Standard responses translations
      if (hiText.includes('Financial benefit of Rs. 6,000 per year')) {
        hiText = hiText.replace('Financial benefit of Rs. 6,000 per year in three equal installments of Rs. 2,000 each, directly transferred into the bank accounts of the farmers.', 'प्रति वर्ष 6,000 रुपये का वित्तीय लाभ तीन समान किस्तों में प्रत्येक 2,000 रुपये, सीधे किसानों के बैंक खातों में स्थानांतरित किया जाता है।');
      }
      if (hiText.includes('Free health insurance cover of up to Rs. 5 Lakh per family per year')) {
        hiText = hiText.replace('Free health insurance cover of up to Rs. 5 Lakh per family per year for secondary and tertiary care hospitalization across all empaneled public and private hospitals.', 'सभी सूचीबद्ध सरकारी और निजी अस्पतालों में माध्यमिक और तृतीयक देखभाल अस्पताल में भर्ती के लिए प्रति परिवार प्रति वर्ष 5 लाख रुपये तक का मुफ्त स्वास्थ्य बीमा कवर।');
      }
      if (hiText.includes('Financial assistance of Rs. 1.2 Lakh')) {
        hiText = hiText.replace('Financial assistance of Rs. 1.2 Lakh in plains and Rs. 1.3 Lakh in hilly/difficult areas for constructing a permanent (pucca) house.', 'मैदानी इलाकों में 1.2 लाख रुपये और पहाड़ी/कठिन क्षेत्रों में 1.3 लाख रुपये की वित्तीय सहायता स्थायी (पक्का) घर बनाने के लिए।');
      }
      if (hiText.includes('complaint')) {
        hiText = hiText.replace('I noticed you want to report an issue. Click below to file a civic complaint.', 'मैंने ध्यान दिया कि आप एक समस्या की रिपोर्ट करना चाहते हैं। नागरिक शिकायत दर्ज करने के लिए नीचे क्लिक करें।');
      }

      return hiText;
    }

    if (targetLang === 'ta') {
      let taText = text;
      taText = taText.replace(/Benefits:/g, 'பலன்கள்:');
      taText = taText.replace(/Eligibility:/g, 'தகுதி:');
      taText = taText.replace(/Required Documents:/g, 'தேவையான ஆவணங்கள்:');
      taText = taText.replace(/FAQ:/g, 'அடிக்கடி கேட்கப்படும் கேள்விகள்:');

      // Standard responses translations
      if (taText.includes('Financial benefit of Rs. 6,000 per year')) {
        taText = taText.replace('Financial benefit of Rs. 6,000 per year in three equal installments of Rs. 2,000 each, directly transferred into the bank accounts of the farmers.', 'ஆண்டுக்கு ரூ. 6,000 நிதி உதவி மூன்று சம தவணைகளாக தலா ரூ. 2,000 விவசாயிகளின் வங்கி கணக்குகளுக்கு நேரடியாக மாற்றப்படுகிறது.');
      }
      if (taText.includes('Free health insurance cover of up to Rs. 5 Lakh per family per year')) {
        taText = taText.replace('Free health insurance cover of up to Rs. 5 Lakh per family per year for secondary and tertiary care hospitalization across all empaneled public and private hospitals.', 'அனைத்து அங்கீகரிக்கப்பட்ட பொது மற்றும் தனியார் மருத்துவமனைகளில் இரண்டாம் மற்றும் மூன்றாம் நிலை மருத்துவ சிகிச்சைக்காக ஒரு குடும்பத்திற்கு ஆண்டுக்கு ரூ. 5 லட்சம் வரை இலவச மருத்துவ காப்பீடு.');
      }
      if (taText.includes('Financial assistance of Rs. 1.2 Lakh')) {
        taText = taText.replace('Financial assistance of Rs. 1.2 Lakh in plains and Rs. 1.3 Lakh in hilly/difficult areas for constructing a permanent (pucca) house.', 'சமவெளிப் பகுதிகளில் ரூ. 1.2 லட்சமும், மலைப் பகுதிகளில் ரூ. 1.3 லட்சமும் நிரந்தர (பக்கா) வீடு கட்ட நிதி உதவி வழங்கப்படுகிறது.');
      }
      if (taText.includes('complaint')) {
        taText = taText.replace('I noticed you want to report an issue. Click below to file a civic complaint.', 'நீங்கள் ஒரு சிக்கலைப் புகாரளிக்க விரும்புகிறீர்கள் என்பதை நான் கவனித்தேன். குடிமக்கள் புகார் அளிக்க கீழே கிளிக் செய்யவும்.');
      }

      return taText;
    }

    return `[Translated] ${text}`;
  }
}

export const translationService = new TranslationService();
