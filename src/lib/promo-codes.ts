export type PromoCode = {
  code: string;
  label: string;
  percentOff?: number;
  amountOffPaise?: number;
};

const builtInCodes: PromoCode[] = [
  { code: "LAUNCH10", label: "10% off launch offer", percentOff: 10 },
  { code: "MENTOR500", label: "₹500 off", amountOffPaise: 50000 },
  { code: "STUDENT15", label: "15% student discount", percentOff: 15 },
];

function normalizeCode(code: string) {
  return code.trim().toUpperCase();
}

export function getPromoCodes(): PromoCode[] {
  return builtInCodes;
}

export function applyPromoCode(code: string | undefined, priceInPaise: number) {
  if (!code?.trim()) {
    return { finalAmount: priceInPaise, discountPaise: 0, label: null as string | null };
  }

  const normalized = normalizeCode(code);
  const promo = builtInCodes.find((item) => item.code === normalized);

  if (!promo) {
    return { finalAmount: priceInPaise, discountPaise: 0, label: null, error: "Invalid promo code." as const };
  }

  let discountPaise = 0;
  if (promo.percentOff) {
    discountPaise = Math.round((priceInPaise * promo.percentOff) / 100);
  } else if (promo.amountOffPaise) {
    discountPaise = promo.amountOffPaise;
  }

  discountPaise = Math.min(discountPaise, priceInPaise - 100);
  const finalAmount = Math.max(100, priceInPaise - discountPaise);

  return {
    finalAmount,
    discountPaise,
    label: promo.label,
    code: promo.code,
  };
}
