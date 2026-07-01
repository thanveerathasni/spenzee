import { useEffect } from "react";
import toast from "react-hot-toast";
import { Bell, CheckCheck } from "lucide-react";
import { notificationApi } from "../../api/notification.api";
import {
  addNotification,
  markAllNotificationsRead,
  markNotificationRead,
  setNotifications,
  setNotificationsOpen,
} from "../../features/notification/notificationSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import type { AppNotification } from "../../types/notification";

interface NotificationBellProps {
  tone?: "dark" | "light";
  audience?: "account" | "admin";
}

const formatTime = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

export default function NotificationBell({
  tone = "light",
  audience = "account",
}: NotificationBellProps) {
  const dispatch = useAppDispatch();
  const { items, unreadCount, isOpen } = useAppSelector((state) => state.notifications);
  const userToken = useAppSelector((state) => state.auth.accessToken);
  const adminToken = useAppSelector((state) => state.adminAuth.accessToken);
  const token = audience === "admin" ? adminToken : userToken;
  const isDark = tone === "dark";

  useEffect(() => {
    if (!token) return;

    let closed = false;

    const load = async () => {
      try {
        const data = await notificationApi.list();

        if (!closed) {
          dispatch(setNotifications(data));
        }
      } catch {
        if (!closed) {
          toast.error("Failed to load notifications");
        }
      }
    };

    void load();

    const source = new EventSource(notificationApi.getStreamUrl(token));

    source.addEventListener("notification", (event) => {
      const notification = JSON.parse((event as MessageEvent).data) as AppNotification;

      dispatch(addNotification(notification));
      toast(`${notification.title}: ${notification.message}`);
    });

    return () => {
      closed = true;
      source.close();
    };
  }, [dispatch, token]);

  const markRead = async (notification: AppNotification) => {
    if (!notification.isRead) {
      dispatch(markNotificationRead(notification.id));
      await notificationApi.markRead(notification.id);
    }
  };

  const markAll = async () => {
    dispatch(markAllNotificationsRead());
    await notificationApi.markAllRead();
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => dispatch(setNotificationsOpen(!isOpen))}
        className={`relative inline-flex h-9 w-9 items-center justify-center rounded-lg transition ${
          isDark
            ? "text-white/60 hover:bg-white/10 hover:text-white"
            : "text-black/50 hover:bg-black/[0.04] hover:text-black"
        }`}
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 top-11 z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl border shadow-2xl ${
            isDark
              ? "border-white/10 bg-[#101010] text-white"
              : "border-black/10 bg-white text-black"
          }`}
        >
          <div className={`flex items-center justify-between border-b px-4 py-3 ${isDark ? "border-white/10" : "border-black/10"}`}>
            <div>
              <p className="text-sm font-semibold">Notifications</p>
              <p className={`text-xs ${isDark ? "text-white/40" : "text-black/40"}`}>
                {unreadCount} unread
              </p>
            </div>
            <button
              type="button"
              onClick={() => void markAll()}
              className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs ${
                isDark ? "text-white/50 hover:bg-white/10 hover:text-white" : "text-black/50 hover:bg-black/[0.04] hover:text-black"
              }`}
            >
              <CheckCheck size={14} />
              Read all
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <div className={`px-4 py-10 text-center text-sm ${isDark ? "text-white/35" : "text-black/35"}`}>
                No notifications yet.
              </div>
            ) : (
              items.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => void markRead(notification)}
                  className={`block w-full border-b px-4 py-3 text-left transition last:border-b-0 ${
                    isDark
                      ? "border-white/10 hover:bg-white/[0.04]"
                      : "border-black/[0.06] hover:bg-black/[0.03]"
                  } ${notification.isRead ? "" : isDark ? "bg-white/[0.04]" : "bg-black/[0.025]"}`}
                >
                  <div className="flex items-start gap-3">
                    {!notification.isRead && (
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-red-500" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{notification.title}</p>
                      <p className={`mt-1 text-xs leading-5 ${isDark ? "text-white/45" : "text-black/45"}`}>
                        {notification.message}
                      </p>
                      <p className={`mt-2 text-[10px] uppercase tracking-widest ${isDark ? "text-white/30" : "text-black/30"}`}>
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
