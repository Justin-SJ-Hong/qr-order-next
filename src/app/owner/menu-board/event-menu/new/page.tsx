"use client";

import { Box, Button, Chip, IconButton, Paper, Stack, Switch, TextField, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import MenuSelectDialog, { type MenuOption } from "@/components/MenuSelectDialog";

export default function EventMenuNewPage() {
  const router = useRouter();
  const [enabled, setEnabled] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState("");
  const [menuDialogOpen, setMenuDialogOpen] = useState(false);
  const [discountValue, setDiscountValue] = useState("");
  const [discountUnit, setDiscountUnit] = useState<"%" | "원">("%");
  const [periodText, setPeriodText] = useState("");

  const unitOptions = useMemo(() => ["%", "원"] as const, []);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", width: "100%", bgcolor: "#F9FAFB" }}>
      <Box sx={{ flex: 1, p: "28px 48px" }}>
        <Stack spacing={2.5}>
          {/* Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography sx={{ fontSize: 20, fontWeight: 600, color: "#374151" }}>기간할인 팝업 설정</Typography>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                onClick={() => router.back()}
                sx={{ borderColor: "#E5E7EB", color: "#374151", textTransform: "none", height: 40, px: 1.5 }}
              >
                취소
              </Button>
              <Button
                variant="contained"
                startIcon={<CheckIcon />}
                sx={{ bgcolor: "#226BEF", color: "white", textTransform: "none", height: 40, px: 1.5, "&:hover": { bgcolor: "#1D5BB8" } }}
              >
                저장
              </Button>
            </Stack>
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems="flex-start">
            {/* Left form panel */}
            <Stack flex={1} spacing={3}>
              {/* Enabled switch */}
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>사용여부</Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: enabled ? "#226BEF" : "#9CA3AF" }}>사용</Typography>
                  <Switch size="small" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
                </Stack>
              </Stack>

              {/* Menu select */}
              <Stack spacing={1}>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>메뉴 선택</Typography>
                <TextField
                  placeholder="메뉴를 선택해주세요."
                  value={selectedMenu}
                  onClick={() => setMenuDialogOpen(true)}
                  onChange={(e) => setSelectedMenu(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <IconButton size="small" edge="end" aria-label="메뉴 선택 열기">
                        <KeyboardArrowRightIcon fontSize="small" />
                      </IconButton>
                    ),
                  }}
                />
              </Stack>

              {/* Discount */}
              <Stack spacing={1}>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>할인금액</Typography>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <TextField
                    placeholder="0"
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    sx={{ flex: 1 }}
                    InputProps={{ endAdornment: <Typography sx={{ color: "rgba(0,0,0,0.9)", fontSize: 16 }}>{discountUnit}</Typography> }}
                  />

                  <Paper
                    variant="outlined"
                    sx={{ bgcolor: "#F3F4F6", borderColor: "#E5E7EB", p: 0.5, display: "inline-flex", gap: 0.5, borderRadius: 1 }}
                  >
                    {unitOptions.map((u) => (
                      <Chip
                        key={u}
                        label={u}
                        onClick={() => setDiscountUnit(u)}
                        sx={{
                          height: 32,
                          borderRadius: 1,
                          bgcolor: discountUnit === u ? "#FFFFFF" : "#F3F4F6",
                          color: discountUnit === u ? "#374151" : "#6B7280",
                          border: discountUnit === u ? "1px solid #E5E7EB" : "1px solid transparent",
                          px: 2,
                        }}
                      />
                    ))}
                  </Paper>
                </Stack>
              </Stack>

              {/* Period */}
              <Stack spacing={1}>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>진행 기간</Typography>
                <TextField
                  placeholder="진행기간을 선택하세요."
                  value={periodText}
                  onChange={(e) => setPeriodText(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <Box sx={{ display: "flex", alignItems: "center", color: "#9CA3AF" }}>
                        <CalendarMonthIcon fontSize="small" />
                      </Box>
                    ),
                  }}
                />
              </Stack>
            </Stack>

            {/* Right preview panel */}
            <Stack flex={1} spacing={1.5}>
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#4B5563" }}>미리보기</Typography>
              <Box component="div" sx={{ display: "flex", alignItems: "center", gap: 0.75, p: 1, borderColor: "#E5E7EB" }}>
                <Box sx={{ width: 14, height: 14, bgcolor: "#6B7280", borderRadius: "50%" }} />
                <Typography sx={{ fontSize: 14, color: "#6B7280" }}>
                  사용시 메뉴판 최초 진입시 전체 화면으로 이벤트 팝업이 생성돼요.
                </Typography>
              </Box>

              <Paper variant="outlined" sx={{ bgcolor: "#E5E7EB", display: "flex", justifyContent: "center", gap: 0.75, p: 1, borderColor: "#E5E7EB" }}>
                <Box sx={{ bgcolor: "#111827", borderRadius: 2, p: 2, color: "#fff", minHeight: 480 }}>
                  <Typography sx={{ fontWeight: 600, mb: 1 }}>이번 주 이벤트 메뉴</Typography>
                  <Typography sx={{ fontWeight: 600, mb: 2 }}>모츠나베 세트 1100원 할인!</Typography>

                  <Box sx={{ bgcolor: "#fff", height: 180, borderRadius: 1, mb: 1 }} />
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <Typography sx={{ color: "rgba(255,255,255,0.7)" }}>31,000원</Typography>
                    <Typography sx={{ color: "#FFC942", fontWeight: 700 }}>29,900원</Typography>
                  </Stack>

                  <Stack direction="row" spacing={1}>
                    <Button variant="outlined" size="small" sx={{ color: "#F78700", borderColor: "rgba(122,122,122,0.25)", bgcolor: "#fff" }}>
                      전체 메뉴 보기
                    </Button>
                    <Button variant="contained" size="small" sx={{ bgcolor: "#F78700", color: "#fff" }}>
                      바로 메뉴 담기
                    </Button>
                  </Stack>
                </Box>
              </Paper>
            </Stack>
          </Stack>
        </Stack>
      </Box>
      <MenuSelectDialog
        open={menuDialogOpen}
        title="할인 메뉴 선택"
        onClose={() => setMenuDialogOpen(false)}
        onSelect={(opt: MenuOption) => {
          setSelectedMenu(opt.name);
          setMenuDialogOpen(false);
        }}
      />
    </Box>
  );
}


