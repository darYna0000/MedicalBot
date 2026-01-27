
import { UserProfile, MedicalDocument } from "../types";

// Шлях до проксі на вашому домені Hostiq
const PROXY_URL = '/proxy.php';

// ВСТАВТЕ ВАШ LOCATION ID ТУТ (знайдіть його в налаштуваннях Business Profile у GHL)
const GHL_LOCATION_ID = "ВАШ_РЕАЛЬНИЙ_LOCATION_ID_ТУТ"; 

export const sendToGoHighLevel = async (
  profile: UserProfile, 
  anamnesis: { ru: string; en: string },
  documents: MedicalDocument[]
) => {
  try {
    const contactPayload = {
      action: 'ghl',
      url: 'https://services.leadconnectorhq.com/contacts/upsert',
      data: {
        firstName: profile.name,
        phone: profile.phone,
        email: profile.email,
        locationId: GHL_LOCATION_ID,
        tags: ["MedicalBot", profile.oncoCase ? "Onco" : "General"],
        customFields: [
          // Примітка: ключі customFields мають збігатися з тими, що створені в GHL
          { key: "anamnesis_ru", value: anamnesis.ru },
          { key: "anamnesis_en", value: anamnesis.en }
        ]
      }
    };

    const response = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactPayload)
    });

    if (!response.ok) throw new Error("GHL Proxy Error");
    
    return true;
  } catch (error) {
    console.error("CRM Sync Failed via Proxy", error);
    return false;
  }
};
