export type InvestmentType = "one-time" | "monthly";
export type Currency = "GBP" | "USD" | "EUR";

export type RoiInputs = {
  visitors: number;
  conversionRate: number;
  averageValue: number;
  liftPercent: number;
  investment: number;
  months: number;
  investmentType: InvestmentType;
};

export type RoiResult = {
  currentRate: number;
  newRate: number;
  currentConversions: number;
  newConversions: number;
  extraConversions: number;
  extraMonthly: number;
  extraHorizon: number;
  totalInvestment: number;
  netReturn: number;
  roiPercent: number;
  paybackMonths: number | null;
};

export const CURRENCY_SYMBOL: Record<Currency, string> = {
  GBP: "£",
  USD: "$",
  EUR: "€",
};

export const PRESETS: Record<
  string,
  RoiInputs & { label: string; blurb: string }
> = {
  "lead-gen": {
    label: "Lead gen",
    blurb: "A service business turning visits into qualified enquiries.",
    visitors: 8000,
    conversionRate: 1.8,
    averageValue: 450,
    liftPercent: 30,
    investment: 8000,
    months: 12,
    investmentType: "one-time",
  },
  ecommerce: {
    label: "Ecommerce",
    blurb: "A catalogue site lifting add-to-cart and checkout completion.",
    visitors: 25000,
    conversionRate: 2.4,
    averageValue: 85,
    liftPercent: 20,
    investment: 12000,
    months: 12,
    investmentType: "one-time",
  },
  saas: {
    label: "SaaS",
    blurb: "A product site improving trial starts from existing traffic.",
    visitors: 12000,
    conversionRate: 3.2,
    averageValue: 1800,
    liftPercent: 18,
    investment: 15000,
    months: 12,
    investmentType: "one-time",
  },
};

export function clampNumber(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function calculateRoi(input: RoiInputs): RoiResult {
  const visitors = Math.max(0, input.visitors);
  const conversionRate = clampNumber(input.conversionRate, 0, 100);
  const averageValue = Math.max(0, input.averageValue);
  const liftPercent = clampNumber(input.liftPercent, 0, 500);
  const investment = Math.max(0, input.investment);
  const months = clampNumber(input.months, 1, 60);

  const currentRate = conversionRate / 100;
  const newRate = currentRate * (1 + liftPercent / 100);
  const currentConversions = visitors * currentRate;
  const newConversions = visitors * newRate;
  const extraConversions = newConversions - currentConversions;
  const extraMonthly = extraConversions * averageValue;
  const extraHorizon = extraMonthly * months;
  const totalInvestment =
    input.investmentType === "monthly" ? investment * months : investment;
  const netReturn = extraHorizon - totalInvestment;
  const roiPercent = totalInvestment > 0 ? (netReturn / totalInvestment) * 100 : 0;
  const paybackMonths = extraMonthly > 0 ? totalInvestment / extraMonthly : null;

  return {
    currentRate,
    newRate,
    currentConversions,
    newConversions,
    extraConversions,
    extraMonthly,
    extraHorizon,
    totalInvestment,
    netReturn,
    roiPercent,
    paybackMonths,
  };
}

export function formatCurrency(value: number, currency: Currency): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: value >= 100 ? 0 : 2,
  }).format(value);
}

export function formatNumber(value: number, digits = 1): string {
  return new Intl.NumberFormat("en-GB", {
    maximumFractionDigits: digits,
    minimumFractionDigits: Number.isInteger(value) ? 0 : Math.min(digits, 1),
  }).format(value);
}

export function formatPercent(value: number, digits = 1): string {
  return `${formatNumber(value, digits)}%`;
}

export function formatPayback(months: number | null): string {
  if (months === null || !Number.isFinite(months)) return "—";
  if (months < 1) return "< 1 month";
  if (months < 1.05) return "1 month";
  if (months < 12) return `${formatNumber(months, 1)} months`;
  const years = months / 12;
  return `${formatNumber(years, 1)} years`;
}
