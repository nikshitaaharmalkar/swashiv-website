export async function onRequestGet(context) {
  const { env } = context;
  const raw = await env.PRODUCTS.get("catalog");
  const items = raw ? JSON.parse(raw) : [];
  return Response.json({ items });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  if (!body.password || body.password !== env.ADMIN_PASSWORD) {
    return new Response("Unauthorized - wrong password", { status: 401 });
  }

  const product = body.product;
  if (!product || !product.name || !product.category) {
    return new Response("Missing required fields", { status: 400 });
  }
  if (!["ethnic", "casual"].includes(product.category)) {
    return new Response("Category must be ethnic or casual", { status: 400 });
  }

  const raw = await env.PRODUCTS.get("catalog");
  const items = raw ? JSON.parse(raw) : [];

  items.push({
    name: String(product.name),
    category: product.category,
    description: String(product.description || ""),
    price: Number(product.price) || 0,
    image: String(product.image || ""),
  });

  await env.PRODUCTS.put("catalog", JSON.stringify(items));

  return Response.json({ ok: true, items });
}
