// ─── Quiz ────────────────────────────────────────────────────────────────────

export type Goal = "focus" | "sleep" | "fitness" | "skincare" | "wellness";

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
  | "ashwagandha"
  | "melatonin"
  | "vitaminD";

export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";

export interface QuizAnswers {
  goals: Goal[];
  proteinBase: ProteinBase | null;
  allergies: string[];
  flavors: FlavorOption[];
  age: number | null;
  weight: number | null;
  activityLevel: ActivityLevel | null;
}

// ─── Formula ─────────────────────────────────────────────────────────────────

export interface FormulaAddons {
  creatine: boolean;
  collagen: boolean;
  ashwagandha: boolean;
  melatonin: boolean;
  vitaminD: boolean;
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
    ashwagandha?: number; // mg
    melatonin?: number;   // mg
    vitaminD?: number;    // IU
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
