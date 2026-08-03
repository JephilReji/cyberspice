import { Response } from "express";
import { Order } from "../models/Order";
import { AuthRequest } from "../middleware/requireAuth";

function generateOrderNumber() {
  const random = Math.floor(10000 + Math.random() * 90000);
  return `CS-${random}`;
}

function getEstimatedDelivery() {
  const date = new Date();
  date.setDate(date.getDate() + 5);
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export async function createOrder(req: AuthRequest, res: Response) {
  try {
    const { items, deliveryAddress, paymentMethod } = req.body;

    if (!items?.length || !deliveryAddress || !paymentMethod) {
      return res.status(400).json({ message: "Missing required order fields." });
    }

    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.subtotal,
      0
    );
    const gst = Math.round(subtotal * 0.05); // 5% GST for agricultural goods
    const handlingFee = paymentMethod === "pod" ? 5 : 0;
    const grandTotal = subtotal + gst + handlingFee;

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      buyer: req.userId,
      items,
      deliveryAddress,
      paymentMethod,
      paymentStatus: paymentMethod === "pod" ? "pending" : "paid",
      orderStatus: "confirmed",
      subtotal,
      gst,
      handlingFee,
      grandTotal,
      estimatedDelivery: getEstimatedDelivery(),
    });

    return res.status(201).json(order);
  } catch (err) {
    console.error("Create order error:", err);
    return res.status(500).json({ message: "Could not place order." });
  }
}

export async function getMyOrders(req: AuthRequest, res: Response) {
  try {
    const orders = await Order.find({ buyer: req.userId }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    console.error("Get orders error:", err);
    return res.status(500).json({ message: "Could not load orders." });
  }
}

export async function getOrderById(req: AuthRequest, res: Response) {
  try {
    const order = await Order.findOne({ _id: req.params.id, buyer: req.userId });
    if (!order) return res.status(404).json({ message: "Order not found." });
    return res.json(order);
  } catch (err) {
    console.error("Get order error:", err);
    return res.status(500).json({ message: "Could not load order." });
  }
}
