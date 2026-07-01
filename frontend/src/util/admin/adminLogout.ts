

import Swal from "sweetalert2";
import { NavigateFunction } from "react-router-dom";
import { clearPersistedAdminAuth } from "../../store/admin/adminAuthStorage";

export async function adminLogout(
  navigate: NavigateFunction
): Promise<void> {
  const result = await Swal.fire({
    title: "Log out of admin panel?",
    text: "You will need to log in again.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Logout",
    cancelButtonText: "Cancel",
    reverseButtons: true,
    confirmButtonColor: "#000000",
  });

  if (!result.isConfirmed) return;

  clearPersistedAdminAuth();
  navigate("/admin/login", { replace: true });
}
