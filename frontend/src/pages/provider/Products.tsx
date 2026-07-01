import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Archive, Edit, Eye, Plus, RotateCcw, Search, Trash2 } from "lucide-react";
import { productService } from "../../services/product.service";
import type { Product, ProductStatus } from "../../types/product";

const statusOptions: Array<ProductStatus | ""> = [
  "",
  "DRAFT",
  "PUBLISHED",
  "OUT_OF_STOCK",
  "ARCHIVED",
];

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ProductStatus | "">("");
  const [categoryId, setCategoryId] = useState("");
  const [stock, setStock] = useState<"LOW" | "OUT" | "IN" | "">("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    setLoading(true);

    try {
      const data = await productService.list({
        page,
        search,
        status,
        categoryId,
        stock,
      });

      setProducts(data.products);
      setTotalPages(data.totalPages || 1);
    } finally {
      setLoading(false);
    }
  }, [categoryId, page, search, status, stock]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const refreshProduct = (product: Product) => {
    setProducts((current) =>
      current.map((item) => (item.id === product.id ? product : item))
    );
  };

  const deleteProduct = async (productId: string) => {
    await productService.delete(productId);
    setProducts((current) => current.filter((item) => item.id !== productId));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Products</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Manage your provider catalog and comparison-ready product codes.
          </p>
        </div>
        <Link
          to="/provider/products/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-950 px-4 py-2 text-sm font-bold text-white"
        >
          <Plus size={16} />
          Create Product
        </Link>
      </div>

      <div className="grid gap-3 rounded-lg border border-zinc-200 bg-white p-4 md:grid-cols-4">
        <label className="relative md:col-span-1">
          <Search className="absolute left-3 top-3 text-zinc-400" size={16} />
          <input
            value={search}
            onChange={(event) => {
              setPage(1);
              setSearch(event.target.value);
            }}
            placeholder="Search products"
            className="w-full rounded-lg border border-zinc-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-zinc-950"
          />
        </label>
        <select
          value={status}
          onChange={(event) => {
            setPage(1);
            setStatus(event.target.value as ProductStatus | "");
          }}
          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-950"
        >
          {statusOptions.map((option) => (
            <option key={option || "ALL"} value={option}>
              {option || "All statuses"}
            </option>
          ))}
        </select>
        <input
          value={categoryId}
          onChange={(event) => {
            setPage(1);
            setCategoryId(event.target.value);
          }}
          placeholder="Category"
          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-950"
        />
        <select
          value={stock}
          onChange={(event) => {
            setPage(1);
            setStock(event.target.value as "LOW" | "OUT" | "IN" | "");
          }}
          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-950"
        >
          <option value="">All stock</option>
          <option value="IN">In stock</option>
          <option value="LOW">Low stock</option>
          <option value="OUT">Out of stock</option>
        </select>
      </div>

      {loading ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-500">
          Loading products...
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.id}
              className="overflow-hidden rounded-lg border border-zinc-200 bg-white"
            >
              <img
                src={product.thumbnail}
                alt={product.name}
                className="h-44 w-full bg-zinc-100 object-cover"
              />
              <div className="space-y-4 p-4">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-black leading-tight">{product.name}</h2>
                    <span className="rounded-full bg-zinc-100 px-2 py-1 text-[10px] font-black text-zinc-600">
                      {product.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    {product.productIdentificationCode}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-zinc-400">Price</p>
                    <p className="font-bold">₹{product.price.toLocaleString("en-IN")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400">Stock</p>
                    <p className="font-bold">{product.stock}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400">Updated</p>
                    <p className="font-bold">
                      {new Date(product.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/provider/products/${product.id}`}
                    className="rounded-lg border border-zinc-200 p-2 text-zinc-500 hover:text-zinc-950"
                  >
                    <Eye size={16} />
                  </Link>
                  <Link
                    to={`/provider/products/${product.id}/edit`}
                    className="rounded-lg border border-zinc-200 p-2 text-zinc-500 hover:text-zinc-950"
                  >
                    <Edit size={16} />
                  </Link>
                  {product.status === "ARCHIVED" ? (
                    <button
                      type="button"
                      onClick={() =>
                        productService.restore(product.id).then(refreshProduct)
                      }
                      className="rounded-lg border border-zinc-200 p-2 text-zinc-500 hover:text-zinc-950"
                    >
                      <RotateCcw size={16} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        productService.archive(product.id).then(refreshProduct)
                      }
                      className="rounded-lg border border-zinc-200 p-2 text-zinc-500 hover:text-zinc-950"
                    >
                      <Archive size={16} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => void deleteProduct(product.id)}
                    className="rounded-lg border border-rose-100 p-2 text-rose-500 hover:bg-rose-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => setPage((current) => Math.max(1, current - 1))}
          className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-bold disabled:opacity-40"
        >
          Previous
        </button>
        <span className="text-sm font-bold text-zinc-500">
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => setPage((current) => current + 1)}
          className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-bold disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
