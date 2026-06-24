"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import {
  login,
  setSubscriptionIntent,
  type SubscriptionType,
} from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const readStoredPlan = (): SubscriptionType | null => {
  try {
    const stored = localStorage.getItem("subscriptionIntent");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { subscriptionIntent } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("checkoutEmail");
    if (storedEmail) setEmail(storedEmail);

    if (!subscriptionIntent) {
      const storedPlan = readStoredPlan();
      if (storedPlan) {
        dispatch(setSubscriptionIntent(storedPlan));
      }
    }

    setReady(true);
  }, [dispatch, subscriptionIntent]);

  // Luhn algorithm (real card validation)
const isValidCard = (num: string) => {
  const cleaned = num.replace(/\s/g, "");
  if (!/^\d{16}$/.test(cleaned)) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

const isFutureExpiry = (exp: string) => {
  if (!/^\d{2}\/\d{2}$/.test(exp)) return false;

  const [month, year] = exp.split("/").map(Number);

  if (month < 1 || month > 12) return false;

  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;

  return year > currentYear || (year === currentYear && month >= currentMonth);
};

  /* ---------------- HANDLE PAYMENT ---------------- */

const handlePayment = () => {
  setError("");

    if (!isValidCard(cardNumber)) {
      setError("Invalid card number");
      return;
    }

    if (!isFutureExpiry(expiry)) {
      setError("Invalid or expired date");
      return;
    }

    if (!/^\d{3,4}$/.test(cvc)) {
      setError("Invalid CVC");
      return;
    }

    dispatch(
      login({
        email: email || "test@email.com",
        subscription: 
          subscriptionIntent === "premium-plus"
          ? "premium-plus"
          : "premium",
      })
    );

    localStorage.removeItem("checkoutEmail");
    router.push("/for-you");
  };

  /* ---------------- SAFETY ---------------- */

  if (!ready) {
    return null;
  }

  if (!subscriptionIntent) {
    return (
      <div className="checkout-empty">
        <h2>No plan selected</h2>
        <p>Please go back and choose a plan.</p>
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* LEFT SIDE */}
        <div className="checkout-left">
          <span className="checkout-left__badge">Test Mode</span>
          <h2>Summarist</h2>

          <p className="checkout-left__plan">
            Subscribe to Summarist {subscriptionIntent}
          </p>

          <h1>{subscriptionIntent === "premium-plus" ? "$99.00" : "$9.99"}</h1>

          <p className="checkout-left__period">
            per {subscriptionIntent === "premium-plus" ? "year" : "month"}
          </p>

          <a
            href="https://docs.stripe.com/testing"
            target="_blank"
            rel="noopener noreferrer"
            className="checkout-left__link"
          >
            Use Stripe test cards →
          </a>
        </div>

        {/* RIGHT SIDE */}
        <div className="checkout-right">
          <h3>Contact information</h3>

          <div className="checkout-field">
            <label htmlFor="checkout-email">Email</label>
            <input id="checkout-email" value={email} disabled className="checkout-field__input" />
          </div>

          <h3>Payment method</h3>

          <div className="card-logos">
            <img src="/assets/visa.png" alt="Visa" />
            <img src="/assets/mastercard.png" alt="Mastercard" />
            <img src="/assets/amex.png" alt="American Express" />
          </div>

          <div className="checkout-payment">
            <div className="checkout-field">
              <label htmlFor="card-number">Card number</label>
              <input
                id="card-number"
                className="checkout-field__input"
                placeholder="1234 1234 1234 1234"
                value={cardNumber}
                onChange={(e) => {
                  let val = e.target.value.replace(/\D/g, "").slice(0, 16);
                  val = val.replace(/(.{4})/g, "$1 ").trim();
                  setCardNumber(val);
                }}
              />
            </div>

            <div className="checkout-field-row">
              <div className="checkout-field">
                <label htmlFor="card-expiry">Expiry</label>
                <input
                  id="card-expiry"
                  className="checkout-field__input"
                  placeholder="MM / YY"
                  maxLength={5}
                  value={expiry}
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, "").slice(0, 4);

                    if (val.length >= 3) {
                      val = val.slice(0, 2) + "/" + val.slice(2);
                    }

                    setExpiry(val);
                  }}
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="card-cvc">CVC</label>
                <input
                  id="card-cvc"
                  className="checkout-field__input"
                  placeholder="123"
                  maxLength={4}
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/\D/g, ""))}
                />
              </div>
            </div>

            <div className="checkout-field">
              <label htmlFor="card-name">Name on card</label>
              <input
                id="card-name"
                className="checkout-field__input"
                placeholder="Full name"
              />
            </div>
          </div>

          <button className="checkout-btn" onClick={handlePayment}>
            Subscribe
          </button>
          {error && <p className="checkout-error">{error}</p>}

          <p className="checkout-note">
            This is a test payment. Use Stripe test card: 4242 4242 4242 4242
          </p>
          <p className="checkout-note">
            Use any future expiration date and any numerical 3-digit CVC
          </p>
        </div>
      </div>
    </div>
  );
}
