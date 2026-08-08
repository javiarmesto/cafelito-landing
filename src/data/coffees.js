// src/data/coffees.js
export const coffees = [
  {
    id: 'WRB-COL',
    name: 'Colombia',
    type: 'Whole Roasted Beans',
    emoji: '🇨🇴',
    intensity: 4,
    acidity: 'Media',
    body: 'Redondo',
    notes: 'Caramelo, frutos rojos, naranja',
    price: 17.50,
    stock: 48,
    bg: 'linear-gradient(135deg, #3D2010 0%, #6B3A1F 100%)',
    region: 'Huila',
    altitude: '1.500 – 1.900 m',
    process: 'Lavado',
    description:
      'Un clásico que nunca falla: dulzor de caramelo, un toque de frutos rojos y un final ' +
      'cítrico limpio. Cultivado por pequeñas fincas del Huila, es el café de diario perfecto ' +
      'para espresso y filtro por igual.',
  },
  {
    id: 'WRB-BRA',
    name: 'Brasil',
    type: 'Whole Roasted Beans',
    emoji: '🇧🇷',
    intensity: 3,
    acidity: 'Baja',
    body: 'Cremoso',
    notes: 'Chocolate, nuez, vainilla',
    price: 18.50,
    stock: 32,
    bg: 'linear-gradient(135deg, #2D1A08 0%, #5C3317 100%)',
    region: 'Cerrado Mineiro',
    altitude: '900 – 1.200 m',
    process: 'Natural',
    description:
      'Proceso natural secado al sol que concentra todo el dulzor del fruto: chocolate con ' +
      'leche, nuez tostada y un fondo de vainilla. Cuerpo cremoso y acidez muy baja — ideal ' +
      'para los amantes del espresso intenso sin amargor.',
  },
  {
    id: 'WRB-ETH',
    name: 'Etiopía',
    type: 'Whole Roasted Beans',
    emoji: '🇪🇹',
    intensity: 3,
    acidity: 'Alta',
    body: 'Ligero',
    notes: 'Jazmín, melocotón, bergamota',
    price: 21.00,
    stock: 15,
    bg: 'linear-gradient(135deg, #1E1508 0%, #4A3010 100%)',
    region: 'Yirgacheffe',
    altitude: '1.800 – 2.200 m',
    process: 'Lavado',
    description:
      'De la cuna del café. Floral y delicado como un té: jazmín, melocotón blanco y esa ' +
      'chispa de bergamota que hace único al Yirgacheffe. En filtro V60 o Chemex es pura ' +
      'poesía — no lo escondas detrás de la leche.',
  },
  {
    id: 'WRB-KEN',
    name: 'Kenia',
    type: 'Whole Roasted Beans',
    emoji: '🇰🇪',
    intensity: 4,
    acidity: 'Alta',
    body: 'Brillante',
    notes: 'Grosella negra, tomate, lima',
    price: 22.00,
    stock: 20,
    bg: 'linear-gradient(135deg, #1A1005 0%, #3D2808 100%)',
    region: 'Nyeri',
    altitude: '1.700 – 2.000 m',
    process: 'Lavado doble (SL28/SL34)',
    description:
      'Para paladares aventureros: acidez vibrante de grosella negra y lima con esa nota ' +
      'salvaje a tomate que caracteriza a los SL28. Doble fermentación lavada al estilo ' +
      'keniano. Un café que no deja indiferente a nadie.',
  },
  {
    id: 'WDB-COL',
    name: 'Colombia Decaf',
    type: 'Whole Decaf Beans',
    emoji: '🌙',
    intensity: 3,
    acidity: 'Baja',
    body: 'Suave',
    notes: 'Chocolate con leche, almendra, miel',
    price: 19.50,
    stock: 28,
    bg: 'linear-gradient(135deg, #141010 0%, #2E1E18 100%)',
    region: 'Cauca',
    altitude: '1.600 – 1.850 m',
    process: 'Descafeinado sugarcane (E.A.)',
    description:
      'Descafeinado con proceso de caña de azúcar que respeta el perfil del grano: chocolate ' +
      'con leche, almendra y un final meloso. Todo el sabor, nada de cafeína — el compañero ' +
      'perfecto para las sobremesas largas.',
  },
  {
    id: 'WRB-HAW',
    name: 'Hawaii',
    type: 'Whole Roasted Beans',
    emoji: '🌺',
    intensity: 2,
    acidity: 'Baja',
    body: 'Sedoso',
    notes: 'Macadamia, coco, caramelo suave',
    price: 34.00,
    stock: 8,
    bg: 'linear-gradient(135deg, #1A0E08 0%, #402010 100%)',
    region: 'Kona',
    altitude: '600 – 900 m',
    process: 'Lavado',
    description:
      'La joya de la casa. Kona auténtico de laderas volcánicas: sedoso, elegante, con notas ' +
      'de macadamia, coco y caramelo suave. Producción minúscula y demanda mundial — cuando ' +
      'se acaba, se acaba hasta la próxima cosecha.',
  },
]

// Resuelve una referencia flexible (id / sku / nombre exacto o parcial)
// contra el catálogo — usada por las acciones del agente
export function resolveCoffee(payload = {}) {
  const ref = String(
    payload.id ?? payload.item_id ?? payload.product_id ?? payload.sku ?? payload.name ?? ''
  ).trim().toLowerCase()
  if (!ref) return null
  return (
    coffees.find(c => c.id.toLowerCase() === ref) ||
    coffees.find(c => c.name.toLowerCase() === ref) ||
    coffees.find(c => c.name.toLowerCase().includes(ref)) ||
    null
  )
}
