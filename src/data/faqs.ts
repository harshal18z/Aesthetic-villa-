export interface FAQItem {
  id: string;
  category: string;
  q: string;
  a: string;
}

export const FAQ_CATEGORIES = [
  "All",
  "About Clinic & Appointments",
  "Costs & Transparency",
  "General Oral Health",
  "Root Canal & Extraction",
  "Dental Implants",
  "Orthodontics & Braces",
  "Crowns, Bridges & Dentures",
  "Cosmetic Dentistry",
  "Pediatric Care & Anxiety",
] as const;

export const ALL_FAQS: FAQItem[] = [
  // ── 1. ABOUT CLINIC & APPOINTMENTS ──
  {
    id: "c1",
    category: "About Clinic & Appointments",
    q: "Why should I choose The Aesthetic Villa in Kothrud, Pune?",
    a: "The Aesthetic Villa is founded on an unhurried, patient-first care philosophy led by Chief Dental Surgeon Dr. Tejashree Kulkarni (8+ years clinical experience, 4,500+ smiles treated). We combine cutting-edge dental technology—including rotary endodontics, Class-B autoclave hospital-grade sterilization, and digital imaging—with a warm, calming villa ambiance designed specifically to eliminate dental anxiety."
  },
  {
    id: "c2",
    category: "About Clinic & Appointments",
    q: "Where can I find the best dental clinic in Kothrud?",
    a: "The Aesthetic Villa is conveniently located in the heart of Kothrud at Shop No. 4, Prathma Co-Op Housing Society, Paramhans Nagar, Opposite Pebbles Urbania, Pune 411038. It is easily accessible from Paud Road, Chandani Chowk, and Bavdhan with dedicated patient parking."
  },
  {
    id: "c3",
    category: "About Clinic & Appointments",
    q: "How can I book an appointment?",
    a: "You can book directly via our website booking form, call or WhatsApp our clinic coordinator at +91 9226856934, or click any 'Book Consultation' button on this page. We promptly confirm your preferred morning or evening slot."
  },
  {
    id: "c4",
    category: "About Clinic & Appointments",
    q: "What will happen at my first visit to my dentist?",
    a: "Your initial visit is a relaxed, comprehensive consultation. Dr. Tejashree Kulkarni conducts a detailed intraoral evaluation, checks your bite, gum health, and tooth structure, and takes digital X-rays if needed. We discuss your concerns without rush, show you clinical findings, and present transparent treatment options before beginning any procedure."
  },
  {
    id: "c5",
    category: "About Clinic & Appointments",
    q: "How to choose the best dentist in Kothrud?",
    a: "Look for four essential pillars: (1) Proven clinical credentials and years of experience, (2) Strict hospital-grade sterilization and modern digital equipment, (3) Transparent diagnosis with zero forced treatments, and (4) Authentic patient reviews. Dr. Tejashree Kulkarni brings 8+ years of dedicated practice with a 4.9-star rating across hundreds of verified patients."
  },
  {
    id: "c6",
    category: "About Clinic & Appointments",
    q: "What are your clinic timings and working days?",
    a: "We are open Monday through Saturday: 2:00 PM – 4:00 PM (Afternoon) and 5:00 PM – 8:00 PM (Evening). Sunday visits are arranged on an appointment basis for working professionals and emergency care."
  },
  {
    id: "c7",
    category: "About Clinic & Appointments",
    q: "Do you offer emergency dental services?",
    a: "Yes. For acute toothache, broken crowns, dental trauma, or severe swelling, please call our emergency helpline at +91 9226856934. We prioritize emergency patients for immediate pain relief and stabilization."
  },
  {
    id: "c8",
    category: "About Clinic & Appointments",
    q: "Is parking available near the clinic?",
    a: "Yes, ample two-wheeler and four-wheeler visitor parking is available directly in front of and adjacent to Prathma Housing Society, Opposite Pebbles Urbania in Paramhans Nagar."
  },
  {
    id: "c9",
    category: "About Clinic & Appointments",
    q: "Do you accept walk-in patients or is prior appointment mandatory?",
    a: "While walk-ins are accommodated whenever possible (especially for emergencies), we strongly recommend booking a prior appointment so you enjoy a dedicated, zero-wait, unhurried consultation with Dr. Tejashree."
  },
  {
    id: "c10",
    category: "About Clinic & Appointments",
    q: "How long does a typical dental appointment last?",
    a: "A regular consultation and diagnostic exam takes approximately 30–40 minutes. Routine cleanings or fillings typically take 45 minutes, while advanced single-visit root canals or crown preparations are planned for 60 minutes with complete comfort breaks."
  },
  {
    id: "c11",
    category: "About Clinic & Appointments",
    q: "Can I reschedule or cancel my appointment online?",
    a: "Yes. Simply drop a message on our clinic WhatsApp at +91 9226856934 with your name and preferred new time. We appreciate at least 2–4 hours advance notice so we can offer the slot to another patient in need."
  },

  // ── 2. COSTS & TRANSPARENCY ──
  {
    id: "co1",
    category: "Costs & Transparency",
    q: "Are dental treatments at The Aesthetic Villa affordable?",
    a: "Yes. We believe world-class aesthetic and restorative dental care should be accessible. Our fee structure is competitive and completely transparent with no hidden add-ons. We provide an itemized written estimate prior to starting any treatment."
  },
  {
    id: "co2",
    category: "Costs & Transparency",
    q: "Do you accept dental insurance or cashless treatment?",
    a: "While most standard Indian outpatient dental treatments are paid directly, we provide complete official clinical receipts, diagnostic reports, and medical certificates required to claim reimbursement under corporate health policies and dental add-on insurance."
  },
  {
    id: "co3",
    category: "Costs & Transparency",
    q: "Are EMI or payment plan options available for expensive treatments?",
    a: "Yes. For multi-stage procedures like full-mouth dental implants, smile design veneers, and clear aligner orthodontics, payments are structured across treatment milestones. Flexible digital EMI options are also available."
  },
  {
    id: "co4",
    category: "Costs & Transparency",
    q: "What is the cost of a dental consultation?",
    a: "Our diagnostic consultation fee is modest and includes a comprehensive clinical assessment, bite examination, and digital treatment roadmap. Please reach out via phone or WhatsApp for our current seasonal introductory offers."
  },

  // ── 3. GENERAL ORAL HEALTH ──
  {
    id: "gh1",
    category: "General Oral Health",
    q: "Is it OK if my gums bleed?",
    a: "No, healthy gums never bleed. Bleeding during brushing or flossing is the primary warning sign of gingivitis (early gum inflammation caused by bacterial plaque). If treated early with gentle ultrasonic cleaning, it is 100% reversible; left untreated, it progresses to periodontitis and bone loss."
  },
  {
    id: "gh2",
    category: "General Oral Health",
    q: "I am having severe pain in my teeth, what should I do now?",
    a: "Severe throbbing pain usually signifies that tooth decay has reached the pulp nerve. Avoid placing aspirin tablets directly against the gum (this causes chemical burns). Rinse gently with warm salt water, take an over-the-counter painkiller if needed, and call our clinic immediately (+91 9226856934) for emergency same-day treatment."
  },
  {
    id: "gh3",
    category: "General Oral Health",
    q: "How often should I see the dentist?",
    a: "Every 6 months for a routine preventive check-up and ultrasonic cleaning. Regular visits detect microscopic decay and hairline fractures long before they cause pain, saving you time, tooth structure, and treatment expenses."
  },
  {
    id: "gh4",
    category: "General Oral Health",
    q: "How often should you get your teeth cleaned?",
    a: "Every 6 months is ideal for most adults. Patients with a tendency for heavy calculus accumulation, orthodontic braces, or smokers may benefit from cleanings every 3–4 months."
  },
  {
    id: "gh5",
    category: "General Oral Health",
    q: "Is preventive dentistry applicable for everyone?",
    a: "Absolutely. Preventive dentistry—fluoride therapies, pit and fissure sealants, scaling, and night guards—is suitable for every age group from toddlers to seniors. It preserves natural enamel and minimizes the need for invasive treatments."
  },
  {
    id: "gh6",
    category: "General Oral Health",
    q: "How do I know if I have a cavity?",
    a: "Early cavities often have zero symptoms, appearing only as tiny chalky white or brown spots. As decay advances, you may notice food getting stuck between teeth, sensitivity to cold or sweets, visible dark holes, or spontaneous pain."
  },
  {
    id: "gh7",
    category: "General Oral Health",
    q: "What causes bad breath (halitosis) and how can I treat it?",
    a: "Over 85% of bad breath originates from anaerobic bacteria hiding in deep plaque, tartar between teeth, gum pockets, or the back of the tongue. A professional ultrasonic scaling session, daily tongue cleaning, and flossing resolve persistent bad breath effectively."
  },
  {
    id: "gh8",
    category: "General Oral Health",
    q: "Why are my teeth sensitive to hot and cold?",
    a: "Dentin hypersensitivity occurs when the protective outer enamel thins (from aggressive brushing, teeth grinding, or acidic food) or when gums recede, exposing microscopic dentinal tubules. We treat this using desensitizing varnishes, bonding, or addressing underlying decay."
  },
  {
    id: "gh9",
    category: "General Oral Health",
    q: "Can gum disease affect my overall health?",
    a: "Yes. Clinical research shows strong links between chronic periodontal disease and systemic health conditions, including cardiovascular disease, diabetes management complications, respiratory conditions, and adverse pregnancy outcomes. Oral health is integral to overall wellness."
  },
  {
    id: "gh10",
    category: "General Oral Health",
    q: "What is the correct way to brush and floss teeth?",
    a: "Use a soft-bristled brush held at a 45-degree angle to the gum line. Use gentle short vibratory or circular strokes for 2 full minutes twice daily. Floss once daily using a gentle C-shape hug around each tooth curve to clean interdental areas a toothbrush cannot reach."
  },
  {
    id: "gh11",
    category: "General Oral Health",
    q: "What foods should I avoid for good dental health?",
    a: "Minimize frequent snacking on sticky sugary candies, carbonated sodas, and refined carbohydrates, which feed acid-producing oral bacteria. Drink water after consuming acidic foods like citrus fruits or coffee, and eat calcium-rich foods and crunchy vegetables."
  },
  {
    id: "gh12",
    category: "General Oral Health",
    q: "Is mouthwash necessary if I brush and floss regularly?",
    a: "Mouthwash is a supportive adjunct, not a replacement for brushing and flossing. An alcohol-free, antibacterial or fluoride mouthwash provides extra fresh breath and remineralization, especially for patients prone to cavities."
  },

  // ── 4. ROOT CANAL & TOOTH EXTRACTION ──
  {
    id: "rc1",
    category: "Root Canal & Extraction",
    q: "What is root canal treatment (RCT)?",
    a: "Root canal treatment is a conservative procedure designed to save an infected or badly broken tooth that would otherwise need extraction. The inflamed inner pulp nerve is gently removed, the internal canals are disinfected with medical irrigants, and the space is hermetically sealed with biocompatible gutta-percha."
  },
  {
    id: "rc2",
    category: "Root Canal & Extraction",
    q: "Is root canal treatment painful?",
    a: "No! At The Aesthetic Villa, we use computerized apex locators, advanced nickel-titanium rotary files, and high-potency local anesthetics. Patients consistently report that the procedure feels no more uncomfortable than having a regular dental filling."
  },
  {
    id: "rc3",
    category: "Root Canal & Extraction",
    q: "What will happen if I don’t do the root canal treatment?",
    a: "The bacterial infection will spread past the root apex into the surrounding jawbone, causing severe throbbing pain, facial swelling, abscess formation, and bone destruction. Eventually, the tooth becomes non-restorable and must be extracted."
  },
  {
    id: "rc4",
    category: "Root Canal & Extraction",
    q: "Do I need a crown after a root canal treatment?",
    a: "Yes, in the vast majority of back chewing teeth. Once the pulp is removed and decay cleared, the tooth structure becomes brittle. A custom zirconia or ceramic crown encases the tooth, restoring 100% chewing strength and preventing fracture."
  },
  {
    id: "rc5",
    category: "Root Canal & Extraction",
    q: "How painful is tooth extraction?",
    a: "With modern local anesthesia, the tooth and surrounding bone are completely numbed—you will only feel gentle pressure, but absolutely zero sharp pain. For post-extraction care, mild discomfort is easily managed with prescribed painkillers for 24–48 hours."
  },
  {
    id: "rc6",
    category: "Root Canal & Extraction",
    q: "Do wisdom teeth always cause problems?",
    a: "Not always, but third molars frequently lack sufficient jaw room, becoming impacted (trapped beneath gums or bone). Impacted wisdom teeth can damage adjacent second molars, trap food, cause recurrent infections (pericoronitis), or develop cysts, necessitating gentle surgical removal."
  },

  // ── 5. DENTAL IMPLANTS ──
  {
    id: "im1",
    category: "Dental Implants",
    q: "Is dental implant surgery painful?",
    a: "Dental implant placement is performed under precise local anesthesia and is generally far gentler than a tooth extraction. Most patients resume work the very next day with only mild soreness managed by standard analgesics."
  },
  {
    id: "im2",
    category: "Dental Implants",
    q: "Who is a good candidate for dental implants?",
    a: "Any adult with one or more missing teeth, healthy gums, and adequate jawbone density is an excellent candidate. Even if bone volume is reduced, modern bone grafting techniques enable successful implant placement. Controlled diabetics and seniors are also eligible."
  },
  {
    id: "im3",
    category: "Dental Implants",
    q: "How long do dental implants last?",
    a: "Dental implants have a documented clinical success rate above 98% and are designed for longterm durability, often lasting 25+ years or a lifetime with good oral hygiene and regular 6-month checkups."
  },
  {
    id: "im4",
    category: "Dental Implants",
    q: "How long does the dental implant procedure take?",
    a: "The surgical fixture placement takes roughly 30–60 minutes per implant. A biological healing period of 2–3 months allows the titanium post to fuse with the jawbone (osseointegration) before the custom ceramic crown is securely attached."
  },
  {
    id: "im5",
    category: "Dental Implants",
    q: "What is the recovery time after a dental implant?",
    a: "Initial soft tissue healing occurs within 48 to 72 hours. Most patients return to normal daily routines within 24 hours while following soft-food guidelines for the first few days."
  },
  {
    id: "im6",
    category: "Dental Implants",
    q: "Can implants be done for multiple missing teeth?",
    a: "Yes. Options range from single-tooth implants to implant-supported multi-unit bridges and full-arch 'All-on-4' or 'All-on-6' rehabilitations that replace an entire set of teeth with permanent stability."
  },

  // ── 6. ORTHODONTICS & BRACES ──
  {
    id: "or1",
    category: "Orthodontics & Braces",
    q: "What is the difference between a dentist and an orthodontist?",
    a: "A general dental surgeon diagnoses and treats oral health, cavities, gum disease, and crowns. An orthodontist is a dental specialist focused on diagnosing, preventing, and correcting teeth misalignment, crooked bites, and jaw discrepancies using braces and aligners."
  },
  {
    id: "or2",
    category: "Orthodontics & Braces",
    q: "What is the difference between metal braces and invisible braces (Invisalign / Clear Aligners)?",
    a: "Traditional braces use metal or ceramic brackets bonded to teeth connected by wires. Clear aligners are custom-molded, medical-grade transparent trays that are virtually invisible, removable during meals, and allow effortless brushing and flossing without dietary restrictions."
  },
  {
    id: "or3",
    category: "Orthodontics & Braces",
    q: "At what age can orthodontic treatment begin?",
    a: "The Indian Orthodontic Society recommends an initial orthodontic screening by age 7 to detect early jaw growth discrepancies. Active braces or aligner treatment typically begins between ages 11 and 14 once permanent teeth have erupted, but adults can begin at any age."
  },
  {
    id: "or4",
    category: "Orthodontics & Braces",
    q: "Can adults also get braces?",
    a: "Absolutely! Over 40% of our orthodontic patients are adults. Healthy teeth can be moved at any age. With invisible clear aligners and discreet ceramic brackets, adults achieve straight teeth with zero professional embarrassment."
  },
  {
    id: "or5",
    category: "Orthodontics & Braces",
    q: "How do I care for my braces and teeth during orthodontic treatments?",
    a: "Use an orthodontic V-trim toothbrush, interdental brushes between brackets, and floss threaders. Avoid biting into hard ice, sticky caramels, or whole hard nuts that could dislodge brackets. Rinse thoroughly after every meal."
  },
  {
    id: "or6",
    category: "Orthodontics & Braces",
    q: "What happens after braces are removed — do I need a retainer?",
    a: "Yes. Retainers are essential to stabilize teeth in their new positions while bone and ligament remodel. We provide comfortable clear invisible retainers or bonded lingual retainers to ensure your smile remains permanently straight."
  },

  // ── 7. CROWNS, BRIDGES & DENTURES ──
  {
    id: "cb1",
    category: "Crowns, Bridges & Dentures",
    q: "How long do dental crowns last?",
    a: "High-grade Monolithic Zirconia and E-max ceramic crowns typically last 15 to 20+ years with proper hygiene, daily flossing, and avoiding non-food biting habits (like opening bottles or pens)."
  },
  {
    id: "cb2",
    category: "Crowns, Bridges & Dentures",
    q: "What is the difference between a crown and a bridge?",
    a: "A crown is a custom protective 'cap' covering a single damaged or root-canal-treated tooth. A bridge spans the gap of one or more missing teeth by anchoring to the natural teeth on either side with artificial teeth in between."
  },
  {
    id: "cb3",
    category: "Crowns, Bridges & Dentures",
    q: "Are dentures removable or permanent?",
    a: "Traditional complete and partial dentures are removable for cleaning and sleeping. Alternatively, modern implant-supported dentures (overdentures or fixed hybrid prostheses) are permanently anchored onto titanium implants for rock-solid chewing stability."
  },
  {
    id: "cb4",
    category: "Crowns, Bridges & Dentures",
    q: "How long does it take to get used to new dentures?",
    a: "It usually takes 2 to 4 weeks for the tongue, cheeks, and oral tissues to adapt. Eating soft foods in small bites and reading aloud helps your speech and bite normalize quickly."
  },
  {
    id: "cb5",
    category: "Crowns, Bridges & Dentures",
    q: "What’s the best way to take care of dentures?",
    a: "Rinse dentures after meals and brush them daily with a soft denture brush and mild non-abrasive cleanser (avoid boiling water or standard harsh abrasive toothpastes). Soak them overnight in clean water or a specialized denture cleansing solution."
  },
  {
    id: "cb6",
    category: "Crowns, Bridges & Dentures",
    q: "Can I sleep with my dentures on?",
    a: "We recommend removing dentures at night. Taking them out relieves pressure on your gum tissues, prevents fungal irritation (denture stomatitis), and allows your mouth to rest naturally."
  },

  // ── 8. COSMETIC DENTISTRY ──
  {
    id: "cs1",
    category: "Cosmetic Dentistry",
    q: "What is tooth whitening?",
    a: "Teeth whitening is a safe, non-invasive clinical cosmetic procedure using medical-grade carbamide or hydrogen peroxide gels that break down deep organic stains caused by tea, coffee, wine, and aging, brightening enamel by 2 to 4 shades."
  },
  {
    id: "cs2",
    category: "Cosmetic Dentistry",
    q: "How long does teeth whitening last?",
    a: "In-office clinical whitening results typically last 1 to 3 years depending on your dietary habits (coffee, tea, smoking) and oral hygiene maintenance."
  },
  {
    id: "cs3",
    category: "Cosmetic Dentistry",
    q: "What common dental problems are suitable for cosmetic dentistry?",
    a: "Cosmetic dentistry corrects discolored teeth, chipped or fractured edges, gaps between teeth (diastema), minor misalignments, uneven gummy smiles, and worn-down or misshapen enamel."
  },
  {
    id: "cs4",
    category: "Cosmetic Dentistry",
    q: "What are dental veneers and how are they different from crowns?",
    a: "Veneers are ultra-thin porcelain or composite shells bonded exclusively to the front surface of teeth with minimal enamel preparation (0.3–0.5mm). Crowns, by contrast, encase the entire 360-degree tooth structure to provide structural strength."
  },
  {
    id: "cs5",
    category: "Cosmetic Dentistry",
    q: "Can cosmetic dentistry fix a chipped or broken tooth?",
    a: "Yes! Minor chips are repaired in a single 30-minute appointment using color-matched composite bonding. Larger fractures are seamlessly restored with custom ceramic veneers or zirconia crowns."
  },
  {
    id: "cs6",
    category: "Cosmetic Dentistry",
    q: "What is smile designing and who needs it?",
    a: "Digital Smile Designing (DSD) is a personalized aesthetic treatment that plans the ideal harmony between your facial features, lips, gum line, and tooth proportions. Anyone seeking to enhance smile symmetry, shade, or overall confidence is an ideal candidate."
  },
  {
    id: "cs7",
    category: "Cosmetic Dentistry",
    q: "How long will my smile makeover take?",
    a: "Simple smile makeovers (composite bonding or clinical teeth whitening) take just 1 to 2 visits. Comprehensive makeovers involving custom porcelain veneers or crowns typically take 7 to 10 days from digital design to final placement."
  },

  // ── 9. PEDIATRIC CARE & DENTAL ANXIETY ──
  {
    id: "pa1",
    category: "Pediatric Care & Anxiety",
    q: "At what age should I bring my child for the first dental visit?",
    a: "According to pediatric guidelines, a child should visit the dentist upon eruption of their first milk tooth or by their first birthday ('First visit by first birthday'). This establishes a positive rapport and screens for early nursing bottle cavities."
  },
  {
    id: "pa2",
    category: "Pediatric Care & Anxiety",
    q: "How often should my child see a Pediatric Dentist?",
    a: "Every 6 months. Children's enamel is thinner than adult enamel, meaning cavities progress faster. Regular checkups ensure preventive fluoride applications and timely cavity detection."
  },
  {
    id: "pa3",
    category: "Pediatric Care & Anxiety",
    q: "I am very anxious about dental visits. What can you do to help?",
    a: "Dental anxiety is very common, and our clinic was intentionally designed as an unhurried, calm sanctuary to alleviate it. Dr. Tejashree uses a gentle 'Tell-Show-Do' method, topical pre-numbing gels so you never feel an injection prick, calming ambient lighting, and frequent comfort pauses so you are always in control."
  },
  {
    id: "pa4",
    category: "Pediatric Care & Anxiety",
    q: "What hygiene and sterilization practices does the clinic follow?",
    a: "We adhere to international CDC and hospital-grade sterilization standards: multi-stage ultrasonic cleaning, Class-B vacuum autoclave sterilization with digital spore-test verification, sealed sterile instrument pouches opened in front of you, and strictly single-use disposables."
  },
  {
    id: "pa5",
    category: "Pediatric Care & Anxiety",
    q: "Are dental treatments safe during pregnancy?",
    a: "Yes. Routine checkups, emergency toothache relief, and cleanings are safe and recommended. Hormonal changes during pregnancy frequently cause 'pregnancy gingivitis'. The second trimester is the safest and most comfortable period for elective dental care."
  },
  {
    id: "pa6",
    category: "Pediatric Care & Anxiety",
    q: "Can I get dental treatment if I have diabetes or a heart condition?",
    a: "Yes. Dr. Tejashree carefully reviews your medical history, current medications, and blood sugar levels before any procedure. We coordinate with your physician when necessary and use specialized cardiac-safe local anesthetics."
  },
  {
    id: "pa7",
    category: "Pediatric Care & Anxiety",
    q: "Are dental X-rays safe? How often should they be taken?",
    a: "Yes, completely safe. We use high-frequency digital X-ray sensors that emit up to 80–90% less radiation than conventional dental film—equivalent to less radiation than a standard 1-hour airplane flight. They are only taken when clinically indicated."
  },
  {
    id: "pa8",
    category: "Pediatric Care & Anxiety",
    q: "What are dental sealants and does my child need them?",
    a: "Dental sealants are thin, protective resin coatings painted onto the deep chewing grooves (fissures) of permanent back molars. They block food and bacteria from settling in crevices, reducing childhood cavities by up to 80%."
  },
  {
    id: "pa9",
    category: "Pediatric Care & Anxiety",
    q: "Should I be concerned about my child’s thumb-sucking habit?",
    a: "Thumb-sucking is completely normal in infants. However, if the habit persists beyond age 4 to 5 when permanent teeth prepare to erupt, it can cause narrow palate shapes and buck teeth. We provide gentle behavioral guidance and habit-breaking appliances if needed."
  },
  {
    id: "pa10",
    category: "Pediatric Care & Anxiety",
    q: "When do children start losing their milk teeth?",
    a: "Most children begin shedding their front lower incisors around age 6. The process continues in stages until around age 12 to 13 when the final primary molars are replaced by permanent premolars."
  }
];
