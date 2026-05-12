import { Platform } from "react-native";
import Purchases, {
  type CustomerInfo,
  type PurchasesPackage,
} from "react-native-purchases";

export const PREMIUM_ENTITLEMENT_ID = "premium" as const;
export const PREMIUM_PRODUCT_ID = "premium_lifetime" as const;

const PLACEHOLDER_TEST_KEY = "test_PLACEHOLDER_REVENUECAT_TEST_KEY";
const PLACEHOLDER_IOS_KEY = "appl_PLACEHOLDER_REVENUECAT_IOS_KEY";
const PLACEHOLDER_ANDROID_KEY = "goog_PLACEHOLDER_REVENUECAT_ANDROID_KEY";

function getRCToken(): string {
  if (__DEV__ || Platform.OS === "web") {
    return (
      process.env.EXPO_PUBLIC_REVENUECAT_TEST_API_KEY ?? PLACEHOLDER_TEST_KEY
    );
  }
  return (
    Platform.select({
      ios:
        process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY ?? PLACEHOLDER_IOS_KEY,
      android:
        process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY ??
        PLACEHOLDER_ANDROID_KEY,
      default:
        process.env.EXPO_PUBLIC_REVENUECAT_TEST_API_KEY ?? PLACEHOLDER_TEST_KEY,
    }) ?? PLACEHOLDER_TEST_KEY
  );
}

export function isPlaceholderKey(): boolean {
  const key = getRCToken();
  return key.includes("PLACEHOLDER");
}

let configured = false;

export function configurePurchases(): void {
  if (configured) return;
  if (Platform.OS === "web") {
    console.log("[Purchases] web platform — skipping native configure");
    configured = true;
    return;
  }
  try {
    const apiKey = getRCToken();
    if (isPlaceholderKey()) {
      console.log(
        "[Purchases] Using placeholder RevenueCat API key — purchases will not complete until real keys are set."
      );
    }
    Purchases.configure({ apiKey });
    configured = true;
    console.log("[Purchases] configured for", Platform.OS);
  } catch (e) {
    console.log("[Purchases] configure failed", e);
  }
}

if (Platform.OS !== "web") {
  configurePurchases();
}

export async function fetchPremiumPackage(): Promise<PurchasesPackage | null> {
  if (Platform.OS === "web" || isPlaceholderKey()) {
    console.log("[Purchases] fetchPremiumPackage skipped (web/placeholder)");
    return null;
  }
  const offerings = await Purchases.getOfferings();
  const current = offerings.current;
  if (!current) {
    console.log("[Purchases] no current offering");
    return null;
  }
  const lifetime =
    current.lifetime ??
    current.availablePackages.find(
      (p) => p.product.identifier === PREMIUM_PRODUCT_ID
    ) ??
    current.availablePackages[0] ??
    null;
  return lifetime ?? null;
}

export type PurchaseOutcome =
  | { kind: "success"; isPremium: boolean }
  | { kind: "cancelled" }
  | { kind: "pending" }
  | { kind: "placeholder" }
  | { kind: "error"; message: string };

function hasPremium(info: CustomerInfo | null | undefined): boolean {
  if (!info) return false;
  return Boolean(info.entitlements.active[PREMIUM_ENTITLEMENT_ID]);
}

export async function purchasePremium(): Promise<PurchaseOutcome> {
  if (Platform.OS === "web" || isPlaceholderKey()) {
    console.log("[Purchases] purchasePremium skipped (web/placeholder)");
    return { kind: "placeholder" };
  }
  try {
    const pkg = await fetchPremiumPackage();
    if (!pkg) {
      return { kind: "error", message: "Premium is not available right now." };
    }
    const result = await Purchases.purchasePackage(pkg);
    return { kind: "success", isPremium: hasPremium(result.customerInfo) };
  } catch (e: unknown) {
    const err = e as {
      userCancelled?: boolean;
      code?: string;
      message?: string;
    };
    if (err?.userCancelled) {
      console.log("[Purchases] user cancelled");
      return { kind: "cancelled" };
    }
    if (err?.code === "PAYMENT_PENDING_ERROR") {
      return { kind: "pending" };
    }
    console.log("[Purchases] purchase error", err);
    return {
      kind: "error",
      message: err?.message ?? "Something went wrong. Please try again.",
    };
  }
}

export async function restorePremium(): Promise<PurchaseOutcome> {
  if (Platform.OS === "web" || isPlaceholderKey()) {
    console.log("[Purchases] restorePremium skipped (web/placeholder)");
    return { kind: "placeholder" };
  }
  try {
    const info = await Purchases.restorePurchases();
    return { kind: "success", isPremium: hasPremium(info) };
  } catch (e: unknown) {
    const err = e as { message?: string };
    console.log("[Purchases] restore error", err);
    return {
      kind: "error",
      message: err?.message ?? "Could not restore purchases.",
    };
  }
}

export async function getCurrentCustomerInfo(): Promise<CustomerInfo | null> {
  if (Platform.OS === "web" || isPlaceholderKey()) return null;
  try {
    return await Purchases.getCustomerInfo();
  } catch (e) {
    console.log("[Purchases] getCustomerInfo error", e);
    return null;
  }
}

export function customerHasPremium(info: CustomerInfo | null): boolean {
  return hasPremium(info);
}
