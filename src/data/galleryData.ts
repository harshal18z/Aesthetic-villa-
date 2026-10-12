import clinic1 from "@/assets/clinic/clinic-1.jpg";
import clinic2 from "@/assets/clinic/clinic-2.jpg";
import clinic3 from "@/assets/clinic/clinic-3.jpg";
import clinic4 from "@/assets/clinic/clinic-4.jpg";
import clinic5 from "@/assets/clinic/clinic-5.jpg";
import clinic6 from "@/assets/clinic/clinic-6.jpg";
import clinic7 from "@/assets/clinic/clinic-7.jpg";
import clinic8 from "@/assets/clinic/clinic-8.jpg";
import clinic9 from "@/assets/clinic/clinic-9.jpg";

import doctor1 from "@/assets/clinic/doctor-1.jpg";
import doctor2 from "@/assets/clinic/doctor-2.jpg";
import doctor3 from "@/assets/clinic/doctor-3.jpg";
import doctor4 from "@/assets/clinic/doctor-4.jpg";
import doctor6 from "@/assets/clinic/Doctor-6.jpeg";
import doctor7 from "@/assets/clinic/Doctor-7.jpeg";
import doctorMain from "@/assets/clinic/doctor-main.png";

import instruments1 from "@/assets/clinic/Instruments-1.jpeg";
import instruments2 from "@/assets/clinic/Instruments-2.jpeg";
import instruments3 from "@/assets/clinic/instrument 3.jpeg";
import instruments4 from "@/assets/clinic/instrument 4.jpeg";

import treatment1 from "@/assets/clinic/treatment 1.jpeg";
import treatment2 from "@/assets/clinic/treatment 2.jpeg";
import treatment3 from "@/assets/clinic/treatment 3.jpeg";
import treatment4 from "@/assets/clinic/treatment 4.jpeg";
import treatment5 from "@/assets/clinic/treatment 5.jpeg";
import treatment6 from "@/assets/clinic/treatment 6.jpeg";
import treatment7 from "@/assets/clinic/treatment 7.jpeg";
import treatment8 from "@/assets/clinic/treatment 8.jpeg";
import treatment9 from "@/assets/clinic/treatment 9.jpeg";
import treatment10 from "@/assets/clinic/treatment 10.jpeg";

export interface GalleryMediaItem {
  id: string;
  title: string;
  type: "image" | "video";
  url: string;
  thumbnailUrl?: string;
  category: "Clinic" | "Doctor" | "Equipment" | "Treatment" | "Videos";
  description?: string;
  videoEmbedUrl?: string;
}

export const GALLERY_ITEMS: GalleryMediaItem[] = [
  // Clinic Walkthrough Videos
  {
    id: "v1",
    title: "The Villa Walkthrough & Ambience",
    type: "video",
    url: clinic1,
    thumbnailUrl: clinic1,
    category: "Videos",
    description: "Take a calming walkthrough of our sunlit, garden-facing dental lounge in Kothrud, Pune.",
    videoEmbedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
  },
  {
    id: "v2",
    title: "Smile Design & Patient Experience",
    type: "video",
    url: doctor2,
    thumbnailUrl: doctor2,
    category: "Videos",
    description: "See how digital smile planning and gentle care transform smiles and restore dental confidence.",
    videoEmbedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
  },

  // Clinic Ambience & Architecture
  { id: "c1", title: "Sunlit Villa Waiting Lounge", type: "image", url: clinic1, category: "Clinic", description: "Natural light, bouclé seating and quiet unhurried hospitality." },
  { id: "c2", title: "Travertine Reception Lounge", type: "image", url: clinic2, category: "Clinic", description: "Warm stone textures and welcoming retreat atmosphere." },
  { id: "c3", title: "Operatory Suite 1", type: "image", url: clinic3, category: "Clinic", description: "Ergonomic treatment chairs with garden views and calming acoustics." },
  { id: "c4", title: "Quiet Consultation Corner", type: "image", url: clinic4, category: "Clinic", description: "Private discussion space designed for stress-free consultations." },
  { id: "c5", title: "Ergonomic Operatory Unit", type: "image", url: clinic5, category: "Clinic", description: "Ultra-clean dental unit equipped with whisper-quiet motors." },
  { id: "c6", title: "Hospital-Grade Sterilization", type: "image", url: clinic6, category: "Clinic", description: "Autoclave sterilization protocols exceeding international hygiene norms." },
  { id: "c7", title: "Calm Patient Recovery Lounge", type: "image", url: clinic7, category: "Clinic", description: "Where you can enjoy tea, relax, and refresh after your procedure." },
  { id: "c8", title: "Advanced Operatory Setup", type: "image", url: clinic8, category: "Clinic", description: "Modern lighting and patient monitoring for seamless comfort." },
  { id: "c9", title: "Evening Villa Ambience", type: "image", url: clinic9, category: "Clinic", description: "Warm ambient illumination designed to soothe dental anxiety." },

  // Doctor & Consultations
  { id: "d-pink", title: "Dr. Tejashree Kulkarni", type: "image", url: "/img/dr-tejashree-pink-blazer.jpg", category: "Doctor", description: "Chief Dental Surgeon & Founder of The Aesthetic Villa." },
  { id: "d-portrait", title: "Dr. Tejashree Kulkarni (Clinical)", type: "image", url: "/img/dr-tejashree-portrait.jpg", category: "Doctor", description: "Chief Dental Surgeon in clinical attire." },
  { id: "d-surgical", title: "Precision Clinical Examination", type: "image", url: "/img/dr-surgical-scrubs.jpg", category: "Doctor", description: "Dr. Tejashree preparing sterile instruments for gentle patient examination." },
  { id: "d-real-1", title: "Dr. Tejashree in Operatory", type: "image", url: "/img/dr-treating-patient.jpg", category: "Doctor", description: "Dr. Tejashree Kulkarni delivering gentle, precision dental care." },
  { id: "d-real-3", title: "Chairside Treatment Session", type: "image", url: "/img/dr-treating-patient-2.jpg", category: "Doctor", description: "Dr. Tejashree performing a careful dental examination with full protective gear." },
  { id: "d-real-2", title: "Unhurried Patient Education", type: "image", url: "/img/unhurried-patient-consultation.jpg", category: "Doctor", description: "Explaining tooth anatomy and treatment stages with clarity and warmth." },
  { id: "d1", title: "One-on-One Smile Consultation", type: "image", url: doctor1, category: "Doctor", description: "Dedicated time to understand your personal goals and clinical needs." },
  { id: "d2", title: "Digital Bite & Esthetic Analysis", type: "image", url: doctor2, category: "Doctor", description: "Careful review of dental harmony and treatment pathways." },
  { id: "d3", title: "Aesthetic Case Planning", type: "image", url: doctor3, category: "Doctor", description: "Custom shade matching and ceramic translucency planning." },
  { id: "d4", title: "Surgical & Restorative Precision", type: "image", url: doctor4, category: "Doctor", description: "Gentle hands and evidence-based surgical techniques." },
  { id: "d6", title: "Clinical Care in Action", type: "image", url: doctor6, category: "Doctor", description: "Focusing on patient comfort and painless execution." },
  { id: "d7", title: "Collaborative Team Care", type: "image", url: doctor7, category: "Doctor", description: "Assisted by trained, empathetic clinical staff." },

  // Equipment & Technology
  { id: "e-real-1", title: "Rotary Endodontics Handpiece", type: "image", url: "/img/rotary-endodontics-handpiece.jpg", category: "Equipment", description: "Computerized rotary endodontic motor for painless root canal therapy." },
  { id: "e-real-2", title: "NiTi Rotary File Close-Up", type: "image", url: "/img/rotary-endodontics-2.jpg", category: "Equipment", description: "Nickel-titanium rotary file mounted on the Woodpecker endodontic motor — precision at 0.02mm." },
  { id: "e1", title: "Microsurgical Dental Instruments", type: "image", url: instruments1, category: "Equipment", description: "High-grade surgical stainless steel for atraumatic micro-procedures." },
  { id: "e2", title: "Class-B Autoclave Sterilization", type: "image", url: instruments2, category: "Equipment", description: "Zero-compromise sterile packaging for every patient." },
  { id: "e3", title: "Digital Apex & Rotary Endodontics", type: "image", url: instruments3, category: "Equipment", description: "Micro-electronic apex measurement ensuring 100% accurate root canal cleaning." },
  { id: "e4", title: "Ultrasonic Piezo Tech", type: "image", url: instruments4, category: "Equipment", description: "Painless scaling and bone preservation technology." },

  // Treatments & Clinical Results
  { id: "t-real-1", title: "Custom Clear Aligners", type: "image", url: "/img/clear-aligners-orthodontics.jpg", category: "Treatment", description: "Bespoke transparent aligners for discreet, comfortable smile alignment." },
  { id: "t1", title: "In-Office Whitening Result", type: "image", url: treatment1, category: "Treatment", description: "Instant 6-shade brighten with gentle remineralizing polish." },
  { id: "t2", title: "Porcelain Veneer Smile Design", type: "image", url: treatment2, category: "Treatment", description: "Natural contouring with seamless tooth-colored ceramic." },
  { id: "t3", title: "Clear Aligner Alignment", type: "image", url: treatment3, category: "Treatment", description: "Progressive invisible alignment correcting crowding gently." },
  { id: "t4", title: "Single-Sitting Molar Root Canal", type: "image", url: treatment4, category: "Treatment", description: "Complete pain relief with 3D hermetic sealing." },
  { id: "t5", title: "Titanium Dental Implant Placement", type: "image", url: treatment5, category: "Treatment", description: "Biocompatible fixture placed with 3D surgical guidance." },
  { id: "t6", title: "Monolithic Zirconia Crown Fit", type: "image", url: treatment6, category: "Treatment", description: "Lifelike translucency and unmatched chewing endurance." },
  { id: "t7", title: "Pediatric & Preventive Care", type: "image", url: treatment7, category: "Treatment", description: "Fluoride and fissure sealant care tailored for young smiles." },
  { id: "t8", title: "Ultrasonic Scaling & Plaque Removal", type: "image", url: treatment8, category: "Treatment", description: "Thorough calculus removal restoring healthy pink gingiva." },
  { id: "t9", title: "Facial Esthetic & Skin Treatment", type: "image", url: treatment9, category: "Treatment", description: "Comprehensive aesthetic balance for smile and facial contours." },
  { id: "t10", title: "Laser Gum Contouring", type: "image", url: treatment10, category: "Treatment", description: "Pain-free gum recontouring for symmetrical, balanced smiles." }
];

export const GALLERY_CATEGORIES = ["All", "Clinic", "Doctor", "Equipment", "Treatment", "Videos"] as const;
