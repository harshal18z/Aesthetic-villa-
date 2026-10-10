export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  source: "Google" | "JustDial";
  date?: string;
  isCustom?: boolean;
}

export const GOOGLE_REVIEWS: Review[] = [
  { id: "g1", name: "Florina Francis", rating: 5, source: "Google", text: "Absolutely an amazing experience with Dr. Tejashree. I would highly recommend her. I faced a serious dental issue and surprisingly I loved the way she communicated and explained me about my treatment. Very professional and caring." },
  { id: "g2", name: "Hanisha Chotaliya", rating: 5, source: "Google", text: "I had a wonderful experience at this dental clinic. The clinic is very clean, well-organized, and equipped with modern facilities. Dr. Tejashree Kulkarni is extremely professional, kind, and patient. She explained every procedure clearly." },
  { id: "g3", name: "Surekha Shilwant", rating: 5, source: "Google", text: "The dentist was extremely professional and friendly. She took time to explain the issue and treatment plan, which made me feel comfortable. The procedure was done smoothly and hygienically. The clinic was clean and well maintained." },
  { id: "g4", name: "Vishnu Nair", rating: 5, source: "Google", text: "I had a wonderful experience at The Aesthetic Villa. The doctor was incredibly reassuring and professional. She explained each step thoroughly, making me feel completely at ease." },
  { id: "g5", name: "Janhavi Sapkal", rating: 5, source: "Google", text: "I have major dental anxiety, but Dr. Tejashree Kulkarni and the hygienist were incredibly patient and gentle. They explained everything, made me feel safe, and I actually look forward to my next visit! A truly positive experience." },
  { id: "g6", name: "Vishwa Thumar", rating: 5, source: "Google", text: "Doctor is so kind and explained patiently and made sure that I was comfortable during the treatment. I truly appreciate her patience and kindness. Highly recommend this clinic to anyone looking for quality dental care." },
  { id: "g7", name: "Sneha Pedgaonkar", rating: 5, source: "Google", text: "Every visit feels like visiting a friend. The outstanding professionalism and friendliness of Dr Tejashree makes it a great experience. She has a professional, patient, and diligent approach." },
  { id: "g8", name: "Chaitanya Nikam", rating: 5, source: "Google", text: "I visited Dr. Tejashree for dental cleaning and I felt really good. Her hands are soft and she explained every detail. I am very happy and satisfied with the treatment. Looking forward to further treatment." },
];

export const JUSTDIAL_REVIEWS: Review[] = [
  { id: "jd1", name: "Rahul Sharma", rating: 5, source: "JustDial", text: "Excellent dental care! Dr. Tejashree is very gentle and explained everything clearly. Got my root canal done painlessly." },
  { id: "jd2", name: "Priya Deshmukh", rating: 5, source: "JustDial", text: "Best dental clinic in Kothrud. Very hygienic and modern equipment. Highly recommended!" },
  { id: "jd3", name: "Amit Patil", rating: 5, source: "JustDial", text: "Got my teeth cleaning done here. Very professional service and the clinic is very clean." },
  { id: "jd4", name: "Sneha Kulkarni", rating: 5, source: "JustDial", text: "Dr. Tejashree is amazing! She made my dental visit completely stress-free. Thank you!" },
  { id: "jd5", name: "Vikram Joshi", rating: 5, source: "JustDial", text: "Had a wisdom tooth removal. It was quick and painless. Great experience overall." },
  { id: "jd6", name: "Anita Wagh", rating: 5, source: "JustDial", text: "Very good clinic with experienced doctor. She takes time to explain the treatment properly." },
  { id: "jd7", name: "Rajesh Pawar", rating: 5, source: "JustDial", text: "Good clinic. Got my crown done here. Doctor is skilled and staff is friendly." },
  { id: "jd8", name: "Neha Gaikwad", rating: 5, source: "JustDial", text: "Wonderful experience! The clinic is well-maintained and the treatment was top-notch." },
  { id: "jd9", name: "Suresh Mane", rating: 5, source: "JustDial", text: "I've been visiting for 2 years now. Dr. Tejashree provides consistent quality care every time." },
  { id: "jd10", name: "Deepika Raut", rating: 5, source: "JustDial", text: "Got dental implants done here. Excellent results and very caring doctor." },
  { id: "jd11", name: "Sanjay Bhosale", rating: 5, source: "JustDial", text: "The best dental experience I've had. Clean clinic, advanced equipment, friendly staff." },
  { id: "jd12", name: "Pooja Nimbalkar", rating: 5, source: "JustDial", text: "Dr. Tejashree is very patient and kind. She made my child comfortable during the visit." },
  { id: "jd13", name: "Mahesh Kadam", rating: 5, source: "JustDial", text: "Good dental clinic with modern facilities. Reasonable pricing too." },
  { id: "jd14", name: "Swati Deshpande", rating: 5, source: "JustDial", text: "Highly recommend! Got my braces done here. Very professional treatment." },
  { id: "jd15", name: "Arun Salunkhe", rating: 5, source: "JustDial", text: "Excellent root canal treatment. No pain at all. Thank you Doctor!" },
  { id: "jd16", name: "Kavita Jadhav", rating: 5, source: "JustDial", text: "The clinic ambiance is very nice. Doctor explains each procedure before starting." },
  { id: "jd17", name: "Nitin Shinde", rating: 5, source: "JustDial", text: "Very satisfied with the teeth whitening results. Will definitely come back!" },
  { id: "jd18", name: "Ranjana More", rating: 5, source: "JustDial", text: "Best dentist in Pune! Very gentle and caring. My whole family visits here." },
  { id: "jd19", name: "Pramod Kulkarni", rating: 5, source: "JustDial", text: "Good experience. The doctor is knowledgeable and the clinic is well-equipped." },
  { id: "jd20", name: "Ashwini Phadke", rating: 5, source: "JustDial", text: "Got my tooth filling done. Quick, painless, and looks completely natural!" },
  { id: "jd21", name: "Vishal Takle", rating: 5, source: "JustDial", text: "Professional service with a personal touch. Dr. Tejashree truly cares about her patients." },
  { id: "jd22", name: "Manisha Apte", rating: 5, source: "JustDial", text: "Amazing clinic! Got dental cleaning and the results are fantastic." },
  { id: "jd23", name: "Sachin Lokhande", rating: 5, source: "JustDial", text: "Very trustworthy doctor. She doesn't recommend unnecessary treatments." },
  { id: "jd24", name: "Gauri Kale", rating: 5, source: "JustDial", text: "Best dental care in Kothrud area. The staff is very welcoming and helpful." },
  { id: "jd25", name: "Ramesh Gadgil", rating: 5, source: "JustDial", text: "Had a great experience with my complete denture. Fits perfectly!" },
  { id: "jd26", name: "Sunita Naik", rating: 5, source: "JustDial", text: "Very happy with my dental bridge. Looks and feels natural. Thank you!" },
  { id: "jd27", name: "Hemant Patel", rating: 5, source: "JustDial", text: "Excellent clinic with state-of-the-art equipment. Highly professional service." },
  { id: "jd28", name: "Archana Bhat", rating: 5, source: "JustDial", text: "Dr. Tejashree is wonderful with kids. My children love visiting her!" },
  { id: "jd29", name: "Yogesh Sawant", rating: 5, source: "JustDial", text: "Good dental clinic. Prices are fair and the quality of treatment is excellent." },
  { id: "jd30", name: "Rekha Chavan", rating: 5, source: "JustDial", text: "Got my partial denture from here. Very comfortable and natural-looking." },
  { id: "jd31", name: "Tushar Dange", rating: 5, source: "JustDial", text: "The best dentist I've visited. Very gentle approach and excellent results." },
  { id: "jd32", name: "Pallavi Gole", rating: 5, source: "JustDial", text: "Wonderful experience from start to finish. Clinic is very hygienic and modern." },
  { id: "jd33", name: "Kiran Sathe", rating: 5, source: "JustDial", text: "Dr. Tejashree did an amazing job with my tooth-colored fillings. Can't even tell!" },
  { id: "jd34", name: "Meera Jog", rating: 5, source: "JustDial", text: "Very professional and caring dentist. Makes you feel comfortable during treatment." },
  { id: "jd35", name: "Ajay Kelkar", rating: 5, source: "JustDial", text: "Great experience! The clinic uses latest technology. Highly recommended." },
  { id: "jd36", name: "Shubhangi Tawde", rating: 5, source: "JustDial", text: "Got scaling and polishing done. Teeth feel amazing now. Will visit regularly!" },
  { id: "jd37", name: "Vijay Pendse", rating: 5, source: "JustDial", text: "Nice clinic in Kothrud. Doctor is experienced and treatment is pain-free." },
  { id: "jd38", name: "Namrata Sane", rating: 5, source: "JustDial", text: "Very happy with the treatment. Doctor is knowledgeable and staff is courteous." },
  { id: "jd39", name: "Sandip Bhagwat", rating: 5, source: "JustDial", text: "Had a complex tooth extraction done here. Doctor handled it expertly." },
  { id: "jd40", name: "Vaishali Dixit", rating: 5, source: "JustDial", text: "Best dental clinic! Clean, modern, and the doctor is extremely skilled." },
  { id: "jd41", name: "Prakash Ranade", rating: 5, source: "JustDial", text: "Got my implant done here. Painless procedure and excellent follow-up care." },
  { id: "jd42", name: "Aarti Gokhale", rating: 5, source: "JustDial", text: "Dr. Tejashree is the best! She takes her time with each patient." }
];

export const ALL_REVIEWS: Review[] = [...GOOGLE_REVIEWS, ...JUSTDIAL_REVIEWS];
