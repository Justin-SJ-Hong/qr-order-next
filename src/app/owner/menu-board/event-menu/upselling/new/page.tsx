"use client";

import { Box, Button, Chip, IconButton, Paper, Stack, Switch, TextField, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import MenuSelectDialog, { type MenuOption } from "@/components/MenuSelectDialog";

export default function UpsellDownsellNewPage() {
  const router = useRouter();
  const [enabled, setEnabled] = useState(true);
  const [mainMenu, setMainMenu] = useState("");
  const [upsellMenu, setUpsellMenu] = useState("");
  const [upsellDiscountValue, setUpsellDiscountValue] = useState("");
  const [upsellDiscountUnit, setUpsellDiscountUnit] = useState<"%" | "원">("%");
  const [upsellMessage, setUpsellMessage] = useState("");
  const [downsellMenu, setDownsellMenu] = useState("");
  const [downsellDiscountValue, setDownsellDiscountValue] = useState("");
  const [downsellDiscountUnit, setDownsellDiscountUnit] = useState<"%" | "원">("%");
  const unitOptions = useMemo(() => ["%", "원"] as const, []);
  const [selectDialog, setSelectDialog] = useState<null | { kind: "main" | "upsell" | "downsell" }>(null);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", width: "100%", bgcolor: "#F9FAFB" }}>
      <Box sx={{ flex: 1, p: "28px 48px" }}>
        <Stack spacing={2.5}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography sx={{ fontSize: 20, fontWeight: 600, color: "#374151" }}>업셀링/다운셀링 팝업 설정</Typography>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" onClick={() => router.back()} sx={{ borderColor: "#E5E7EB", color: "#374151", textTransform: "none", height: 40, px: 1.5 }}>취소</Button>
              <Button variant="contained" startIcon={<CheckIcon />} sx={{ bgcolor: "#226BEF", color: "white", textTransform: "none", height: 40, px: 1.5, "&:hover": { bgcolor: "#1D5BB8" } }}>저장</Button>
            </Stack>
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems="flex-start">
            {/* Left form */}
            <Stack flex={1} spacing={3}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>사용여부</Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: enabled ? "#226BEF" : "#9CA3AF" }}>사용</Typography>
                  <Switch size="small" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
                </Stack>
              </Stack>

              <Stack spacing={1}>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>메인 메뉴 선택</Typography>
                <TextField
                  placeholder="메뉴를 선택해주세요."
                  value={mainMenu}
                  onClick={() => setSelectDialog({ kind: "main" })}
                  onChange={(e) => setMainMenu(e.target.value)}
                  InputProps={{ endAdornment: (
                    <IconButton size="small" edge="end" aria-label="메뉴 선택 열기">
                      <KeyboardArrowRightIcon fontSize="small" />
                    </IconButton>
                  ) }}
                />
              </Stack>

              <Typography sx={{ fontSize: 18, fontWeight: 600, color: "#374151" }}>업셀링 메뉴 설정</Typography>
              <Stack spacing={1}>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>업셀링 메뉴 선택</Typography>
                <TextField
                  placeholder="메뉴를 선택해주세요."
                  value={upsellMenu}
                  onClick={() => setSelectDialog({ kind: "upsell" })}
                  onChange={(e) => setUpsellMenu(e.target.value)}
                  InputProps={{ endAdornment: (
                    <IconButton size="small" edge="end" aria-label="메뉴 선택 열기">
                      <KeyboardArrowRightIcon fontSize="small" />
                    </IconButton>
                  ) }}
                />
              </Stack>
              <Stack spacing={1}>
                <Typography sx={{ width: "auto", fontSize: 14, fontWeight: 700, color: "#111827" }}>업셀링 할인금액</Typography>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <TextField
                    placeholder="0"
                    type="number"
                    value={upsellDiscountValue}
                    onChange={(e) => setUpsellDiscountValue(e.target.value)}
                    fullWidth
                    sx={{ flex: 1 }}
                    InputProps={{ endAdornment: <Typography sx={{ color: "rgba(0,0,0,0.9)", fontSize: 16 }}>{upsellDiscountUnit}</Typography> }}
                  />
                  <Box sx={{ display: "inline-flex", gap: 0.5, bgcolor: "#F3F4F6", border: "1px solid #E5E7EB", borderRadius: 1, p: 0.5 }}>
                    {unitOptions.map((u) => (
                      <Chip
                        key={u}
                        label={u}
                        onClick={() => setUpsellDiscountUnit(u)}
                        sx={{
                          height: 32,
                          borderRadius: 1,
                          bgcolor: upsellDiscountUnit === u ? "#FFFFFF" : "#F3F4F6",
                          color: upsellDiscountUnit === u ? "#374151" : "#6B7280",
                          border: upsellDiscountUnit === u ? "1px solid #E5E7EB" : "1px solid transparent",
                          px: 2,
                        }}
                      />
                    ))}
                  </Box>
                </Stack>
              </Stack>
              <Stack spacing={1}>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>업셀링 제안 문구</Typography>
                <TextField placeholder="문구를 입력해주세요" value={upsellMessage} onChange={(e) => setUpsellMessage(e.target.value)} />
              </Stack>

              <Typography sx={{ fontSize: 18, fontWeight: 600, color: "#374151" }}>다운셀링 메뉴 설정</Typography>
              <Stack spacing={1}>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>다운셀링 메뉴 선택</Typography>
                <TextField
                  placeholder="메뉴를 선택해주세요."
                  value={downsellMenu}
                  onClick={() => setSelectDialog({ kind: "downsell" })}
                  onChange={(e) => setDownsellMenu(e.target.value)}
                  InputProps={{ endAdornment: (
                    <IconButton size="small" edge="end" aria-label="메뉴 선택 열기">
                      <KeyboardArrowRightIcon fontSize="small" />
                    </IconButton>
                  ) }}
                />
              </Stack>
              <Stack spacing={1}>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>다운셀링 할인금액</Typography>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <TextField
                    placeholder="0"
                    type="number"
                    value={downsellDiscountValue}
                    onChange={(e) => setDownsellDiscountValue(e.target.value)}
                    fullWidth
                    sx={{ flex: 1 }}
                    InputProps={{ endAdornment: <Typography sx={{ color: "rgba(0,0,0,0.9)", fontSize: 16 }}>{downsellDiscountUnit}</Typography> }}
                  />
                  <Box sx={{ display: "inline-flex", gap: 0.5, bgcolor: "#F3F4F6", border: "1px solid #E5E7EB", borderRadius: 1, p: 0.5 }}>
                    {unitOptions.map((u) => (
                      <Chip
                        key={u}
                        label={u}
                        onClick={() => setDownsellDiscountUnit(u)}
                        sx={{
                          height: 32,
                          borderRadius: 1,
                          bgcolor: downsellDiscountUnit === u ? "#FFFFFF" : "#F3F4F6",
                          color: downsellDiscountUnit === u ? "#374151" : "#6B7280",
                          border: downsellDiscountUnit === u ? "1px solid #E5E7EB" : "1px solid transparent",
                          px: 2,
                        }}
                      />
                    ))}
                  </Box>
                </Stack>
              </Stack>
            </Stack>

            {/* Right preview */}
            <Stack flex={1} spacing={1.5}>
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#4B5563" }}>미리보기</Typography>
              <Box component="div" sx={{ display: "flex", alignItems: "center", gap: 0.75, p: 1 }}>
                <Box sx={{ width: 14, height: 14, bgcolor: "#6B7280", borderRadius: "50%" }} />
                <Typography sx={{ fontSize: 14, color: "#6B7280" }}>메뉴상세페이지에 진입시 이벤트 팝업이 생성돼요.</Typography>
              </Box>
              <Paper variant="outlined" sx={{ bgcolor: "#E5E7EB", display: "flex", justifyContent: "center", p: 1, borderColor: "#E5E7EB" }}>
                <Box sx={{ bgcolor: "#111827", borderRadius: 2, p: 2, color: "#fff", minHeight: 520, width: 260 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Box sx={{ width: 16, height: 16 }} />
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#F3F4F6" }}>주문내역</Typography>
                    <Box sx={{ width: 16, height: 16 }} />
                  </Stack>
                  <Box sx={{ bgcolor: "#fff", height: 160, borderRadius: 1, mb: 1 }} />
                  <Typography sx={{ fontWeight: 600, mb: 0.25 }}>모츠나베</Typography>
                  <Typography sx={{ fontSize: 12, color: "#D1D5DB", mb: 1 }}>일본식 대창 전골</Typography>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Typography>31,000원</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Button size="small" variant="contained" sx={{ minWidth: 28, px: 0.5, bgcolor: "#374151" }}>-</Button>
                      <Typography>1</Typography>
                      <Button size="small" variant="contained" sx={{ minWidth: 28, px: 0.5, bgcolor: "#374151" }}>+</Button>
                    </Stack>
                  </Stack>

                  <Box sx={{ bgcolor: "rgba(0,0,0,0.8)", borderRadius: 1, p: 1.25, mb: 1.5 }}>
                    <Typography sx={{ fontWeight: 700, textAlign: "center", whiteSpace: "pre-line" }}>
                      {upsellMessage || "지금만! 세트 구성으로 담으면\n2000원 할인!"}
                    </Typography>
                  </Box>
                  <Box sx={{ bgcolor: "#fff", height: 160, borderRadius: 1, mb: 1 }} />
                  <Typography sx={{ fontWeight: 600, mb: 0.5 }}>모츠나베+꼬치 6종 세트</Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <Typography sx={{ color: "rgba(255,255,255,0.7)" }}>31,000원</Typography>
                    <Typography sx={{ color: "#FFC942", fontWeight: 700 }}>29,000원</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Button variant="outlined" size="small" sx={{ color: "#F78700", borderColor: "rgba(122,122,122,0.25)", bgcolor: "#fff" }}>단품 메뉴 담기</Button>
                    <Button variant="contained" size="small" sx={{ bgcolor: "#F78700", color: "#fff" }}>세트 메뉴 담기</Button>
                  </Stack>
                </Box>
              </Paper>
            </Stack>
          </Stack>
        </Stack>
      </Box>
      <MenuSelectDialog
        open={Boolean(selectDialog)}
        title={selectDialog?.kind === "main" ? "메인 메뉴 선택" : selectDialog?.kind === "upsell" ? "업셀링 메뉴 선택" : "다운셀링 메뉴 선택"}
        onClose={() => setSelectDialog(null)}
        onSelect={(opt: MenuOption) => {
          if (selectDialog?.kind === "main") setMainMenu(opt.name);
          else if (selectDialog?.kind === "upsell") setUpsellMenu(opt.name);
          else if (selectDialog?.kind === "downsell") setDownsellMenu(opt.name);
          setSelectDialog(null);
        }}
      />
    </Box>
  );
}


