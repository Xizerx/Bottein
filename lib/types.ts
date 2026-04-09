// ─── Quiz ────────────────────────────────────────────────────────────────────

export type Goal =
  | "weight_loss"
  | "focus"
  | "sleep"
  | "fitness"
  | "skincare"
  | "wellness";

export type ProteinBase = "plant" | "whey";

export type Sweetener = "full_bodied" | "slim" | "lean";

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
  sweetener: Sweetener | null;
  flavors: FlavorOption[];
  age: string | null;
  height: string | null;
  weight: string | null;
  activityLevel: ActivityLevel | null;
}

// ─── Quiz result stored in localStorage ──────────────────────────────────────

export interface StoredQuizResult {
  goals: Goal[];
  proteinBase: ProteinBase | null;
  allergies: string[];
  sweetener: Sweetener | null;
  flavors: FlavorOption[];
  age: string | null;
  height: string | null;
  weight: string | null;
  activityLevel: ActivityLevel | null;
  autoAddons: Addon[];
  recommendedAddons: Addon[];
  timestamp: number;
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
  servingSize: number;
  pricePerUnit: number;
}

// ─── Nutrition ───────────────────────────────────────────────────────────────

export interface NutritionFacts {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  addons: {
    creatine?: number;
    collagen?: number;
    vitaminC?: number;
    vitaminDK2?: boolean;
    bComplex?: boolean;
    electrolyte?: boolean;
    omega3?: number;
    prebiotic?: number;
    konjac?: number;
    psyllium?: number;
    melatonin?: number;
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
