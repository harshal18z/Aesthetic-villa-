export interface Treatment {
  id: string;
  number: string;
  title: string;
  category: string;
  description: string;
  benefits: string[];
  duration?: string;
  iconName: string;
}

export const TREATMENTS: Treatment[] = [
  {
    id: "implants",
    number: "01",
    title: "Dental Implants",
    category: "Restorative & Surgical",
    description: "Longterm titanium tooth implants engineered to integrate with jawbone for a durable, fully natural-looking replacement.",
    benefits: ["Longterm restorative solution", "Natural bite force & feel", "Preserves adjacent healthy bone"],
    duration: "1–2 visits + healing",
    iconName: "Zap"
  },
  {
    id: "rct",
    number: "02",
    title: "Advanced, Painless Root Canals",
    category: "Endodontics",
    description: "Modern rotary endodontics with digital apex locators for painless, precise preservation of natural teeth in single or minimal sittings.",
    benefits: ["Completely pain-free procedure", "Single sitting option available", "Saves your natural tooth"],
    duration: "45–60 mins",
    iconName: "Shield"
  },
  {
    id: "smile-makeover",
    number: "03",
    title: "Hollywood Smile & Smile Makeover",
    category: "Cosmetic Dentistry",
    description: "Bespoke digital smile design combining handcrafted veneers, whitening, and gum contouring for flawless, camera-ready aesthetics.",
    benefits: ["Custom facial harmony design", "Ultra-thin porcelain veneers", "Life-changing transformation"],
    duration: "2–3 visits",
    iconName: "Star"
  },
  {
    id: "crowns-bridges",
    number: "04",
    title: "Crowns & Bridges",
    category: "Prosthodontics",
    description: "Custom-milled zirconia and ceramic crowns and bridges that seamlessly match natural shade, translucency, and contours.",
    benefits: ["High-strength monolithic zirconia", "Natural enamel translucency", "Long-lasting durability"],
    duration: "2 visits",
    iconName: "Crown"
  },
  {
    id: "aligners",
    number: "05",
    title: "Braces & Clear Aligners",
    category: "Orthodontics",
    description: "Virtually invisible orthodontic aligners and high-precision ceramic braces to align teeth smoothly and discreetly.",
    benefits: ["Discreet & transparent", "Removable for meals & cleaning", "Digital progress simulation"],
    duration: "6–18 months",
    iconName: "AlignCenter"
  },
  {
    id: "whitening",
    number: "06",
    title: "Professional Teeth Whitening",
    category: "Cosmetic Dentistry",
    description: "In-office light-activated dental whitening that gently lifts stubborn coffee, tea, and age stains by 1–3 shades in an hour.",
    benefits: ["1–3 shade brighter results", "Enamel-safe, zero irritation", "Long-lasting radiant shine"],
    duration: "45 mins",
    iconName: "SmilePlus"
  },
  {
    id: "cleaning",
    number: "07",
    title: "Teeth Cleaning & Polishing",
    category: "Preventive Care",
    description: "Ultrasonic scaling and diamond polishing to eliminate hidden plaque, calculus, and tartar for optimal gum health and fresh breath.",
    benefits: ["Gentle ultrasonic technology", "Stain & tartar eradication", "Prevents gingivitis & decay"],
    duration: "30 mins",
    iconName: "Sparkles"
  },
  {
    id: "fillings",
    number: "08",
    title: "Tooth Coloured Fillings",
    category: "Restorative",
    description: "Biocompatible composite resin restorations layered and cured to mimic natural tooth color, texture, and strength seamlessly.",
    benefits: ["Mercury-free composite", "Indistinguishable from natural enamel", "Bonds directly to tooth structure"],
    duration: "30 mins",
    iconName: "Sun"
  },
  {
    id: "wisdom-teeth",
    number: "09",
    title: "Wisdom Tooth Removal",
    category: "Oral Surgery",
    description: "Minimally invasive, atraumatic extraction of impacted wisdom teeth with advanced local anesthesia and rapid recovery protocols.",
    benefits: ["Gentle surgical technique", "Minimal post-op swelling", "Rapid healing & pain control"],
    duration: "30–45 mins",
    iconName: "Scissors"
  },
  {
    id: "full-mouth",
    number: "10",
    title: "Full Mouth Reconstruction",
    category: "Rehabilitative",
    description: "Comprehensive oral rehabilitation combining implantology, periodontics, and prosthodontics for collapsed or worn-down bites.",
    benefits: ["Restores full chewing ability", "Re-establishes facial height", "Custom staged treatment plan"],
    duration: "Multi-stage care",
    iconName: "Layers"
  },
  {
    id: "laser-gum",
    number: "11",
    title: "Laser Gum Surgeries",
    category: "Periodontics",
    description: "State-of-the-art soft tissue laser therapy for gummy smile correction, depigmentation, and sterile treatment of periodontal pockets.",
    benefits: ["Bloodless & scalpel-free", "No sutures needed", "Accelerated tissue regeneration"],
    duration: "30 mins",
    iconName: "Zap"
  },
  {
    id: "extractions",
    number: "12",
    title: "Gentle Teeth Removal",
    category: "Oral Surgery",
    description: "Painless extraction for non-restorable teeth with socket preservation techniques to protect bone for future implant replacement.",
    benefits: ["Gentle atraumatic technique", "Preserves jawbone ridge", "Comfort-first approach"],
    duration: "20–30 mins",
    iconName: "Trash2"
  },
  {
    id: "complete-dentures",
    number: "13",
    title: "Complete Dentures",
    category: "Prosthodontics",
    description: "Lightweight, precision-molded full arch dentures crafted for superior suction, stability, comfort, and natural facial aesthetics.",
    benefits: ["Custom contouring for comfort", "Natural lip & cheek support", "Implant-supported options"],
    duration: "3–4 fittings",
    iconName: "Heart"
  },
  {
    id: "partial-dentures",
    number: "14",
    title: "Flexible Partial Dentures",
    category: "Prosthodontics",
    description: "Flexible, metal-free partial dentures that clip comfortably into place without visible metallic clasps.",
    benefits: ["Ultra-durable, fracture-resistant nylon", "Invisible pink clasps", "Comfortable chewing restoration"],
    duration: "2–3 visits",
    iconName: "Syringe"
  }
];
