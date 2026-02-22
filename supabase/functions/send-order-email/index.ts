// supabase/functions/send-order-email/index.ts
// Deploy with: supabase functions deploy send-order-email
// (JWT verification enabled by default — called by authenticated users)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { orderId } = await req.json();
    if (!orderId) return json({ error: "orderId is required" }, 400);

    // Verify the caller is the order owner
    const jwt = req.headers.get("authorization")?.replace("Bearer ", "");
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const {
      data: { user },
      error: userErr,
    } = await supabaseAdmin.auth.getUser(jwt!);

    if (userErr || !user) {
      return json({ error: "Authentication required" }, 401);
    }

    // Fetch order with items and profile
    const { data: order, error: orderErr } = await supabaseAdmin
      .from("orders")
      .select("*, order_items(*), profiles(email, full_name)")
      .eq("id", orderId)
      .eq("user_id", user.id) // Verify ownership
      .single();

    if (orderErr || !order) {
      return json({ error: "Order not found" }, 404);
    }

    // Send emails via Resend
    const resendKey = Deno.env.get("RESEND_API_KEY");
    const adminEmail = Deno.env.get("ADMIN_EMAIL");
    const fromEmail = Deno.env.get("FROM_EMAIL") || "orders@theairaedit.com";

    if (!resendKey) {
      console.warn("RESEND_API_KEY not set — skipping email send");
      return json({ success: true, sent: 0, skipped: true });
    }

    const customerEmail = order.profiles?.email;
    const emails: Promise<Response>[] = [];

    // 1. Customer confirmation
    if (customerEmail) {
      emails.push(
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: `The Aira Edit <${fromEmail}>`,
            to: [customerEmail],
            subject: `Order Confirmed — #${order.order_number}`,
            html: buildCustomerEmailHtml(order, order.order_items),
          }),
        })
      );
    }

    // 2. Admin notification
    if (adminEmail) {
      emails.push(
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: `The Aira Edit <${fromEmail}>`,
            to: [adminEmail],
            subject: `New Order #${order.order_number} — $${order.total.toFixed(2)}`,
            html: buildAdminEmailHtml(
              order,
              order.order_items,
              customerEmail || "Unknown"
            ),
          }),
        })
      );
    }

    const results = await Promise.allSettled(emails);
    const failed = results.filter((r) => r.status === "rejected");

    if (failed.length > 0) {
      console.error("Some emails failed:", failed);
    }

    return json({
      success: true,
      sent: results.length - failed.length,
      failed: failed.length,
    });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "Internal server error" },
      500
    );
  }
});

// ── Email HTML templates ─────────────────────────────────────

interface OrderData {
  order_number: string;
  subtotal: number;
  discount_amount: number;
  shipping_cost: number;
  total: number;
  shipping_address?: {
    full_name: string;
    line1: string;
    line2?: string;
    city: string;
    province: string;
    postal_code: string;
    country: string;
  } | null;
}

interface ItemData {
  product_name: string;
  size: string | null;
  color: string | null;
  quantity: number;
  unit_price: number;
}

function buildCustomerEmailHtml(order: OrderData, items: ItemData[]): string {
  const itemRows = items
    .map(
      (item) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #e8e0d4;">
        <div style="font-family:'Jost',Arial,sans-serif;font-size:14px;color:#2a2e28;">${item.product_name}</div>
        <div style="font-family:'Jost',Arial,sans-serif;font-size:12px;color:#888;margin-top:2px;">
          ${[item.size, item.color].filter(Boolean).join(" / ")} &times; ${item.quantity}
        </div>
      </td>
      <td style="padding:12px 0;border-bottom:1px solid #e8e0d4;text-align:right;font-family:'Jost',Arial,sans-serif;font-size:14px;color:#2a2e28;">
        $${(item.unit_price * item.quantity).toFixed(2)}
      </td>
    </tr>`
    )
    .join("");

  const addr = order.shipping_address;
  const addressBlock = addr
    ? `
    <div style="margin-top:30px;padding-top:20px;border-top:1px solid #e8e0d4;">
      <h3 style="font-family:serif;font-size:10px;letter-spacing:2px;color:#888;text-transform:uppercase;margin:0 0 12px;">Shipping To</h3>
      <p style="font-family:'Jost',Arial,sans-serif;font-size:14px;color:#2a2e28;line-height:1.6;margin:0;">
        ${addr.full_name}<br>
        ${addr.line1}<br>
        ${addr.line2 ? addr.line2 + "<br>" : ""}
        ${addr.city}, ${addr.province} ${addr.postal_code}<br>
        ${addr.country}
      </p>
    </div>`
    : "";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f5efe6;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;padding:30px 0;">
      <div style="font-family:serif;font-size:10px;letter-spacing:3px;color:#888;text-transform:uppercase;">the</div>
      <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:28px;color:#2a2e28;margin:4px 0;">aira</div>
      <div style="font-family:serif;font-size:9px;letter-spacing:6px;color:#c9a84c;text-transform:uppercase;">e d i t</div>
    </div>
    <div style="background:white;border-radius:2px;padding:40px 30px;">
      <h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:24px;font-weight:400;color:#2a2e28;margin:0 0 8px;">
        Thank you for your order
      </h1>
      <p style="font-family:'Jost',Arial,sans-serif;font-size:14px;color:#666;margin:0 0 30px;">
        Order #${order.order_number} has been confirmed.
      </p>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr>
            <th style="text-align:left;padding:0 0 12px;font-family:serif;font-size:10px;letter-spacing:2px;color:#888;text-transform:uppercase;">Item</th>
            <th style="text-align:right;padding:0 0 12px;font-family:serif;font-size:10px;letter-spacing:2px;color:#888;text-transform:uppercase;">Amount</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>
      <div style="margin-top:20px;padding-top:20px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:4px 0;font-family:'Jost',Arial,sans-serif;font-size:14px;color:#666;">Subtotal</td>
            <td style="padding:4px 0;text-align:right;font-family:'Jost',Arial,sans-serif;font-size:14px;color:#2a2e28;">$${order.subtotal.toFixed(2)}</td>
          </tr>
          ${
            order.discount_amount > 0
              ? `<tr>
            <td style="padding:4px 0;font-family:'Jost',Arial,sans-serif;font-size:14px;color:#7a8c75;">Discount</td>
            <td style="padding:4px 0;text-align:right;font-family:'Jost',Arial,sans-serif;font-size:14px;color:#7a8c75;">-$${order.discount_amount.toFixed(2)}</td>
          </tr>`
              : ""
          }
          <tr>
            <td style="padding:4px 0;font-family:'Jost',Arial,sans-serif;font-size:14px;color:#666;">Shipping</td>
            <td style="padding:4px 0;text-align:right;font-family:'Jost',Arial,sans-serif;font-size:14px;color:#2a2e28;">${order.shipping_cost > 0 ? `$${order.shipping_cost.toFixed(2)}` : "Free"}</td>
          </tr>
          <tr>
            <td style="padding:12px 0 0;font-family:serif;font-size:14px;letter-spacing:1px;color:#2a2e28;border-top:2px solid #2a2e28;">TOTAL</td>
            <td style="padding:12px 0 0;text-align:right;font-family:'Jost',Arial,sans-serif;font-size:18px;font-weight:600;color:#2a2e28;border-top:2px solid #2a2e28;">$${order.total.toFixed(2)}</td>
          </tr>
        </table>
      </div>
      ${addressBlock}
    </div>
    <div style="text-align:center;padding:30px 0;">
      <p style="font-family:'Jost',Arial,sans-serif;font-size:12px;color:#888;margin:0;">
        If you have questions, reply to this email or contact us at support@theairaedit.com
      </p>
      <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:14px;font-style:italic;color:#c9a84c;margin:20px 0 0;">
        The Aira Edit
      </p>
    </div>
  </div>
</body>
</html>`;
}

function buildAdminEmailHtml(
  order: OrderData,
  items: ItemData[],
  customerEmail: string
): string {
  const appUrl = Deno.env.get("APP_URL") || "http://localhost:5173";
  const itemList = items
    .map(
      (item) =>
        `${item.product_name} (${[item.size, item.color].filter(Boolean).join("/")}) &times; ${item.quantity} — $${(item.unit_price * item.quantity).toFixed(2)}`
    )
    .join("<br>");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:20px;font-family:Arial,sans-serif;background:#f5f5f5;">
  <div style="max-width:500px;margin:0 auto;background:white;padding:30px;border-radius:4px;">
    <h2 style="margin:0 0 4px;color:#2a2e28;">New Order #${order.order_number}</h2>
    <p style="color:#666;margin:0 0 20px;">Customer: ${customerEmail}</p>
    <div style="background:#f9f7f3;padding:16px;border-radius:4px;margin-bottom:20px;">
      <strong style="color:#2a2e28;">Items:</strong><br>
      <span style="font-size:14px;color:#444;line-height:1.8;">${itemList}</span>
    </div>
    <table style="width:100%;font-size:14px;">
      <tr><td style="color:#666;padding:4px 0;">Subtotal</td><td style="text-align:right;padding:4px 0;">$${order.subtotal.toFixed(2)}</td></tr>
      ${order.discount_amount > 0 ? `<tr><td style="color:#7a8c75;padding:4px 0;">Discount</td><td style="text-align:right;color:#7a8c75;padding:4px 0;">-$${order.discount_amount.toFixed(2)}</td></tr>` : ""}
      <tr><td style="color:#666;padding:4px 0;">Shipping</td><td style="text-align:right;padding:4px 0;">${order.shipping_cost > 0 ? `$${order.shipping_cost.toFixed(2)}` : "Free"}</td></tr>
      <tr><td colspan="2" style="border-top:2px solid #2a2e28;padding-top:8px;"></td></tr>
      <tr><td style="font-weight:bold;font-size:16px;">Total</td><td style="text-align:right;font-weight:bold;font-size:16px;">$${order.total.toFixed(2)}</td></tr>
    </table>
    <p style="margin-top:20px;text-align:center;">
      <a href="${appUrl}/admin/orders" style="display:inline-block;background:#2a2e28;color:white;padding:10px 24px;border-radius:2px;text-decoration:none;font-size:14px;">
        View Orders
      </a>
    </p>
  </div>
</body>
</html>`;
}
