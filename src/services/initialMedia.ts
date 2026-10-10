import { MediaItem } from "@/types/media";

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

export const DEFAULT_MEDIA_ITEMS: MediaItem[] = [
  // Sample Videos
  {
    id: "v1",
    title: "Clinic Walkthrough & Facilities",
    type: "video",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailUrl: clinic1,
    category: "Videos",
    description: "Take a virtual tour of our modern state-of-the-art dental clinic in Kothrud, Pune.",
    alt: "Clinic Tour Video",
    isExternalVideo: true,
    createdAt: "2026-01-15T10:00:00Z"
  },
  {
    id: "v2",
    title: "Smile Makeover Patient Experience",
    type: "video",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailUrl: doctor2,
    category: "Videos",
    description: "Watch how our advanced cosmetic dentistry transformed a patient's smile.",
    alt: "Smile Makeover Video",
    isExternalVideo: true,
    createdAt: "2026-02-01T12:00:00Z"
  },

  // Clinic Photos
  { id: "p1", title: "Modern Dental Clinic Interior", type: "image", url: clinic1, category: "Clinic", alt: "Modern dental clinic interior", createdAt: "2026-01-01T00:00:00Z" },
  { id: "p2", title: "Reception Area", type: "image", url: clinic2, category: "Clinic", alt: "Reception area", createdAt: "2026-01-01T01:00:00Z" },
  { id: "p3", title: "Treatment Room 1", type: "image", url: clinic3, category: "Clinic", alt: "Treatment room", createdAt: "2026-01-01T02:00:00Z" },
  { id: "p4", title: "Waiting Lounge", type: "image", url: clinic4, category: "Clinic", alt: "Waiting lounge", createdAt: "2026-01-01T03:00:00Z" },
  { id: "p5", title: "Ergonomic Dental Setup", type: "image", url: clinic5, category: "Clinic", alt: "Dental setup", createdAt: "2026-01-01T04:00:00Z" },
  { id: "p6", title: "Sterile & Hygienic Environment", type: "image", url: clinic6, category: "Clinic", alt: "Sterile environment", createdAt: "2026-01-01T05:00:00Z" },
  { id: "p7", title: "Patient Comfort Zone", type: "image", url: clinic7, category: "Clinic", alt: "Comfort zone", createdAt: "2026-01-01T06:00:00Z" },
  { id: "p8", title: "Advanced Dental Chair", type: "image", url: clinic8, category: "Clinic", alt: "Dental chair", createdAt: "2026-01-01T07:00:00Z" },
  { id: "p9", title: "Clinic Ambience & Lighting", type: "image", url: clinic9, category: "Clinic", alt: "Clinic ambience", createdAt: "2026-01-01T08:00:00Z" },

  // Doctor Photos
  { id: "p10", title: "Dr. Consultation Session", type: "image", url: doctor1, category: "Doctor", alt: "Doctor portrait", createdAt: "2026-01-02T00:00:00Z" },
  { id: "p11", title: "Patient Consultation", type: "image", url: doctor2, category: "Doctor", alt: "Consultation session", createdAt: "2026-01-02T01:00:00Z" },
  { id: "p12", title: "Smile Makeover Specialist", type: "image", url: doctor3, category: "Doctor", alt: "Smile makeover specialist", createdAt: "2026-01-02T02:00:00Z" },
  { id: "p13", title: "Senior Dental Surgeon", type: "image", url: doctor4, category: "Doctor", alt: "Dental surgeon", createdAt: "2026-01-02T03:00:00Z" },
  { id: "p14", title: "Operatory Care", type: "image", url: doctor6, category: "Doctor", alt: "Treatment room", createdAt: "2026-01-02T04:00:00Z" },
  { id: "p15", title: "Expert Care Team", type: "image", url: doctor7, category: "Doctor", alt: "Treatment room", createdAt: "2026-01-02T05:00:00Z" },

  // Equipment Photos
  { id: "p16", title: "Precision Dental Instruments", type: "image", url: instruments1, category: "Equipment", alt: "Dental instruments", createdAt: "2026-01-03T00:00:00Z" },
  { id: "p17", title: "Advanced Sterilization Tools", type: "image", url: instruments2, category: "Equipment", alt: "Advanced tools", createdAt: "2026-01-03T01:00:00Z" },
  { id: "p18", title: "Digital Imaging Equipment", type: "image", url: instruments3, category: "Equipment", alt: "Advanced tools", createdAt: "2026-01-03T02:00:00Z" },
  { id: "p19", title: "High-Precision Dental Tech", type: "image", url: instruments4, category: "Equipment", alt: "Advanced tools", createdAt: "2026-01-03T03:00:00Z" },

  // Treatment Photos
  { id: "p20", title: "Tooth Whitening Procedure", type: "image", url: treatment1, category: "Treatment", alt: "Treatment sample 1", createdAt: "2026-01-04T00:00:00Z" },
  { id: "p21", title: "Cosmetic Veneers Before/After", type: "image", url: treatment2, category: "Treatment", alt: "Treatment sample 2", createdAt: "2026-01-04T01:00:00Z" },
  { id: "p22", title: "Invisible Aligner Fitting", type: "image", url: treatment3, category: "Treatment", alt: "Treatment sample 3", createdAt: "2026-01-04T02:00:00Z" },
  { id: "p23", title: "Root Canal Treatment", type: "image", url: treatment4, category: "Treatment", alt: "Treatment sample 4", createdAt: "2026-01-04T03:00:00Z" },
  { id: "p24", title: "Dental Implant Placement", type: "image", url: treatment5, category: "Treatment", alt: "Treatment sample 5", createdAt: "2026-01-04T04:00:00Z" },
  { id: "p25", title: "Crown & Bridge Restoration", type: "image", url: treatment6, category: "Treatment", alt: "Treatment sample 6", createdAt: "2026-01-04T05:00:00Z" },
  { id: "p26", title: "Pediatric Dental Care", type: "image", url: treatment7, category: "Treatment", alt: "Treatment sample 7", createdAt: "2026-01-04T06:00:00Z" },
];

export const DEFAULT_CATEGORIES: string[] = [
  "All",
  "Clinic",
  "Doctor",
  "Equipment",
  "Treatment",
  "Videos",
];
