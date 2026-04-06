import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { useDispatch } from "react-redux";
import { userProfileApi } from "../../../api/user/userProfile.api";
import { setUser } from "../../../store/auth/auth.slice";
import { User } from "../../../types/user";
import toast from "react-hot-toast";

interface Props {
  user: User;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function ImageUpload({ user }: Props) {
  const [image, setImage] = useState<string | null>(null);
  const [preview, setPreview] = useState(user.profileImage || "");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<CropArea | null>(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleFile = (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Max 2MB allowed");
      return;
    }

    const url = URL.createObjectURL(file);
    setImage(url);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleFile(file);
  };

  

  //  CROP COMPLETE
  const onCropComplete = useCallback(
    (_: unknown, croppedPixels: CropArea) => {
      setCroppedArea(croppedPixels);
    },
    []
  );

  //  CROP IMAGE (CANVAS)
  const getCroppedImage = async (): Promise<File | null> => {
    if (!image || !croppedArea) return null;

    const img = new Image();
    img.src = image;

    await new Promise((res) => (img.onload = res));

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    canvas.width = croppedArea.width;
    canvas.height = croppedArea.height;

    ctx.drawImage(
      img,
      croppedArea.x,
      croppedArea.y,
      croppedArea.width,
      croppedArea.height,
      0,
      0,
      croppedArea.width,
      croppedArea.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) return resolve(null);

        resolve(
          new File([blob], "cropped.jpg", {
            type: "image/jpeg",
          })
        );
      }, "image/jpeg");
    });
  };

  //  UPLOAD
  const handleUpload = async () => {
    try {
      setLoading(true);

      const croppedFile = await getCroppedImage();
      if (!croppedFile) return toast.error("Crop failed");

      // OPTIMISTIC PREVIEW
      const tempPreview = URL.createObjectURL(croppedFile);
      setPreview(tempPreview);

      const updatedUser: User =
        await userProfileApi.uploadImage(croppedFile);

      dispatch(setUser(updatedUser));

      toast.success("Profile updated");
      setImage(null);

    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">

      {/*  CIRCULAR PREVIEW */}
      <div className="w-28 h-28 rounded-full overflow-hidden border shadow">
        <img
          src={preview || "/default-avatar.png"}
          className="w-full h-full object-cover"
        />
      </div>

      

      {/* FILE INPUT */}
      <input type="file" accept="image/*" onChange={handleChange} />

      {/* CROP SECTION */}
      {image && (
        <>
          <div className="relative w-[300px] h-[300px] bg-black">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round" 
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          {/*  ZOOM SLIDER */}
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-64"
          />

          {/* SAVE BUTTON */}
          <button
            onClick={handleUpload}
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded"
          >
            {loading ? "Uploading..." : "Save Image"}
          </button>
        </>
      )}
    </div>
  );
}