const PAYSTACK_BASE_URL = "https://api.paystack.co";

interface InitializeParams {
  email: string;
  amountNaira: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}

export async function initializePaystackTransaction(params: InitializeParams) {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      amount: Math.round(params.amountNaira * 100), // Paystack expects kobo
      reference: params.reference,
      callback_url: params.callbackUrl,
      metadata: params.metadata,
    }),
  });

  if (!response.ok) {
    throw new Error(`Paystack initialize failed: ${response.status} ${await response.text()}`);
  }

  const json = await response.json();
  return json.data as { authorization_url: string; reference: string };
}

export async function verifyPaystackTransaction(reference: string) {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
  });

  if (!response.ok) {
    throw new Error(`Paystack verify failed: ${response.status} ${await response.text()}`);
  }

  const json = await response.json();
  return {
    success: json.data?.status === "success",
    amountNaira: (json.data?.amount ?? 0) / 100,
    reference: json.data?.reference as string,
  };
}
