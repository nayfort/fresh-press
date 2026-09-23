import { useParams } from 'react-router-dom';
import ProductDetail from './ProductDetail.jsx';

export default function ProductPage() {
  const { id } = useParams();
  return <ProductDetail key={id} />;
}
