"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { MIN_ORDER_QTY } from "@/lib/cart";

export default function CartPage() {
  const { items, totals, updateQuantity, removeItem, ready } = useCart();

  const handleCheckout = async () => {
    // TODO: hand `items` to a Stripe Checkout Session via an API route
    // (e.g. POST /api/checkout) which returns a Stripe session URL.
    alert("Stripe checkout coming soon.");
  };

  if (!ready) {
    return (
      <div className="container-site pt-32 pb-20 text-center text-[var(--color-ink-muted)]">
        Loading cart…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-site pt-32 pb-20 max-w-xl text-center">
        <h1 className="heading-display text-4xl mb-4">Your cart is empty</h1>
        <p className="text-[var(--color-ink-muted)] mb-8">
          Build a bottle tailored to your goals — minimum {MIN_ORDER_QTY} per order.
        </p>
        <Link href="/builder" className="btn-primary">
          Start building
        </Link>
      </div>
    );
  }

  return (
    <div className="container-site pt-32 pb-20 max-w-5xl">
      <h1 className="heading-display text-4xl md:text-5xl mb-8">Your cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Line items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[var(--color-ink)] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-start gap-4"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[var(--color-ink)]">
                  {item.kind === "bottle" ? "BOTTEIN Bottle" : item.name}
                </p>
                <p className="text-sm text-[var(--color-ink-muted)] mb-3">
                  {item.description}
                </p>
                <details className="text-xs text-[var(--color-ink-muted)]">
                  <summary className="cursor-pointer hover:text-[var(--color-ink)]">
                    View breakdown
                  </summary>
                  <ul className="mt-2 space-y-1">
                    {item.lineItems.map((line, i) => (
                      <li key={i} className="flex justify-between">
                        <span>{line.label}</span>
                        <span className="tabular-nums">${line.price.toFixed(2)}</span>
                      </li>
                    ))}
                    <li className="flex justify-between border-t border-black/10 pt-1 mt-1 font-semibold text-[var(--color-ink)]">
                      <span>Per bottle</span>
                      <span className="tabular-nums">${item.unitPrice.toFixed(2)}</span>
                    </li>
                  </ul>
                </details>
              </div>

              <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                <QuantityStepper
                  value={item.quantity}
                  onChange={(q) => updateQuantity(item.id, q)}
                />
                <p className="font-bold text-[var(--color-ink)] tabular-nums">
                  ${(item.unitPrice * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-xs text-[var(--color-ink-muted)] hover:text-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-[var(--color-ink)] text-[var(--color-ink)] rounded-2xl p-6 sticky top-28 space-y-3">
            <h2 className="font-display text-xl font-bold mb-2">Order total</h2>
            <div className="flex justify-between text-sm text-[var(--color-ink-muted)]">
              <span>Items</span>
              <span>{totals.itemCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span className="tabular-nums">${totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax (13%)</span>
              <span className="tabular-nums">${totals.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-[var(--color-ink-muted)]">
              <span>Shipping</span>
              <span className="italic">Calculated at next step</span>
            </div>
            <div className="border-t border-black/10 pt-3 flex justify-between items-baseline">
              <span className="font-semibold">Total</span>
              <span className="font-display text-2xl font-bold tabular-nums">
                ${totals.total.toFixed(2)}
              </span>
            </div>

            {!totals.meetsMinimum && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                Minimum order is {totals.minQty} bottles. Add{" "}
                <strong>{totals.minQty - totals.itemCount}</strong> more to check out.
              </p>
            )}

            <button
              onClick={handleCheckout}
              disabled={!totals.meetsMinimum}
              className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Checkout
            </button>
            <Link
              href="/builder"
              className="block text-center text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
            >
              Continue building
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuantityStepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (q: number) => void;
}) {
  return (
    <div className="inline-flex items-center border border-black/15 rounded-full overflow-hidden">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        className="w-8 h-8 flex items-center justify-center hover:bg-black/5 transition-colors"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="w-8 text-center text-sm font-semibold tabular-nums">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="w-8 h-8 flex items-center justify-center hover:bg-black/5 transition-colors"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
