// app/owner/layout.tsx
import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

import {
  AppBar,
  Avatar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import { cookies } from "next/headers";
import BarChartIcon from "@mui/icons-material/BarChart";
import HelpIcon from "@mui/icons-material/Help";
import HomeIcon from "@mui/icons-material/Home";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PeopleIcon from "@mui/icons-material/People";
import ReceiptIcon from "@mui/icons-material/Receipt";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import SettingsIcon from "@mui/icons-material/Settings";
import SupportIcon from "@mui/icons-material/Support";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const mainNavigationItems = [
  { icon: HomeIcon, label: "POS 홈", href: "/owner/pos" },
  { icon: BarChartIcon, label: "통계∙분석", href: "/owner/analytics" },
  { icon: PeopleIcon, label: "고객∙알림∙쿠폰", href: "/owner/notify" },
  { icon: ReceiptIcon, label: "주문∙결제 내역", href: "/owner/orders" },
  { icon: RestaurantIcon, label: "메뉴판 관리", href: "/owner/menu-board" },
  { icon: SettingsIcon, label: "장비 설정", href: "/owner/settings" },
];

const bottomNavigationItems = [
  { icon: HelpIcon, label: "서비스명 기능 알아보기", href: "/owner/help" },
  { icon: SupportIcon, label: "고객 센터 문의", href: "/owner/support" },
];

// 서버 액션: 로그아웃(쿠키 삭제 후 리다이렉트)
async function logout() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.delete("sb-access-token");
  redirect("/owner/login");
}

function formatKSTNow() {
  const now = new Date();
  const formatted = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "numeric",
    day: "numeric",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(now);
  return formatted.replace(" ", "").replace(",", "");
}

export default async function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = supabaseBrowser;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("sb-access-token")?.value;
  const { data } = await supabase.auth.getUser(accessToken);
  const user = data?.user;

  const avatarPath = (user?.user_metadata as { avatar_path?: string })
    ?.avatar_path;

  const avatarUrl = avatarPath
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${avatarPath}`
    : undefined;

  const nowText = formatKSTNow();

  return (
    <>
      <Box
        sx={{
          "--drawer-width": "280px",

          // 초기: Drawer 숨김(왼쪽 바깥)
          "& .modal-drawer .MuiDrawer-paper": {
            width: "var(--drawer-width)",
            transform: "translateX(-100%)",
            transition: "transform 220ms ease",
            boxSizing: "border-box",
            bgcolor: "white",
            borderRight: "1px solid #e0e0e0",
            zIndex: 1400,
            position: "fixed",
            left: 0,
            top: 0,
            height: "100vh",
          },

          // 체크되면 Drawer 표시
          "& #nav-toggle:checked ~ .modal-drawer .MuiDrawer-paper": {
            transform: "translateX(0)",
          },

          // Backdrop 기본(숨김)
          "& .backdrop": {
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.35)",
            opacity: 0,
            pointerEvents: "none",
            transition: "opacity 200ms ease",
            zIndex: 1350,
          },
          // 체크되면 Backdrop 표시
          "& #nav-toggle:checked ~ .backdrop": {
            opacity: 1,
            pointerEvents: "auto",
          },
        }}
      >
        <input id="nav-toggle" type="checkbox" hidden />
        {/* 상단 AppBar */}
        <AppBar
          position="fixed"
          sx={{
            bgcolor: "white",
            color: "text.primary",
            boxShadow: "none",
            borderBottom: "1px solid #e0e0e0",
            height: 60,
            zIndex: 1300,
          }}
        >
          <Toolbar sx={{ height: 60, px: 2.5 }}>
            <label
              htmlFor="nav-toggle"
              style={{ cursor: "pointer", marginRight: "16px" }}
            >
              <MenuIcon sx={{ width: 28, height: 28 }} />
            </label>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Owner Console
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Stack direction="row" spacing={2.5} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                {nowText}
              </Typography>

              <Button
                component={Link}
                href="/owner/notify"
                variant="text"
                sx={{ minWidth: 0, p: 0.5 }}
                aria-label="알림"
              >
                <NotificationsIcon sx={{ width: 28, height: 28 }} />
              </Button>

              <Stack direction="row" spacing={1.25} alignItems="center">
                <Avatar
                  src={avatarUrl || ""}
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "grey.100",
                    color: "text.primary",
                    fontSize: "16px",
                    fontWeight: "normal",
                  }}
                  component={Link}
                  href="/owner/store"
                />
                {user ? (
                  <Stack direction="row" spacing={1.25}>
                    <Button
                      component={Link}
                      href="/owner/store"
                      variant="text"
                      size="small"
                    >
                      내 프로필
                    </Button>
                    <form action={logout}>
                      <Button type="submit" variant="text" size="small">
                        로그아웃
                      </Button>
                    </form>
                  </Stack>
                ) : (
                  <Stack direction="row" spacing={1.25}>
                    <Button
                      component={Link}
                      href="/owner/login"
                      variant="text"
                      size="small"
                    >
                      로그인
                    </Button>
                    <Button
                      component={Link}
                      href="/owner/signup"
                      variant="text"
                      size="small"
                    >
                      회원가입
                    </Button>
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Toolbar>
        </AppBar>

        {/* 모달 오버레이 Drawer (좌->우 슬라이드) */}
        <Drawer className="modal-drawer" variant="permanent">
          <label htmlFor="nav-toggle">
            <Button
              component="span"
              variant="text"
              sx={{ minWidth: 0 }}
              aria-label="닫기"
            >
              <CloseIcon />
            </Button>
          </label>

          {/* Drawer Header with Close (X) */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              py: 1.5,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              메뉴
            </Typography>
          </Box>

          <Divider />

          <Box sx={{ p: 1.5 }}>
            <List disablePadding>
              {mainNavigationItems.map((item, i) => (
                <ListItem
                  key={i}
                  component={Link}
                  href={item.href}
                  sx={{
                    px: 2,
                    py: 1.5,
                    borderRadius: 1,
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <item.icon
                      sx={{ width: 20, height: 20, color: "text.secondary" }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      variant: "body2",
                      fontWeight: 500,
                      color: "text.secondary",
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          <Divider />

          <Box sx={{ p: 1.5 }}>
            <List disablePadding>
              {bottomNavigationItems.map((item, i) => (
                <ListItem
                  key={i}
                  component={Link}
                  href={item.href}
                  sx={{
                    px: 2,
                    py: 1.5,
                    borderRadius: 1,
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <item.icon
                      sx={{ width: 20, height: 20, color: "text.secondary" }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      variant: "body2",
                      fontWeight: 500,
                      color: "text.secondary",
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        {/* Backdrop: 클릭 시 닫힘 */}
        <label className="backdrop" htmlFor="nav-toggle" />

        {/* 메인 */}
        <Box
          component="main"
          className="main"
          sx={{
            flexGrow: 1,
            pt: "60px",
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Box sx={{ width: "100%" }}>{children}</Box>
        </Box>
      </Box>
    </>
  );
}
