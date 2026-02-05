import { formatDate, safeText } from '../utils/formatters';

export function OrdersTable({ orders }) {
  if (!orders || orders.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan="4" className="muted">No eligible purchases yet.</td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {orders.map((order, idx) => {
        const entries = Number(order.entries || 0);
        const entriesTxt = entries % 1 === 0 ? entries.toFixed(0) : entries.toFixed(1);
        
        return (
          <tr key={idx}>
            <td>{formatDate(order.date_created)}</td>
            <td>{safeText(order.product_name || '')}</td>
            <td className="right">{entriesTxt}</td>
            <td><span className="tag">{safeText(order.status || '')}</span></td>
          </tr>
        );
      })}
    </tbody>
  );
}
