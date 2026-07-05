const FLUTTERWAVE_BASE_URL = "https://api.flutterwave.com/v3";

interface InitializeParams {
  email: string;
  amountNaira: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}

export async function initializeFlutterwaveTransaction(params: InitializeParams) {
  const response = await fetch(`${FLUTTERWAVE_BASE_URL}/payments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tx_ref: params.reference,
      amount: params.amountNaira,
      currency: "NGN",
      redirect_url: params.callbackUrl,
      customer: { email: params.email },
      meta: params.metadata,
    }),
  });

  if (!response.ok) {
    throw new Error(`Flutterwave initialize failed: ${response.status} ${await response.text()}`);
  }

  const json = await response.json();
  return { authorization_url: json.data.link as string, reference: params.reference };
}

export async function verifyFlutterwaveTransaction(transactionId: string) {
  const response = await fetch(`${FLUTTERWAVE_BASE_URL}/transactions/${encodeURIComponent(transactionId)}/verify`, {
    headers: { Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}` },
  });

  if (!response.ok) {
    throw new Error(`Flutterwave verify failed: ${response.status} ${await response.text()}`);
  }

  const json = await response.json();
  return {
    success: json.data?.status === "successful",
    amountNaira: (json.data?.amount ?? 0) as number,
    reference: json.data?.tx_ref as string,
  };
}
