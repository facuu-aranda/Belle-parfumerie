// ============================================================
// DOCUMENTO CENTRAL DE CONTENIDOS — Belle Parfumerie
// Todos los textos del sitio se editan aquí.
// No tocar componentes UI para cambiar copy.
// ============================================================

export const siteContent = {
  // ── Marca ──────────────────────────────────────────────────
  brand: {
    name: "Belle Parfumerie",
    tagline: "Fragancias que despiertan emociones",
    description:
      "Tu destino para perfumes nicho y de lujo. Cada aroma cuenta una historia — encuentra la tuya.",
  },

  // ── Navegación ─────────────────────────────────────────────
  nav: {
    links: [
      { label: "Inicio", href: "/" },
      { label: "Catálogo", href: "/catalogo" },
      { label: "Ofertas", href: "/#ofertas" },
      { label: "FAQ", href: "/#faq" },
      { label: "Contacto", href: "/#contacto" },
    ],
    cta: "Explorar",
  },

  // ── Hero ───────────────────────────────────────────────────
  hero: {
    headline: "BELLE PARFUMERIE",
    subheadline: "Descubrí fragancias que despiertan tus sentidos y definen tu esencia.",
    cta: "Contactar por WhatsApp",
    secondaryLink: "Tu aroma te espera →",
    rightBlock: {
      label: "Ver Catálogo Completo",
      overlay: "Explorá nuestra colección curada",
    },
    bottomBlock: {
      badge: "Ofertas activas",
      label: "Ver promociones",
    },
  },

  // ── Experiencias Sensoriales ───────────────────────────────
  experiencias: {
    title: "Experiencias Sensoriales",
    subtitle:
      "Cada fragancia es un viaje. Descubrí las familias olfativas que definen nuestra colección.",
    cards: [
      {
        icon: "Droplets",
        title: "Notas Florales",
        description:
          "Rosa, jazmín, peonía — la elegancia de los jardines capturada en cada gota.",
      },
      {
        icon: "Flame",
        title: "Orientales & Ambarados",
        description:
          "Ámbar, vainilla, especias cálidas — fragancias envolventes para noches memorables.",
      },
      {
        icon: "TreePine",
        title: "Amaderadas & Terrosas",
        description:
          "Sándalo, cedro, vetiver — la fuerza serena de la naturaleza en estado puro.",
      },
      {
        icon: "Citrus",
        title: "Cítricas & Frescas",
        description:
          "Bergamota, neroli, limón — energía vibrante para el día a día.",
      },
    ],
  },

  // ── Ofertas ────────────────────────────────────────────────
  ofertas: {
    title: "Ofertas Especiales",
    subtitle: "Fragancias premium a precios irresistibles. Ediciones limitadas y descuentos exclusivos.",
    products: [
      {
        id: "of-1",
        name: "Rose Éternelle",
        originalPrice: "€285",
        offerPrice: "€199",
        discount: "-30%",
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=500&fit=crop",
      },
      {
        id: "of-2",
        name: "Nuit de Velours",
        originalPrice: "€340",
        offerPrice: "€238",
        discount: "-30%",
        image: "https://images.unsplash.com/photo-1594035910387-fea081e66b5d?w=400&h=500&fit=crop",
      },
      {
        id: "of-3",
        name: "Jardin Secret",
        originalPrice: "€195",
        offerPrice: "€136",
        discount: "-30%",
        image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&h=500&fit=crop",
      },
      {
        id: "of-4",
        name: "Ambre Sacré",
        originalPrice: "€420",
        offerPrice: "€294",
        discount: "-30%",
        image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400&h=500&fit=crop",
      },
      {
        id: "of-5",
        name: "Ciel d'Été",
        originalPrice: "€175",
        offerPrice: "€122",
        discount: "-30%",
        image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=500&fit=crop",
      },
      {
        id: "of-6",
        name: "Oud Impérial",
        originalPrice: "€520",
        offerPrice: "€364",
        discount: "-30%",
        image: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=500&fit=crop",
      },
    ],
    addToCart: "Agregar al carrito",
  },

  // ── Catálogo (página separada) ─────────────────────────────
  catalogo: {
    title: "Catálogo de Fragancias",
    subtitle: "Explorá nuestra colección completa de perfumes nicho y de lujo.",
    searchPlaceholder: "Buscar fragancia...",
    filters: {
      family: "Familia olfativa",
      price: "Precio",
      concentration: "Concentración",
      sort: "Ordenar por",
    },
    addToCart: "Agregar al carrito",
    families: ["Todas", "Floral", "Oriental", "Amaderada", "Cítrica", "Acuática"],
    concentrations: ["Todas", "Eau de Toilette", "Eau de Parfum", "Extrait de Parfum"],
    sortOptions: ["Relevancia", "Precio: menor a mayor", "Precio: mayor a menor", "Nombre A-Z"],
    products: [
      {
        id: "p-1",
        name: "Rose Éternelle",
        family: "Floral Oriental",
        concentration: "Eau de Parfum",
        notes: { top: "Rosa de Mayo", middle: "Oud", base: "Almizcle" },
        price: 285,
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&h=600&fit=crop",
        badge: "Bestseller",
        size: "50ml",
      },
      {
        id: "p-2",
        name: "Nuit de Velours",
        family: "Amaderada",
        concentration: "Eau de Parfum",
        notes: { top: "Bergamota", middle: "Iris", base: "Sándalo" },
        price: 340,
        image: "https://images.unsplash.com/photo-1594035910387-fea081e66b5d?w=500&h=600&fit=crop",
        badge: "Nuevo",
        size: "50ml",
      },
      {
        id: "p-3",
        name: "Jardin Secret",
        family: "Floral",
        concentration: "Eau de Toilette",
        notes: { top: "Peonía", middle: "Jazmín", base: "Vetiver" },
        price: 195,
        image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=500&h=600&fit=crop",
        badge: "Niche",
        size: "30ml",
      },
      {
        id: "p-4",
        name: "Ambre Sacré",
        family: "Oriental",
        concentration: "Extrait de Parfum",
        notes: { top: "Azafrán", middle: "Ámbar", base: "Vainilla" },
        price: 420,
        image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=500&h=600&fit=crop",
        size: "100ml",
      },
      {
        id: "p-5",
        name: "Ciel d'Été",
        family: "Cítrica",
        concentration: "Eau de Toilette",
        notes: { top: "Neroli", middle: "Flor de Azahar", base: "Cedro" },
        price: 175,
        image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500&h=600&fit=crop",
        size: "30ml",
      },
      {
        id: "p-6",
        name: "Oud Impérial",
        family: "Amaderada",
        concentration: "Extrait de Parfum",
        notes: { top: "Cardamomo", middle: "Oud", base: "Ámbar Gris" },
        price: 520,
        image: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=500&h=600&fit=crop",
        badge: "Edición Limitada",
        size: "100ml",
      },
      {
        id: "p-7",
        name: "Fleur de Lune",
        family: "Floral",
        concentration: "Eau de Parfum",
        notes: { top: "Lirio", middle: "Gardenia", base: "Musk blanco" },
        price: 260,
        image: "https://images.unsplash.com/photo-1595425964272-fc617fa19dfa?w=500&h=600&fit=crop",
        size: "50ml",
      },
      {
        id: "p-8",
        name: "Bois Mystique",
        family: "Amaderada",
        concentration: "Eau de Parfum",
        notes: { top: "Pimienta negra", middle: "Palo santo", base: "Oud" },
        price: 380,
        image: "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=500&h=600&fit=crop",
        badge: "Niche",
        size: "50ml",
      },
    ],
  },

  // ── FAQ ────────────────────────────────────────────────────
  faq: {
    title: "Preguntas Frecuentes",
    subtitle:
      "Todo lo que necesitás saber sobre nuestras fragancias, envíos y experiencia de compra.",
    items: [
      {
        question: "¿Cuánto dura una fragancia Eau de Parfum?",
        answer:
          "Un Eau de Parfum tiene una concentración del 15-20% y típicamente dura entre 6 y 10 horas en la piel. Los Extrait de Parfum pueden durar hasta 24 horas.",
      },
      {
        question: "¿Qué diferencia hay entre notas de salida, corazón y fondo?",
        answer:
          "Las notas de salida son las primeras que percibís (15-30 min). Las de corazón definen el carácter (2-4 horas). Las de fondo son la base duradera: maderas, almizcles y resinas.",
      },
      {
        question: "¿Qué es la perfumería nicho?",
        answer:
          "La perfumería nicho se refiere a casas independientes que priorizan la calidad artesanal sobre la producción masiva. Utilizan ingredientes naturales premium.",
      },
      {
        question: "¿Ofrecen muestras antes de comprar?",
        answer:
          "Sí. Ofrecemos un Discovery Set con 5 miniaturas de nuestros bestsellers por €35, reembolsable con tu primera compra completa.",
      },
      {
        question: "¿Cuál es la política de envío y devoluciones?",
        answer:
          "Envío gratuito en pedidos superiores a €150. Entrega express en 24-48h. Aceptamos devoluciones en 30 días con el producto sin abrir.",
      },
    ],
  },

  // ── Contacto ───────────────────────────────────────────────
  contacto: {
    title: "Contactanos",
    subtitle: "Estamos para ayudarte a encontrar tu fragancia ideal.",
    whatsapp: {
      number: "5491112345678",
      message: "Hola Belle Parfumerie! Me gustaría consultar sobre sus fragancias.",
      cta: "Escribinos por WhatsApp",
    },
    email: "bonjour@belleparfumerie.com",
    address: "42 Rue du Faubourg, Paris 75008",
    phone: "+33 1 42 68 53 00",
    social: {
      instagram: "#",
      facebook: "#",
    },
    form: {
      namePlaceholder: "Tu nombre",
      emailPlaceholder: "Tu email",
      messagePlaceholder: "Tu mensaje...",
      submit: "Enviar mensaje",
    },
  },

  // ── Footer ─────────────────────────────────────────────────
  footer: {
    description:
      "Tu destino para fragancias nicho y de lujo. Cada aroma cuenta una historia, encuentra la tuya.",
    columns: {
      nav: {
        title: "Navegación",
        links: ["Inicio", "Catálogo", "Ofertas", "FAQ", "Contacto"],
      },
      collections: {
        title: "Colecciones",
        links: ["Essentiel", "Signature", "Haute Parfumerie", "Ediciones Limitadas", "Discovery Sets"],
      },
    },
    contact: {
      title: "Contacto",
    },
    copyright: "© 2025 Belle Parfumerie. Todos los derechos reservados.",
    legal: ["Política de privacidad", "Términos y condiciones"],
  },

  // ── Carrito / WhatsApp ─────────────────────────────────────
  cart: {
    title: "Tu Carrito",
    empty: "Tu carrito está vacío",
    subtotal: "Subtotal",
    checkout: "Comprar por WhatsApp",
    whatsappNumber: "5491112345678",
    messageTemplate: (items: { name: string; qty: number; price: number }[], total: number) => {
      const lines = items.map((i) => `• ${i.name} x${i.qty} — €${i.price * i.qty}`).join("\n");
      return `Hola Belle Parfumerie! Quiero realizar el siguiente pedido:\n\n${lines}\n\n*Total: €${total}*\n\nGracias!`;
    },
  },
};
