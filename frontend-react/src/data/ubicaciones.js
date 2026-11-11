export const regionesChile = [
  {
    nombre: "Arica y Parinacota",
    comunas: ["Arica", "Camarones", "Putre", "General Lagos"],
  },
  {
    nombre: "Tarapacá",
    comunas: ["Iquique", "Alto Hospicio", "Pozo Almonte", "Pica"],
  },
  {
    nombre: "Antofagasta",
    comunas: ["Antofagasta", "Calama", "Tocopilla", "San Pedro de Atacama"],
  },
  {
    nombre: "Atacama",
    comunas: ["Copiapó", "Caldera", "Vallenar", "Chañaral"],
  },
  {
    nombre: "Coquimbo",
    comunas: ["La Serena", "Coquimbo", "Ovalle", "Illapel"],
  },
  {
    nombre: "Valparaíso",
    comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "San Antonio", "Los Andes"],
  },
  {
    nombre: "Metropolitana de Santiago",
    comunas: [
      "Alhué",
      "Buin",
      "Calera de Tango",
      "Cerrillos",
      "Cerro Navia",
      "Colina",
      "Conchalí",
      "Curacaví",
      "El Bosque",
      "El Monte",
      "Estación Central",
      "Huechuraba",
      "Independencia",
      "Isla de Maipo",
      "La Cisterna",
      "La Florida",
      "La Granja",
      "La Pintana",
      "La Reina",
      "Lampa",
      "Las Condes",
      "Lo Barnechea",
      "Lo Espejo",
      "Lo Prado",
      "Macul",
      "Maipú",
      "María Pinto",
      "Melipilla",
      "Ñuñoa",
      "Padre Hurtado",
      "Paine",
      "Pedro Aguirre Cerda",
      "Peñaflor",
      "Peñalolén",
      "Pirque",
      "Providencia",
      "Pudahuel",
      "Puente Alto",
      "Quilicura",
      "Quinta Normal",
      "Recoleta",
      "Renca",
      "San Bernardo",
      "San Joaquín",
      "San José de Maipo",
      "San Miguel",
      "San Pedro",
      "San Ramón",
      "Santiago",
      "Talagante",
      "Tiltil",
      "Vitacura",
    ],
  },
  {
    nombre: "Libertador General Bernardo O'Higgins",
    comunas: ["Rancagua", "San Fernando", "Santa Cruz", "Pichilemu"],
  },
  {
    nombre: "Maule",
    comunas: ["Talca", "Curicó", "Linares", "Constitución"],
  },
  {
    nombre: "Ñuble",
    comunas: ["Chillán", "San Carlos", "Quirihue", "Bulnes"],
  },
  {
    nombre: "Biobío",
    comunas: ["Concepción", "Talcahuano", "Los Ángeles", "Coronel"],
  },
  {
    nombre: "La Araucanía",
    comunas: ["Temuco", "Villarrica", "Angol", "Pucón"],
  },
  {
    nombre: "Los Ríos",
    comunas: ["Valdivia", "La Unión", "Panguipulli", "Río Bueno"],
  },
  {
    nombre: "Los Lagos",
    comunas: ["Puerto Montt", "Osorno", "Castro", "Ancud"],
  },
  {
    nombre: "Aysén del General Carlos Ibáñez del Campo",
    comunas: ["Coyhaique", "Aysén", "Chile Chico", "Cochrane"],
  },
  {
    nombre: "Magallanes y de la Antártica Chilena",
    comunas: ["Punta Arenas", "Puerto Natales", "Porvenir", "Cabo de Hornos"],
  },
];

export function obtenerComunas(nombreRegion) {
  return (
    regionesChile.find((region) => region.nombre === nombreRegion)?.comunas ?? []
  );
}
