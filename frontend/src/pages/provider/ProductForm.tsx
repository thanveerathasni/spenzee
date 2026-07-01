import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ImagePlus, Save } from "lucide-react";
import { productService } from "../../services/product.service";
import type { ProductPayload, ProductStatus } from "../../types/product";

interface ProductFormState {
  productIdentificationCode: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  categoryId: string;
  brand: string;
  thumbnail: string;
  images: string[];
  price: string;
  originalPrice: string;
  stock: string;
  minimumStock: string;
  status: ProductStatus;
  tags: string;
  specifications: string;
  warranty: string;
  returnPolicy: string;
}

const initialState: ProductFormState = {
  productIdentificationCode: "",
  name: "",
  shortDescription: "",
  fullDescription: "",
  categoryId: "",
  brand: "",
  thumbnail: "",
  images: [],
  price: "0",
  originalPrice: "",
  stock: "0",
  minimumStock: "0",
  status: "DRAFT",
  tags: "",
  specifications: "",
  warranty: "",
  returnPolicy: "",
};

const readFile = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Invalid file"));
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

export default function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [form, setForm] = useState<ProductFormState>(initialState);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      const product = await productService.getById(id);
      setForm({
        productIdentificationCode: product.productIdentificationCode,
        name: product.name,
        shortDescription: product.shortDescription ?? "",
        fullDescription: product.fullDescription ?? "",
        categoryId: product.categoryId,
        brand: product.brand,
        thumbnail: product.thumbnail,
        images: product.images,
        price: String(product.price),
        originalPrice: product.originalPrice ? String(product.originalPrice) : "",
        stock: String(product.stock),
        minimumStock: String(product.minimumStock),
        status: product.status,
        tags: product.tags.join(", "),
        specifications: product.specifications
          .map((item) => `${item.key}: ${item.value}`)
          .join("\n"),
        warranty: product.warranty ?? "",
        returnPolicy: product.returnPolicy ?? "",
      });
      setLoading(false);
    };

    void loadProduct();
  }, [id]);

  const updateField = (field: keyof ProductFormState, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateThumbnail = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    updateField("thumbnail", await readFile(file));
  };

  const updateGallery = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).slice(0, 10);
    const images = await Promise.all(files.map(readFile));
    setForm((current) => ({
      ...current,
      images,
    }));
  };

  const toPayload = (): ProductPayload => ({
    productIdentificationCode: form.productIdentificationCode,
    name: form.name,
    shortDescription: form.shortDescription,
    fullDescription: form.fullDescription,
    categoryId: form.categoryId,
    brand: form.brand,
    thumbnail: form.thumbnail,
    images: form.images,
    price: Number(form.price),
    originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
    stock: Number(form.stock),
    minimumStock: Number(form.minimumStock),
    status: form.status,
    tags: form.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    specifications: form.specifications
      .split("\n")
      .map((line) => line.split(":"))
      .filter(([key, value]) => key?.trim() && value?.trim())
      .map(([key, value]) => ({
        key: key.trim(),
        value: value.trim(),
      })),
    warranty: form.warranty,
    returnPolicy: form.returnPolicy,
  });

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    try {
      if (id) {
        await productService.update(id, toPayload());
      } else {
        await productService.create(toPayload());
      }

      navigate("/provider/products");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-sm text-zinc-500">
        Loading product...
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">
            {isEditing ? "Edit Product" : "Create Product"}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Build a catalog item with a reusable product identification code.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-950 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save Product"}
        </button>
      </div>

      <section className="rounded-lg border border-zinc-200 bg-white p-5">
        <h2 className="font-black">Basic Information</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Input label="Product Name" value={form.name} onChange={(value) => updateField("name", value)} />
          <Input label="Product Identification Code" value={form.productIdentificationCode} onChange={(value) => updateField("productIdentificationCode", value)} />
          <Input label="Category" value={form.categoryId} onChange={(value) => updateField("categoryId", value)} />
          <Input label="Brand" value={form.brand} onChange={(value) => updateField("brand", value)} />
          <Textarea label="Short Description" value={form.shortDescription} onChange={(value) => updateField("shortDescription", value)} />
          <Textarea label="Full Description" value={form.fullDescription} onChange={(value) => updateField("fullDescription", value)} />
        </div>
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white p-5">
        <h2 className="font-black">Pricing And Inventory</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-5">
          <Input label="Price" type="number" value={form.price} onChange={(value) => updateField("price", value)} />
          <Input label="Original Price" type="number" value={form.originalPrice} onChange={(value) => updateField("originalPrice", value)} />
          <Input label="Stock" type="number" value={form.stock} onChange={(value) => updateField("stock", value)} />
          <Input label="Minimum Stock" type="number" value={form.minimumStock} onChange={(value) => updateField("minimumStock", value)} />
          <label className="space-y-1 text-sm font-semibold text-zinc-600">
            <span>Status</span>
            <select
              value={form.status}
              onChange={(event) => updateField("status", event.target.value)}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 outline-none focus:border-zinc-950"
            >
              <option value="DRAFT">DRAFT</option>
              <option value="PUBLISHED">PUBLISHED</option>
              <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white p-5">
        <h2 className="font-black">Images</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 text-sm font-semibold text-zinc-500">
            {form.thumbnail ? (
              <img src={form.thumbnail} alt="Thumbnail" className="h-48 w-full rounded-lg object-cover" />
            ) : (
              <>
                <ImagePlus size={24} />
                Thumbnail
              </>
            )}
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => void updateThumbnail(event)} className="hidden" />
          </label>
          <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 text-sm font-semibold text-zinc-500">
            <ImagePlus size={24} />
            Gallery Images
            <input multiple type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => void updateGallery(event)} className="hidden" />
          </label>
        </div>
        {form.images.length > 0 && (
          <div className="mt-4 grid grid-cols-5 gap-2">
            {form.images.map((image) => (
              <img key={image.slice(0, 80)} src={image} alt="" className="h-20 rounded-lg object-cover" />
            ))}
          </div>
        )}
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white p-5">
        <h2 className="font-black">Specifications</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Textarea label="Tags" value={form.tags} onChange={(value) => updateField("tags", value)} placeholder="phone, black, 256gb" />
          <Textarea label="Specifications" value={form.specifications} onChange={(value) => updateField("specifications", value)} placeholder="Storage: 256GB" />
        </div>
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white p-5">
        <h2 className="font-black">Warranty And Return Policy</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Textarea label="Warranty" value={form.warranty} onChange={(value) => updateField("warranty", value)} />
          <Textarea label="Return Policy" value={form.returnPolicy} onChange={(value) => updateField("returnPolicy", value)} />
        </div>
      </section>
    </form>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}

const Input = ({ label, value, onChange, type = "text" }: FieldProps) => (
  <label className="space-y-1 text-sm font-semibold text-zinc-600">
    <span>{label}</span>
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-lg border border-zinc-200 px-3 py-2 outline-none focus:border-zinc-950"
    />
  </label>
);

const Textarea = ({ label, value, onChange, placeholder }: FieldProps) => (
  <label className="space-y-1 text-sm font-semibold text-zinc-600">
    <span>{label}</span>
    <textarea
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className="min-h-28 w-full rounded-lg border border-zinc-200 px-3 py-2 outline-none focus:border-zinc-950"
    />
  </label>
);
