"use client";

import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import "@/lib/dayjs";
import { useRouter } from "next/navigation";

export default function EventMenuPage() {
  type EventPopup = {
    id: string;
    menuName: string;
    menuPrice: string; // formatted text like "5,600원"
    discountValue: number;
    discountUnit: "%" | "원";
    startAt: string; // ISO like 2025-05-12T12:00
    endAt: string;   // ISO like 2025-05-12T14:00
    enabled: boolean;
    isHighlighted?: boolean;
  };

  const initialPopups: EventPopup[] = [
    { id: "1", menuName: "메뉴명", menuPrice: "5,600원", discountValue: 10, discountUnit: "%", startAt: "2025-05-12T12:00", endAt: "2025-05-12T14:00", enabled: false, isHighlighted: false },
  ];

  const [popups, setPopups] = useState<EventPopup[]>(initialPopups);
  // Filters/search are currently not in use per latest design
  const [activeTab, setActiveTab] = useState<"discount" | "upselling">("discount");
  const router = useRouter();
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const filtered = useMemo(() => popups, [popups]);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", width: "100%", bgcolor: "#F9FAFB" }}>
      <Box sx={{ flex: 1, p: "28px 48px" }}>
        <Stack spacing={2.5}>
          {/* Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography sx={{ fontSize: 24, fontWeight: 700, color: "#374151" }}>이벤트 팝업 관리</Typography>
          </Stack>

          {/* Tabs */}
          <Stack direction="row" spacing={5}>
            <Box
              sx={{
                pb: 1.5,
                borderBottom: activeTab === "discount" ? "2px solid #226BEF" : "2px solid transparent",
                cursor: "pointer",
              }}
              onClick={() => setActiveTab("discount")}
            >
              <Typography sx={{
                fontSize: 16,
                fontWeight: activeTab === "discount" ? 600 : 400,
                color: activeTab === "discount" ? "#226BEF" : "#374151"
              }}>
                기간할인 팝업
              </Typography>
            </Box>
            <Box
              sx={{
                pb: 1.5,
                borderBottom: activeTab === "upselling" ? "2px solid #226BEF" : "2px solid transparent",
                cursor: "pointer",
              }}
              onClick={() => setActiveTab("upselling")}
            >
              <Typography sx={{
                fontSize: 16,
                fontWeight: activeTab === "upselling" ? 600 : 400,
                color: activeTab === "upselling" ? "#226BEF" : "#374151"
              }}>
                업셀링/다운셀링 팝업
              </Typography>
            </Box>
          </Stack>

          {/* Discount tab table and controls */}
          {activeTab === "discount" && (
            <>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>총 {filtered.length}개</Typography>
                <Button
                  variant="contained"
                  onClick={() => router.push("/owner/menu-board/event-menu/new")}
                  sx={{ bgcolor: "#226BEF", color: "white", textTransform: "none", height: 36, px: 1.5, "&:hover": { bgcolor: "#1D5BB8" } }}
                >
                  신규 등록
                </Button>
              </Stack>

              <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #E5E7EB", mt: 1 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ bgcolor: "#F9FAFB", borderColor: "#E5E7EB" }}>할인 메뉴</TableCell>
                      <TableCell sx={{ bgcolor: "#F9FAFB", borderColor: "#E5E7EB", width: 200 }}>할인금액</TableCell>
                      <TableCell sx={{ bgcolor: "#F9FAFB", borderColor: "#E5E7EB", width: 300 }}>진행기간</TableCell>
                      <TableCell sx={{ bgcolor: "#F9FAFB", borderColor: "#E5E7EB", width: 120 }}>사용</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filtered.map((popup) => (
                      <TableRow key={popup.id}>
                        <TableCell sx={{ borderColor: "#E5E7EB" }}>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Box sx={{ width: 36, height: 36, bgcolor: "#E5E7EB", borderRadius: 0.5 }} />
                            <Stack spacing={0.25}>
                              <Typography sx={{ fontSize: 14, color: "#374151" }}>{popup.menuName}</Typography>
                              <Typography sx={{ fontSize: 12, color: "#9CA3AF" }}>{popup.menuPrice}</Typography>
                            </Stack>
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ borderColor: "#E5E7EB" }}>
                          <Typography sx={{ fontSize: 14, color: "#374151" }}>
                            {popup.discountUnit === "%" ? `${popup.discountValue}%` : `${popup.discountValue.toLocaleString()}원`}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ borderColor: "#E5E7EB" }}>
                          <Stack spacing={0.25}>
                            <Typography sx={{ fontSize: 14, color: "#374151" }}>{dayjs(popup.startAt).format("YY.MM.DD(ddd) HH:mm")} ~</Typography>
                            <Typography sx={{ fontSize: 14, color: "#374151" }}>{dayjs(popup.endAt).format("YY.MM.DD(ddd) HH:mm")}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ borderColor: "#E5E7EB" }}>
                          <Switch
                            size="small"
                            checked={popup.enabled}
                            onChange={(e) =>
                              setPopups((prev) => prev.map((p) => (p.id === popup.id ? { ...p, enabled: e.target.checked } : p)))
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {/* Upselling tab list per Figma 192-16773 */}
          {activeTab === "upselling" && (
            <>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>총 1개</Typography>
                <Button
                  variant="contained"
                  onClick={() => router.push("/owner/menu-board/event-menu/upselling/new")}
                  sx={{ bgcolor: "#226BEF", color: "white", textTransform: "none", height: 36, px: 1.5, "&:hover": { bgcolor: "#1D5BB8" } }}
                >
                  신규 등록
                </Button>
              </Stack>

              <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #E5E7EB", mt: 1 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ bgcolor: "#F9FAFB", borderColor: "#E5E7EB" }}>메인 메뉴</TableCell>
                      <TableCell sx={{ bgcolor: "#F9FAFB", borderColor: "#E5E7EB" }}>업셀링 연결 메뉴</TableCell>
                      <TableCell sx={{ bgcolor: "#F9FAFB", borderColor: "#E5E7EB" }}>다운셀링 연결 메뉴</TableCell>
                      <TableCell sx={{ bgcolor: "#F9FAFB", borderColor: "#E5E7EB", width: 100 }}>사용</TableCell>
                      <TableCell sx={{ bgcolor: "#F9FAFB", borderColor: "#E5E7EB", width: 56 }} />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ borderColor: "#E5E7EB" }}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Box sx={{ width: 36, height: 36, bgcolor: "#E5E7EB", borderRadius: 0.5 }} />
                          <Stack spacing={0.25}>
                            <Typography sx={{ fontSize: 14, color: "#374151" }}>메뉴명</Typography>
                            <Typography sx={{ fontSize: 12, color: "#9CA3AF" }}>5,600원</Typography>
                          </Stack>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ borderColor: "#E5E7EB" }}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Box sx={{ width: 36, height: 36, bgcolor: "#E5E7EB", borderRadius: 0.5 }} />
                          <Stack spacing={0.25}>
                            <Typography sx={{ fontSize: 14, color: "#374151" }}>업셀링 메뉴</Typography>
                            <Typography sx={{ fontSize: 12, color: "#9CA3AF" }}>7,900원</Typography>
                          </Stack>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ borderColor: "#E5E7EB" }}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Box sx={{ width: 36, height: 36, bgcolor: "#E5E7EB", borderRadius: 0.5 }} />
                          <Stack spacing={0.25}>
                            <Typography sx={{ fontSize: 14, color: "#374151" }}>다운셀링 메뉴</Typography>
                            <Typography sx={{ fontSize: 12, color: "#9CA3AF" }}>3,900원</Typography>
                          </Stack>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ borderColor: "#E5E7EB" }}>
                        <Switch size="small" />
                      </TableCell>
                      <TableCell sx={{ borderColor: "#E5E7EB" }}>
                        <IconButton size="small" onClick={(e) => setMenuAnchorEl(e.currentTarget)}>
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Stack>

        {/* Row menu (edit/delete) */}
        <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={() => setMenuAnchorEl(null)}>
          <MenuItem
            onClick={() => {
              // Placeholder for edit action
              setMenuAnchorEl(null);
            }}
          >
            수정
          </MenuItem>
          <MenuItem
            onClick={() => {
              // Placeholder: no row menu currently; keep for future
              setMenuAnchorEl(null);
            }}
          >
            삭제
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}


