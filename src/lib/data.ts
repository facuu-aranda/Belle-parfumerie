export const statsBar = [
  { value: "+500", label: "Fragancias" },
  { value: "+3K", label: "Clientes" },
  { value: "100%", label: "Originales" },
  { value: "24h", label: "Envío express" },
];

export const teamMembers = [
  { name: "Belle Parfumerie", role: "Fundadora", image: "/team-placeholder.jpg" },
];

export const navLinks = [
  { label: "Home", href: "#" },
  { label: "Fragancias", href: "#fragancias" },
  { label: "Colecciones", href: "#colecciones" },
  { label: "Notas", href: "#blog" },
  { label: "FAQ", href: "#faq" },
];

export const heroStats = [
  { value: "+3K", label: "fragancias" },
  { value: "1.5K", label: "reseñas" },
];

export const serviceCards = [
  {
    icon: "Droplets",
    title: "Fragancias Exclusivas",
    description:
      "Curada selección de perfumes nicho de las casas más prestigiosas del mundo. Cada fragancia cuenta una historia única.",
    span: "normal",
  },
  {
    icon: "Sparkles",
    title: "Ediciones Limitadas",
    description:
      "Acceso anticipado a lanzamientos exclusivos y ediciones numeradas para coleccionistas exigentes.",
    span: "normal",
  },
  {
    icon: "Flower2",
    title: "Notas Olfativas",
    description:
      "Explora nuestro catálogo por familias olfativas: florales, amaderadas, orientales, cítricas y gourmand.",
    span: "normal",
  },
  {
    icon: "Crown",
    title: "Experiencia Sensorial",
    description:
      "Consultoría personalizada para encontrar la fragancia que mejor expresa tu esencia. Sesiones privadas disponibles.",
    span: "normal",
  },
];

export const perfumes = [
  {
    id: 1,
    name: "Rose Éternelle",
    family: "Floral Oriental",
    notes: { top: "Rosa de Mayo", middle: "Oud", base: "Almizcle" },
    price: "€285",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&h=600&fit=crop",
    badge: "Bestseller",
  },
  {
    id: 2,
    name: "Nuit de Velours",
    family: "Amaderada Especiada",
    notes: { top: "Bergamota", middle: "Iris", base: "Sándalo" },
    price: "€340",
    image: "https://images.unsplash.com/photo-1594035910387-fea081e66b5d?w=500&h=600&fit=crop",
    badge: "Nuevo",
  },
  {
    id: 3,
    name: "Jardin Secret",
    family: "Floral Verde",
    notes: { top: "Peonía", middle: "Jazmín", base: "Vetiver" },
    price: "€195",
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=500&h=600&fit=crop",
    badge: "Niche",
  },
  {
    id: 4,
    name: "Ambre Sacré",
    family: "Oriental Ambarado",
    notes: { top: "Azafrán", middle: "Ámbar", base: "Vainilla" },
    price: "€420",
    image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=500&h=600&fit=crop",
  },
  {
    id: 5,
    name: "Ciel d'Été",
    family: "Cítrica Acuática",
    notes: { top: "Neroli", middle: "Flor de Azahar", base: "Cedro" },
    price: "€175",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500&h=600&fit=crop",
  },
  {
    id: 6,
    name: "Oud Impérial",
    family: "Amaderada Oriental",
    notes: { top: "Cardamomo", middle: "Oud", base: "Ámbar Gris" },
    price: "€520",
    image: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=500&h=600&fit=crop",
    badge: "Edición Limitada",
  },
];

export const collections = [
  {
    name: "Essentiel",
    price: "€95",
    period: "/30ml",
    description: "Fragancias clásicas para el día a día con proyección elegante.",
    features: [
      "Eau de Toilette 30ml",
      "Familia olfativa a elegir",
      "Muestra de cortesía",
      "Envío estándar incluido",
    ],
    highlighted: false,
  },
  {
    name: "Signature",
    price: "€285",
    period: "/50ml",
    description: "Nuestra selección curada de fragancias nicho con carácter único.",
    features: [
      "Eau de Parfum 50ml",
      "Consultoría olfativa",
      "Set de 3 muestras",
      "Envío express incluido",
      "Grabado personalizado",
      "Caja de regalo premium",
    ],
    highlighted: true,
  },
  {
    name: "Haute Parfumerie",
    price: "€520",
    period: "/100ml",
    description: "Lo más exclusivo: extractos puros y ediciones limitadas numeradas.",
    features: [
      "Extrait de Parfum 100ml",
      "Sesión privada en boutique",
      "Set de 5 muestras exclusivas",
      "Envío premium asegurado",
      "Grabado artesanal",
      "Cofre de lujo numerado",
      "Acceso anticipado a lanzamientos",
    ],
    highlighted: false,
  },
];

export const testimonials = [
  {
    name: "Isabelle Moreau",
    text: "Rose Éternelle es simplemente hipnótica. Las notas de oud se entrelazan con la rosa de una forma que nunca había experimentado. Mi fragancia de firma.",
    aroma: "Rose Éternelle",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    rating: 5,
  },
  {
    name: "Laurent Dubois",
    text: "La consultoría olfativa fue una experiencia transformadora. Descubrí notas que jamás habría elegido por mi cuenta y ahora son mis favoritas absolutas.",
    aroma: "Ambre Sacré",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    rating: 5,
  },
  {
    name: "Camille Fontaine",
    text: "El packaging es una obra de arte y la fragancia supera cualquier expectativa. Oud Impérial tiene una profundidad que evoluciona durante horas en la piel.",
    aroma: "Oud Impérial",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    rating: 5,
  },
  {
    name: "Antoine Leclerc",
    text: "Belle Parfumerie entiende que un perfume es una extensión de tu personalidad. Cada visita a la boutique es una experiencia sensorial completa.",
    aroma: "Nuit de Velours",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    rating: 5,
  },
];

export const blogPosts = [
  {
    title: "Guía de Notas Olfativas: De la Cabeza al Fondo",
    excerpt:
      "Aprende a distinguir las notas de salida, corazón y fondo, y cómo evolucionan en tu piel a lo largo del día.",
    date: "Ene 15, 2025",
    category: "Guía Olfativa",
    image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600&h=400&fit=crop",
  },
  {
    title: "El Arte del Oud: La Madera Más Preciada",
    excerpt:
      "Descubre por qué el oud es el ingrediente más codiciado en la perfumería de lujo y cómo identificar su autenticidad.",
    date: "Ene 10, 2025",
    category: "Ingredientes",
    image: "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=600&h=400&fit=crop",
  },
  {
    title: "Tendencias en Perfumería Nicho 2025",
    excerpt:
      "Las casas independientes lideran la innovación olfativa. Exploramos las tendencias que definirán el año.",
    date: "Ene 5, 2025",
    category: "Tendencias",
    image: "https://images.unsplash.com/photo-1595425964272-fc617fa19dfa?w=600&h=400&fit=crop",
  },
];

export const faqs = [
  {
    question: "¿Cuánto dura una fragancia Eau de Parfum?",
    answer:
      "Un Eau de Parfum tiene una concentración del 15-20% y típicamente dura entre 6 y 10 horas en la piel. Los Extrait de Parfum pueden durar hasta 24 horas gracias a su concentración superior del 20-30%.",
  },
  {
    question: "¿Qué diferencia hay entre notas de salida, corazón y fondo?",
    answer:
      "Las notas de salida son las primeras que percibes (duran 15-30 min), generalmente cítricas o herbales. Las de corazón emergen después y definen el carácter (2-4 horas). Las de fondo son la base duradera: maderas, almizcles y resinas que permanecen todo el día.",
  },
  {
    question: "¿Qué es la perfumería nicho?",
    answer:
      "La perfumería nicho se refiere a casas independientes que priorizan la calidad artesanal sobre la producción masiva. Utilizan ingredientes naturales premium y crean fragancias con identidad única, a menudo en ediciones limitadas.",
  },
  {
    question: "¿Ofrecen muestras antes de comprar?",
    answer:
      "Sí. Cada colección incluye muestras de cortesía. También ofrecemos un Discovery Set con 5 miniaturas de nuestros bestsellers por €35, reembolsable con tu primera compra completa.",
  },
  {
    question: "¿Cuál es la política de envío y devoluciones?",
    answer:
      "Envío gratuito en pedidos superiores a €150. Entrega express en 24-48h. Aceptamos devoluciones en 30 días con el producto sin abrir. Los Discovery Sets no son reembolsables.",
  },
];
