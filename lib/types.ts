// ─── Quiz ────────────────────────────────────────────────────────────────────

export type Goal =
  | "weight_loss"
  | "focus"
  | "sleep"
  | "fitness"
  | "skincare"
  | "wellness";

export type ProteinBase = "plant" | "whey";

export type FlavorOption =
  | "mango"
  | "strawberry"
  | "blueberry"
  | "matcha"
  | "vanilla"
  | "chocolate";

export type Addon =
  | "creatine"
  | "collagen"
  | "vitaminC"
  | "vitaminDK2"
  | "bComplex"
  | "electrolyte"
  | "omega3"
  | "prebiotic"
  | "konjac"
  | "psyllium"
  | "melatonin";

export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";

export interface QuizAnswers {
  goals: Goal[];
  proteinBase: ProteinBase | null;
  allergies: string[];
  flavors: FlavorOption[];
  age: string | null;
  height: string | null;
  weight: string | null;
  activityLevel: ActivityLevel | null;
}

// ─── Formula ─────────────────────────────────────────────────────────────────

export interface FormulaAddons {
  creatine: boolean;
  collagen: boolean;
  vitaminC: boolean;
  vitaminDK2: boolean;
  bComplex: boolean;
  electrolyte: boolean;
  omega3: boolean;
  prebiotic: boolean;
  konjac: boolean;
  psyllium: boolean;
  melatonin: boolean;
}

export interface Formula {
  id: string;
  name: string;
  proteinBase: ProteinBase;
  flavors: FlavorOption[];
  addons: FormulaAddons;
  servingSize: number; // grams
  pricePerUnit: number; // CAD cents
}

// ─── Nutrition ───────────────────────────────────────────────────────────────

export interface NutritionFacts {
  calories: number;
  protein: number;   // g
  carbs: number;     // g
  fat: number;       // g
  fiber: number;     // g
  sugar: number;     // g
  sodium: number;    // mg
  addons: {
    creatine?: number;    // g
    collagen?: number;    // g
    vitaminC?: number;    // mg
    vitaminDK2?: boolean;
    bComplex?: boolean;
    electrolyte?: boolean;
    omega3?: number;      // mg
    prebiotic?: number;   // g
    konjac?: number;      // g
    psyllium?: number;    // g
    melatonin?: number;   // mg
  };
}

// ─── Cart ────────────────────────────────────────────────────────────────────

export interface CartItem {
  formula: Formula;
  quantity: number;
  variantId: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  checkoutUrl: string;
}

// ─── Shopify ─────────────────────────────────────────────────────────────────

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  variants: ShopifyVariant[];
}

export interface ShopifyVariant {
  id: string;
  title: string;
  price: string;
  availableForSale: boolean;
}
