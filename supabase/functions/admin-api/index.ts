// supabase/functions/admin-api/index.ts
// Deploy with: supabase functions deploy admin-api --no-verify-jwt
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

function err(message: string, status = 400) {
  return json({ error: message }, status);
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Verify admin password
  const authHeader = req.headers.get("authorization") || "";
  const password = authHeader.replace("Bearer ", "");
  const adminPassword = Deno.env.get("ADMIN_PASSWORD");

  if (!password || password !== adminPassword) {
    return err("Unauthorized", 401);
  }

  // Service role client — bypasses all RLS
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const body = await req.json();
    const { action, ...params } = body;

    switch (action) {
      // ── Dashboard ─────────────────────────────────────────
      case "dashboard": {
        const [revenue, orders, products, users, recent, lowStock] =
          await Promise.all([
            supabase
              .from("orders")
              .select("total")
              .not("status", "in", '("cancelled","refunded")'),
            supabase
              .from("orders")
              .select("id", { count: "exact", head: true }),
            supabase
              .from("products")
              .select("id", { count: "exact", head: true })
              .eq("is_active", true),
            supabase
              .from("profiles")
              .select("id", { count: "exact", head: true }),
            supabase
              .from("orders")
              .select("*, profiles(full_name, email)")
              .order("created_at", { ascending: false })
              .limit(10),
            supabase
              .from("products")
              .select("id, name, slug, stock_quantity, images")
              .lt("stock_quantity", 10)
              .eq("is_active", true)
              .order("stock_quantity"),
          ]);

        const totalRevenue = (revenue.data ?? []).reduce(
          (sum: number, o: { total: number }) => sum + Number(o.total),
          0
        );

        return json({
          stats: {
            totalRevenue,
            totalOrders: orders.count ?? 0,
            totalProducts: products.count ?? 0,
            totalUsers: users.count ?? 0,
          },
          recentOrders: recent.data ?? [],
          lowStockProducts: lowStock.data ?? [],
        });
      }

      // ── Products ──────────────────────────────────────────
      case "products": {
        const { data } = await supabase
          .from("products")
          .select("*, category:categories(*)")
          .order("created_at", { ascending: false });
        return json({ data: data ?? [] });
      }

      case "product": {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", params.id)
          .single();
        if (error) return err(error.message);
        return json({ data });
      }

      case "create-product": {
        const { data, error } = await supabase
          .from("products")
          .insert(params.data)
          .select("*, category:categories(*)")
          .single();
        if (error) return err(error.message);
        return json({ data });
      }

      case "update-product": {
        const { error } = await supabase
          .from("products")
          .update(params.data)
          .eq("id", params.id);
        if (error) return err(error.message);
        return json({ success: true });
      }

      case "delete-product": {
        const { error } = await supabase
          .from("products")
          .delete()
          .eq("id", params.id);
        if (error) return err(error.message);
        return json({ success: true });
      }

      case "toggle-product": {
        const { error } = await supabase
          .from("products")
          .update({ [params.field]: params.value })
          .eq("id", params.id);
        if (error) return err(error.message);
        return json({ success: true });
      }

      // ── Orders ────────────────────────────────────────────
      case "orders": {
        let query = supabase
          .from("orders")
          .select("*, profiles(full_name, email, phone), order_items(*)")
          .order("created_at", { ascending: false });

        if (params.statusFilter && params.statusFilter !== "all") {
          query = query.eq("status", params.statusFilter);
        }

        const { data } = await query;
        return json({ data: data ?? [] });
      }

      case "update-order-status": {
        const { error } = await supabase
          .from("orders")
          .update({
            status: params.status,
            updated_at: new Date().toISOString(),
          })
          .eq("id", params.id);
        if (error) return err(error.message);
        return json({ success: true });
      }

      case "update-order-notes": {
        const { error } = await supabase
          .from("orders")
          .update({ notes: params.notes })
          .eq("id", params.id);
        if (error) return err(error.message);
        return json({ success: true });
      }

      // ── Categories ────────────────────────────────────────
      case "categories": {
        const { data } = await supabase
          .from("categories")
          .select("*")
          .order("sort_order");
        return json({ data: data ?? [] });
      }

      case "create-category": {
        const { error } = await supabase
          .from("categories")
          .insert(params.data);
        if (error) return err(error.message);
        return json({ success: true });
      }

      case "update-category": {
        const { error } = await supabase
          .from("categories")
          .update(params.data)
          .eq("id", params.id);
        if (error) return err(error.message);
        return json({ success: true });
      }

      case "delete-category": {
        const { error } = await supabase
          .from("categories")
          .delete()
          .eq("id", params.id);
        if (error) return err(error.message);
        return json({ success: true });
      }

      // ── Storage: Signed upload URL ────────────────────────
      case "get-upload-url": {
        const { data, error } = await supabase.storage
          .from("product-images")
          .createSignedUploadUrl(params.data.path);
        if (error) return err(error.message);
        return json({
          signedUrl: data.signedUrl,
          path: data.path,
          token: data.token,
        });
      }

      // ── Send order email (admin-triggered) ────────────────
      case "send-order-email": {
        const resendKey = Deno.env.get("RESEND_API_KEY");
        const adminEmail = Deno.env.get("ADMIN_EMAIL");
        const fromEmail =
          Deno.env.get("FROM_EMAIL") || "orders@theairaedit.com";

        if (!resendKey) return err("Email service not configured", 500);

        const { data: order, error: orderErr } = await supabase
          .from("orders")
          .select("*, order_items(*), profiles(email, full_name)")
          .eq("id", params.orderId)
          .single();

        if (orderErr || !order) return err("Order not found", 404);

        const customerEmail = order.profiles?.email;
        const emails = [];

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
        return json({
          success: true,
          sent: results.length - failed.length,
          failed: failed.length,
        });
      }

      // ── Promo Codes ─────────────────────────────────────
      case "promo-codes": {
        const { data } = await supabase
          .from("promo_codes")
          .select("*")
          .order("created_at", { ascending: false });
        return json({ data: data ?? [] });
      }

      case "create-promo-code": {
        const { error } = await supabase.from("promo_codes").insert(params.data);
        if (error) return err(error.message);
        return json({ success: true });
      }

      case "update-promo-code": {
        const { error } = await supabase.from("promo_codes").update(params.data).eq("id", params.id);
        if (error) return err(error.message);
        return json({ success: true });
      }

      case "delete-promo-code": {
        const { error } = await supabase.from("promo_codes").delete().eq("id", params.id);
        if (error) return err(error.message);
        return json({ success: true });
      }

      // ── Newsletter Subscribers ──────────────────────────
      case "subscribers": {
        const { data } = await supabase
          .from("newsletter_subscribers")
          .select("*")
          .order("subscribed_at", { ascending: false });
        return json({ data: data ?? [] });
      }

      case "delete-subscriber": {
        const { error } = await supabase.from("newsletter_subscribers").delete().eq("id", params.id);
        if (error) return err(error.message);
        return json({ success: true });
      }

      // ── Customers ───────────────────────────────────────
      case "customers": {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });

        const { data: orderStats } = await supabase
          .from("orders")
          .select("user_id, total")
          .not("status", "in", '("cancelled","refunded")');

        const statsMap: Record<string, { count: number; spent: number }> = {};
        for (const o of orderStats ?? []) {
          if (!statsMap[o.user_id]) statsMap[o.user_id] = { count: 0, spent: 0 };
          statsMap[o.user_id].count++;
          statsMap[o.user_id].spent += Number(o.total);
        }

        const customers = (profiles ?? []).map((p: Record<string, unknown>) => ({
          ...p,
          order_count: statsMap[p.id as string]?.count ?? 0,
          total_spent: statsMap[p.id as string]?.spent ?? 0,
        }));

        return json({ data: customers });
      }

      case "toggle-admin": {
        const { error } = await supabase.from("profiles").update({ is_admin: params.value }).eq("id", params.id);
        if (error) return err(error.message);
        return json({ success: true });
      }

      // ── Journal Posts ───────────────────────────────────
      case "journal-posts": {
        const { data } = await supabase
          .from("journal_posts")
          .select("*")
          .order("created_at", { ascending: false });
        return json({ data: data ?? [] });
      }

      case "journal-post": {
        const { data, error } = await supabase.from("journal_posts").select("*").eq("id", params.id).single();
        if (error) return err(error.message);
        return json({ data });
      }

      case "create-journal-post": {
        const { data, error } = await supabase.from("journal_posts").insert(params.data).select().single();
        if (error) return err(error.message);
        return json({ data });
      }

      case "update-journal-post": {
        const { error } = await supabase.from("journal_posts").update(params.data).eq("id", params.id);
        if (error) return err(error.message);
        return json({ success: true });
      }

      case "delete-journal-post": {
        const { error } = await supabase.from("journal_posts").delete().eq("id", params.id);
        if (error) return err(error.message);
        return json({ success: true });
      }

      // ── Site Settings ───────────────────────────────────
      case "site-settings": {
        const { data } = await supabase.from("site_settings").select("*");
        return json({ data: data ?? [] });
      }

      case "update-settings": {
        for (const item of params.settings as { key: string; value: string }[]) {
          await supabase
            .from("site_settings")
            .upsert({ key: item.key, value: item.value, updated_at: new Date().toISOString() }, { onConflict: "key" });
        }
        return json({ success: true });
      }

      default:
        return err(`Unknown action: ${action}`);
    }
  } catch (e) {
    return err(e instanceof Error ? e.message : "Internal server error", 500);
  }
});

// ── Email HTML templates ─────────────────────────────────────

interface OrderEmailData {
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

interface OrderItemEmail {
  product_name: string;
  size: string | null;
  color: string | null;
  quantity: number;
  unit_price: number;
}

function buildCustomerEmailHtml(
  order: OrderEmailData,
  items: OrderItemEmail[]
): string {
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
      <h3 style="font-family:'Cinzel',serif;font-size:10px;letter-spacing:2px;color:#888;text-transform:uppercase;margin:0 0 12px;">Shipping To</h3>
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
  order: OrderEmailData,
  items: OrderItemEmail[],
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
