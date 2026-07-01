import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Edit } from "lucide-react";
import { productService } from "../../services/product.service";
import type { Product } from "../../types/product";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!id) return;

    void productService.getById(id).then(setProduct);
  }, [id]);

  if (!product) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-sm text-zinc-500">
        Loading product...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/provider/products"
          className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-zinc-950"
        >
          <ArrowLeft size={16} />
          Products
        </Link>
        <Link
          to={`/provider/products/${product.id}/edit`}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-950 px-4 py-2 text-sm font-bold text-white"
        >
          <Edit size={16} />
          Edit
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <img
          src={product.thumbnail}
          alt={product.name}
          className="h-80 w-full bg-zinc-100 object-cover"
        />
        <div className="space-y-6 p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-black text-zinc-600">
                {product.status}
              </span>
              <h1 className="mt-3 text-3xl font-black tracking-tight">{product.name}</h1>
              <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-zinc-400">
                {product.productIdentificationCode}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black">₹{product.price.toLocaleString("en-IN")}</p>
              {product.originalPrice && (
                <p className="text-sm text-zinc-400 line-through">
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Info label="Brand" value={product.brand} />
            <Info label="Category" value={product.categoryId} />
            <Info label="Stock" value={String(product.stock)} />
            <Info label="Minimum Stock" value={String(product.minimumStock)} />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <section>
              <h2 className="font-black">Description</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                {product.fullDescription || product.shortDescription || "No description provided."}
              </p>
            </section>
            <section>
              <h2 className="font-black">Specifications</h2>
              <div className="mt-2 divide-y divide-zinc-100 rounded-lg border border-zinc-100">
                {product.specifications.length > 0 ? (
                  product.specifications.map((item) => (
                    <div key={`${item.key}-${item.value}`} className="flex justify-between gap-4 p-3 text-sm">
                      <span className="font-semibold text-zinc-500">{item.key}</span>
                      <span className="font-bold">{item.value}</span>
                    </div>
                  ))
                ) : (
                  <p className="p-3 text-sm text-zinc-500">No specifications.</p>
                )}
              </div>
            </section>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Policy title="Warranty" value={product.warranty} />
            <Policy title="Return Policy" value={product.returnPolicy} />
          </div>
        </div>
      </div>
    </div>
  );
}

const Info = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg border border-zinc-100 p-4">
    <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">{label}</p>
    <p className="mt-1 font-black">{value}</p>
  </div>
);

const Policy = ({ title, value }: { title: string; value?: string }) => (
  <section className="rounded-lg border border-zinc-100 p-4">
    <h2 className="font-black">{title}</h2>
    <p className="mt-2 text-sm leading-6 text-zinc-600">
      {value || "Not provided."}
    </p>
  </section>
);
