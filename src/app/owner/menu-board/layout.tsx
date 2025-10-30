import Link from "next/link";
import { Box, Stack, Typography } from "@mui/material";
import { ArrowUpward as ArrowUpwardIcon } from "@mui/icons-material";

export default function MenuBoardLayout({ 
  children,
  params: { section }
}: { children: React.ReactNode, params: { section: string } }) {
  const activeSection = section;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", width: "100%", bgcolor: "#F9FAFB" }}>
      {/* Navigation Sidebar */}
      <Box
        sx={{
          width: 260,
          bgcolor: "#F3F4F6",
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        <Typography sx={{ fontSize: 22, fontWeight: 600, color: "#1F2937" }}>
          메뉴판 관리
        </Typography>

        <Stack spacing={1}>
          <Link href="#" style={{ textDecoration: "none" }}>
            <Box
              sx={{
                p: "8px 12px",
                borderRadius: 1,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: 212,
              }}
            >
              <Typography sx={{ fontSize: 16, fontWeight: 600, color: "#6B7280" }}>
                메뉴판 보기
              </Typography>
              <ArrowUpwardIcon sx={{ fontSize: 20, color: "#6B7280" }} />
            </Box>
          </Link>

          <Link href="/owner/menu-board" style={{ textDecoration: "none" }}>
            <Box
              sx={{
                p: "8px 12px",
                borderRadius: 1,
                cursor: "pointer",
                bgcolor: activeSection === "menu-board" ? "white" : "transparent",
              }}
            >
              <Typography sx={{ fontSize: 16, fontWeight: 600, color: activeSection === "menu-board" ? "#1F60FF" : "#6B7280" }}>
                메뉴판 편집
              </Typography>
            </Box>
          </Link>

          <Link href="/owner/menu-board/items" style={{ textDecoration: "none" }}>
            <Box
              sx={{
                p: "8px 12px",
                borderRadius: 1,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: 212,
                bgcolor: activeSection === "menu-board/items" ? "white" : "transparent",
              }}
            >
              <Typography sx={{ fontSize: 16, fontWeight: 600, color: activeSection === "menu-board/items" ? "#1F60FF" : "#6B7280" }}>
                메뉴 관리
              </Typography>
            </Box>
          </Link>

          {/* <Link href="#" style={{ textDecoration: "none" }}>
            <Box
              sx={{
                p: "8px 12px",
                borderRadius: 1,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: 212,
              }}
            >
              <Typography sx={{ fontSize: 16, fontWeight: 600, color: "#6B7280" }}>
                할인 메뉴 관리
              </Typography>
            </Box>
          </Link> */}

          <Link href="/owner/menu-board/event-menu" style={{ textDecoration: "none" }}>
            <Box
              sx={{
                p: "8px 12px",
                borderRadius: 1,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: 212,
                bgcolor: activeSection === "menu-board/event-menu" ? "white" : "transparent",
              }}
            >
              <Typography sx={{ fontSize: 16, fontWeight: 600, color: activeSection === "menu-board/event-menu" ? "#1F60FF" : "#6B7280" }}>
                이벤트 팝업 관리
              </Typography>
            </Box>
          </Link>
        </Stack>
      </Box>

      {/* Main content area */}
      <Box sx={{ flex: 1 }}>{children}</Box>
    </Box>
  );
}


