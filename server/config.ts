// Hero slider configuration with ImageKit URLs
export const heroSliderConfig = {
  slides: [
    {
      id: 1,
      title: "Halwa Puri Nashta Deal",
      description: "2 Puri + 1 Plate Aloo + 1 Cup Halwa",
      price: "450",
      bgGradient: "from-amber-600/90 to-orange-800/90",
      imageUrl: process.env.HALWA_PURI_IMAGE_URL || "",
    },
    {
      id: 2,
      title: "Family BBQ Platter",
      description: "Malai Boti 6 Seekh + Naan + Raita",
      price: "2400",
      bgGradient: "from-red-700/90 to-red-900/90",
      imageUrl: process.env.BBQ_PLATTER_IMAGE_URL || "",
    },
    {
      id: 3,
      title: "Desi Murgh Karahi",
      description: "Full Karahi with 4 Naan",
      price: "3700",
      bgGradient: "from-orange-600/90 to-amber-800/90",
      imageUrl: process.env.KARAHI_IMAGE_URL || "",
    },
  ],
};
