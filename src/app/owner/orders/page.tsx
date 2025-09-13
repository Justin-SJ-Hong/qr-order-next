"use client";

import {
  Box,
  Button,
  Chip,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Popover from "@mui/material/Popover";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import SearchIcon from "@mui/icons-material/Search";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import React, { useMemo, useState } from "react";
import PaymentDialog from "../../../components/PaymentDialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CancelIcon from "@mui/icons-material/Cancel";

type OrderStatus = "paid" | "cancelled" | "pending";

type OrderRow = {
  id: string;
  orderAt: string; // YYYY.MM.DD HH:mm
  tableName: string; // 예: 1층 T-1
  method: "card" | "cash" | "coupon";
  amountText: string; // 30,000원
  status: OrderStatus;
};

const initialRows: OrderRow[] = [
  {
    id: "O-2025-0001",
    orderAt: "2025.09.03 14:21",
    tableName: "1층 T-1",
    method: "card",
    amountText: "30,000원",
    status: "paid",
  },
  {
    id: "O-2025-0002",
    orderAt: "2025.09.03 14:35",
    tableName: "1층 T-2",
    method: "cash",
    amountText: "18,000원",
    status: "paid",
  },
  {
    id: "O-2025-0003",
    orderAt: "2025.09.03 15:02",
    tableName: "2층 T-3",
    method: "card",
    amountText: "12,000원",
    status: "cancelled",
  },
];

const statusLabel: Record<OrderStatus, string> = {
  paid: "결제완료",
  cancelled: "취소",
  pending: "대기",
};

export default function OrdersPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [methodFilter, setMethodFilter] = useState<"all" | "card" | "cash" | "coupon">(
    "all"
  );
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // 기간 필터 상태
  const [startDate, setStartDate] = useState<string>(""); // YYYY-MM-DD
  const [endDate, setEndDate] = useState<string>(""); // YYYY-MM-DD
  const [rangeAnchorEl, setRangeAnchorEl] = useState<HTMLElement | null>(null);

  // 주문 데이터 상태
  const [rows, setRows] = useState(initialRows);

  const openRange = Boolean(rangeAnchorEl);
  const rangeLabel = startDate && endDate ? `${startDate}  ~  ${endDate}` : "2025-05-07  ~  2025-05-07";

  const handleOpenRange = (e: React.MouseEvent<HTMLElement>) => setRangeAnchorEl(e.currentTarget);
  const handleCloseRange = () => setRangeAnchorEl(null);

  // '2025.09.03 14:21' -> Date
  const parseOrderAtToDate = (orderAt: string): Date | null => {
    try {
      if (!orderAt) return null;
      const parts = orderAt.split(" ");
      const datePart = parts[0];
      const timePart = parts[1] || "00:00";
      if (!datePart) return null;
      const isoDate = datePart.replace(/\./g, "-"); // 2025-09-03
      const iso = `${isoDate}T${timePart}:00`;
      const d = new Date(iso);
      return Number.isNaN(d.getTime()) ? null : d;
    } catch {
      return null;
    }
  };

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const matchesQuery =
        !query ||
        r.id.includes(query) ||
        r.tableName.includes(query) ||
        r.orderAt.includes(query);
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      const matchesMethod = methodFilter === "all" || r.method === methodFilter;
      // 기간 필터 체크 (둘 다 지정된 경우에만 필터링)
      let matchesRange = true;
      if (startDate && endDate) {
        const d = parseOrderAtToDate(r.orderAt);
        const start = new Date(`${startDate}T00:00:00`);
        const end = new Date(`${endDate}T23:59:59`);
        if (d) {
          matchesRange = d >= start && d <= end;
        }
      }
      return matchesQuery && matchesStatus && matchesMethod && matchesRange;
    });
  }, [query, statusFilter, methodFilter, rows, startDate, endDate]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const [receiptOpen, setReceiptOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<OrderRow | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  return (
    <Box sx={{ p: 3, minHeight: "100vh", minWidth: "100vw", bgcolor: "grey.100" }}>
      <Stack spacing={2.5}>
        {/* 헤더 */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Typography variant="h4" sx={{ color: "grey.800", fontWeight: 600 }}>
            주문∙결제내역
          </Typography>

          <TextField
            placeholder="주문번호, 카드번호 뒤 4자리, 금액검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ minWidth: 280, flex: 1, maxWidth: 420 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "grey.500" }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* 필터 영역 */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ xs: "stretch", sm: "center" }}>
          <TextField
            placeholder={rangeLabel}
            value={rangeLabel}
            onClick={handleOpenRange}
            sx={{ width: 400, cursor: "pointer" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarMonthOutlinedIcon sx={{ color: "grey.500" }} />
                </InputAdornment>
              ),
            }}
          />

          

          {/* <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            displayEmpty
            sx={{ width: 160, height: 40 }}
          >
            <MenuItem value="all">전체 상태</MenuItem>
            <MenuItem value="paid">결제완료</MenuItem>
            <MenuItem value="pending">대기</MenuItem>
            <MenuItem value="cancelled">취소</MenuItem>
          </Select> */}

          <Select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value as any)}
            displayEmpty
            sx={{ width: 140 }}
          >
            <MenuItem value="all">결제수단</MenuItem>
            <MenuItem value="card">카드</MenuItem>
            <MenuItem value="cash">현금</MenuItem>
            <MenuItem value="coupon">쿠폰</MenuItem>
          </Select>

          <Box sx={{ flex: 1 }} />

          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              sx={{ bgcolor: "white", color: "black", textTransform: "none", boxShadow: "none" }}
            >
              내보내기
            </Button>
            <Button
              variant="contained"
              sx={{ bgcolor: "#226BEF", color: "white", textTransform: "none" }}
            >
              새로고침
            </Button>
          </Stack>
        </Stack>

        {/* 매출 합계 */}
        <Stack spacing={1}>
          <Typography variant="h6" sx={{ fontSize: 16, fontWeight: 600, color: "grey.800" }}>
            매출 합계
          </Typography>
          <Paper elevation={0} sx={{ p: 0, overflow: "hidden", borderRadius: 1 }}>
            <Stack>
              <Stack direction="row" sx={{ bgcolor: "grey.50", borderBottom: 1, borderColor: "grey.300" }}>
                {[
                  "결제+취소 건수",
                  "할인금액",
                  "결제금액",
                  "취소금액",
                  "실매출",
                ].map((label) => (
                  <Box key={label} sx={{ flex: 1, height: 48, display: "flex", alignItems: "center", px: 2 }}>
                    <Typography variant="caption" sx={{ color: "grey.600", fontWeight: 500 }}>{label}</Typography>
                  </Box>
                ))}
              </Stack>
              <Stack direction="row">
                {["13", "0", "200,000", "-10,000", "180,000"].map((value, idx) => (
                  <Box key={idx} sx={{ flex: 1, height: 48, display: "flex", alignItems: "center", px: 2, borderBottom: 1, borderColor: "grey.300" }}>
                    <Typography sx={{ color: idx === 4 ? "grey.900" : "grey.900", fontWeight: idx === 4 ? 600 : 400, fontSize: 14 }}>
                      {value}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Stack>
          </Paper>
        </Stack>

        {/* 상세 내역 */}
        <Typography variant="h6" sx={{ fontSize: 16, fontWeight: 600, color: "grey.800" }}>
          상세 내역
        </Typography>
        <Paper elevation={0} sx={{ width: "100%" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 200, height: 56, bgcolor: "grey.50", borderBottom: 1, borderColor: "grey.300" }}>
                  <Typography variant="caption" sx={{ color: "grey.500", fontWeight: 500 }}>결제일</Typography>
                </TableCell>
                <TableCell sx={{ width: 220, bgcolor: "grey.50", borderBottom: 1, borderColor: "grey.300" }}>
                  <Typography variant="caption" sx={{ color: "grey.500", fontWeight: 500 }}>주문번호</Typography>
                </TableCell>
                <TableCell sx={{ width: 140, bgcolor: "grey.50", borderBottom: 1, borderColor: "grey.300" }}>
                  <Typography variant="caption" sx={{ color: "grey.500", fontWeight: 500 }}>상태</Typography>
                </TableCell>
                <TableCell sx={{ bgcolor: "grey.50", borderBottom: 1, borderColor: "grey.300" }}>
                  <Typography variant="caption" sx={{ color: "grey.500", fontWeight: 500 }}>주문내역</Typography>
                </TableCell>
                <TableCell sx={{ width: 200, bgcolor: "grey.50", borderBottom: 1, borderColor: "grey.300" }}>
                  <Typography variant="caption" sx={{ color: "grey.500", fontWeight: 500 }}>결제금액</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  onClick={() => {
                    setSelectedRow(row);
                    setDetailsOpen(true);
                  }}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell sx={{ borderBottom: 1, borderColor: "grey.300" }}>
                    <Typography variant="body2" sx={{ color: "grey.700" }}>{row.orderAt}</Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottom: 1, borderColor: "grey.300" }}>
                    <Typography variant="body2" sx={{ color: "grey.800" }}>{row.id}</Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottom: 1, borderColor: "grey.300" }}>
                    <Chip
                      size="small"
                      label={statusLabel[row.status]}
                      sx={{
                        height: 24,
                        bgcolor:
                          row.status === "paid"
                            ? "#E8F1FF"
                            : row.status === "cancelled"
                            ? "#FEE2E2"
                            : "#FEF3C7",
                        color:
                          row.status === "paid"
                            ? "#226BEF"
                            : row.status === "cancelled"
                            ? "#B91C1C"
                            : "#92400E",
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ borderBottom: 1, borderColor: "grey.300" }}>
                    <Typography variant="body2" sx={{ color: "grey.700" }}>
                      {row.tableName} 등 / 총 1건
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottom: 1, borderColor: "grey.300" }}>
                    <Stack spacing={0.25}>
                      <Typography variant="body2" sx={{ color: "grey.900", fontWeight: 600 }}>
                        {row.amountText}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "grey.600" }}>
                        {row.method === "card" ? "카드결제" : row.method === "cash" ? "현금결제" : "쿠폰결제"}
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        {/* 간단한 페이지네이션 자리표시자 */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
          <Typography variant="body2" sx={{ color: "grey.600" }}>
            총 {filtered.length}건
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              variant="contained"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              sx={{ bgcolor: "white", color: "black", textTransform: "none", boxShadow: "none" }}
            >
              이전
            </Button>
            <Typography variant="body2" sx={{ color: "grey.700" }}>
              {page} / {totalPages}
            </Typography>
            <Button
              variant="contained"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              sx={{ bgcolor: "white", color: "black", textTransform: "none", boxShadow: "none" }}
            >
              다음
            </Button>
          </Stack>
        </Stack>
      </Stack>
      {/* 기간 선택 팝오버 */}
      <Popover
        open={openRange}
        anchorEl={rangeAnchorEl}
        onClose={handleCloseRange}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{ paper: { sx: { p: 2, borderRadius: 2 } } as any }}
      >
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ minWidth: 320 }}>
          <TextField
            type="date"
            label="시작일"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150 }}
          />
          <TextField
            type="date"
            label="종료일"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150 }}
          />
        </Stack>
        <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 1.5 }}>
          <Button
            variant="contained"
            onClick={() => {
              setStartDate("");
              setEndDate("");
              handleCloseRange();
            }}
            sx={{ bgcolor: "#F3F4F6", color: "#374151", textTransform: "none", boxShadow: "none" }}
          >
            초기화
          </Button>
          <Button
            variant="contained"
            onClick={handleCloseRange}
            sx={{ bgcolor: "#226BEF", color: "white", textTransform: "none" }}
            disabled={!startDate || !endDate}
          >
            적용
          </Button>
        </Stack>
      </Popover>
      <PaymentDialog
        open={receiptOpen}
        onClose={() => setReceiptOpen(false)}
        totalAmountText={selectedRow?.amountText ?? "0원"}
      />
      {/* 상세 내역 Drawer */}
      <Drawer
        anchor="right"
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        sx={{ zIndex: 2001 }}
        PaperProps={{ sx: { width: 400, zIndex: 2000 } }}
      >
        <Stack sx={{ height: "100%" }}>
          {/* Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: "20px 32px", borderBottom: "1px solid #F3F4F6" }}>
            <Typography sx={{ fontSize: 20, fontWeight: 600, color: "#111827" }}>주문내역 상세</Typography>
            <IconButton onClick={() => setDetailsOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>

          {/* Body */}
          <Stack sx={{ p: "20px 32px", gap: 2, overflowY: "auto" }}>
            {/* 결제 정보 */}
            <Typography sx={{ fontSize: 16, fontWeight: 600, color: "#374151" }}>결제 정보</Typography>
            <Stack spacing={1.5}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ width: 120, fontSize: 14, fontWeight: 600, color: "#6B7280" }}>총 결제금액</Typography>
                <Typography sx={{ fontSize: 14, color: "#111827" }}>{selectedRow?.amountText ?? "-"}</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ width: 120, fontSize: 14, fontWeight: 600, color: "#6B7280" }}>결제수단</Typography>
                <Typography sx={{ fontSize: 14, color: "#111827" }}>{selectedRow?.method === "card" ? "카드결제" : selectedRow?.method === "cash" ? "현금결제" : "쿠폰결제"}</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ width: 120, fontSize: 14, fontWeight: 600, color: "#6B7280" }}>금액</Typography>
                <Typography sx={{ fontSize: 14, color: "#111827" }}>{selectedRow?.amountText ?? "-"}</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ width: 120, fontSize: 14, fontWeight: 600, color: "#6B7280" }}>부가세</Typography>
                <Typography sx={{ fontSize: 14, color: "#111827" }}>-</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ width: 120, fontSize: 14, fontWeight: 600, color: "#6B7280" }}>결제시간</Typography>
                <Typography sx={{ fontSize: 14, color: "#111827" }}>{selectedRow?.orderAt ?? "-"}</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ width: 120, fontSize: 14, fontWeight: 600, color: "#6B7280" }}>결제구분</Typography>
                <Typography sx={{ fontSize: 14, color: "#111827" }}>일시불</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ width: 120, fontSize: 14, fontWeight: 600, color: "#6B7280" }}>승인번호</Typography>
                <Typography sx={{ fontSize: 14, color: "#111827" }}>-</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography sx={{ width: 120, fontSize: 14, fontWeight: 600, color: "#6B7280" }}>승인상태</Typography>
                <Typography sx={{ fontSize: 14, color: "#111827" }}>{selectedRow ? (selectedRow.status === "paid" ? "결제완료" : selectedRow.status === "cancelled" ? "취소" : "대기") : "-"}</Typography>
              </Stack>
            </Stack>

            <Divider sx={{ my: 1.5, borderColor: "#E4E6EA" }} />

            {/* 주문 내역 */}
            <Typography sx={{ fontSize: 16, fontWeight: 600, color: "#374151" }}>주문 내역</Typography>
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography sx={{ fontSize: 14, color: "#6B7280" }}>{selectedRow?.tableName} x 1</Typography>
                <Typography sx={{ fontSize: 14, color: "#111827" }}>{selectedRow?.amountText ?? "-"}</Typography>
              </Stack>
            </Stack>
          </Stack>

          {/* Footer */}
          <Divider sx={{ mt: "auto" }} />
          <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ p: "20px 21px" }}>
            <Button
              variant="contained"
              disabled={selectedRow?.status === "cancelled"}
              onClick={() => {
                setDetailsOpen(false);
                setCancelModalOpen(true);
              }}
              sx={{ 
                bgcolor: selectedRow?.status === "cancelled" ? "#F3F4F6" : "#FFE6E2", 
                color: selectedRow?.status === "cancelled" ? "#9CA3AF" : "#E72B23", 
                textTransform: "none", 
                boxShadow: "none", 
                height: 40, 
                px: 1.5 
              }}
            >
              결제 취소
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setDetailsOpen(false);
                setReceiptModalOpen(true);
              }}
              sx={{ bgcolor: "#E9F0FD", color: "#226BEF", textTransform: "none", boxShadow: "none", height: 40, px: 1.5 }}
            >
              영수증 출력
            </Button>
          </Stack>
        </Stack>
      </Drawer>

      {/* 결제 취소 확인 모달 */}
      <Dialog
        open={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        maxWidth={false}
        PaperProps={{ 
          sx: { 
            width: 414, 
            borderRadius: 3,
            overflow: "hidden"
          } 
        }}
      >
        <DialogTitle sx={{ p: "20px 21px", borderBottom: "1px solid #E5E7EB" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography sx={{ fontSize: 20, fontWeight: 600, color: "#374151" }}>
              결제 취소
            </Typography>
            <IconButton onClick={() => setCancelModalOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        
        <DialogContent sx={{ p: "20px", textAlign: "center", zIndex: 2000 }}>
          <Stack spacing={3} alignItems="center">
            {/* X 아이콘 */}
            <Box
              sx={{
                width: 80,
                height: 80,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "transparent",
              }}
            >
              <CancelIcon sx={{ fontSize: 60, color: "#DD2E44" }} />
            </Box>
            
            {/* 메시지 */}
            <Stack spacing={1}>
              <Typography sx={{ fontSize: 18, fontWeight: 600, color: "#374151" }}>
                결제를 취소하시겠습니까?
              </Typography>
              <Typography sx={{ fontSize: 14, color: "#6B7280" }}>
                취소 후에는 복구가 불가능합니다.
              </Typography>
            </Stack>
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ p: "20px 32px", gap: 1.5, borderTop: "1px solid #F3F4F6" }}>
          <Button
            variant="contained"
            onClick={() => setCancelModalOpen(false)}
            sx={{
              flex: 1,
              bgcolor: "#F3F4F6",
              color: "#374151",
              textTransform: "none",
              height: 40,
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#E5E7EB",
              }
            }}
          >
            취소
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              // 주문 상태를 취소로 변경
              if (selectedRow) {
                setRows(prevRows => 
                  prevRows.map(row => 
                    row.id === selectedRow.id 
                      ? { ...row, status: "cancelled" as OrderStatus }
                      : row
                  )
                );
                // 선택된 행도 업데이트
                setSelectedRow({ ...selectedRow, status: "cancelled" as OrderStatus });
              }
              setCancelModalOpen(false);
              setDetailsOpen(true); // 취소 후 다시 상세 보기 열기
            }}
            sx={{
              flex: 1,
              bgcolor: "#226BEF",
              color: "white",
              textTransform: "none",
              height: 40,
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#1D5BB8",
              }
            }}
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>

      {/* 영수증 출력 모달 */}
      <Dialog
        open={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        maxWidth={false}
        PaperProps={{
          sx: {
            width: 414,
            borderRadius: 3,
            overflow: "hidden"
          }
        }}
      >
        <DialogTitle sx={{ p: "20px 21px", borderBottom: "1px solid #E5E7EB" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography sx={{ fontSize: 20, fontWeight: 600, color: "#374151" }}>
              영수증 출력
            </Typography>
            <IconButton onClick={() => setReceiptModalOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ p: "20px" }}>
          <Stack spacing={3}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#4B5563" }}>
              미리보기
            </Typography>
            
            <Box sx={{ 
              bgcolor: "#F3F4F6", 
              borderRadius: 2, 
              p: "20px 21px",
              display: "flex",
              justifyContent: "center"
            }}>
              <Box sx={{
                bgcolor: "white",
                borderRadius: "20px",
                p: "32px 20px",
                width: 332,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3
              }}>
                {/* 주문 번호 */}
                <Typography sx={{ fontSize: 16, fontWeight: 500, color: "#000000" }}>
                  주문 번호 : {selectedRow?.id ?? "1020"}
                </Typography>

                {/* 매장 정보 */}
                <Stack spacing={1} sx={{ width: "100%", alignItems: "center" }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000" }}>
                    강남점
                  </Typography>
                  <Stack direction="row" spacing={5}>
                    <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000" }}>
                      123-45-6789
                    </Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000" }}>
                      홍길동
                    </Typography>
                  </Stack>
                  <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000" }}>
                    서울특별시 강남구
                  </Typography>
                  <Stack direction="row" spacing={5}>
                    <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000" }}>
                      000-000-0000
                    </Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000" }}>
                      fax)00-000-0000
                    </Typography>
                  </Stack>
                </Stack>

                {/* 주문 내역 */}
                <Stack spacing={1} sx={{ width: "100%" }}>
                  <Typography sx={{ fontSize: 16, fontWeight: 500, color: "#000000" }}>
                    {selectedRow?.orderAt ?? "2023-02-08 00:00:00"}
                  </Typography>
                  
                  {/* 테이블 헤더 */}
                  <Stack direction="row" sx={{ borderBottom: "1px dashed #000000", pb: 1 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 400, color: "#000000", flex: 1 }}>
                      품목명
                    </Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: 400, color: "#000000", width: 40, textAlign: "right" }}>
                      수량
                    </Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: 400, color: "#000000", width: 84, textAlign: "right" }}>
                      할인
                    </Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: 400, color: "#000000", width: 84, textAlign: "right" }}>
                      금액
                    </Typography>
                  </Stack>

                  {/* 주문 항목들 */}
                  <Stack spacing={1}>
                    <Stack direction="row" alignItems="center">
                      <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", flex: 1 }}>
                        바닐라라떼
                      </Typography>
                      <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", width: 40, textAlign: "right" }}>
                        2
                      </Typography>
                      <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", width: 84, textAlign: "right" }}>
                        {selectedRow?.method === "cash" ? "2,000" : "0"}
                      </Typography>
                      <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", width: 84, textAlign: "right" }}>
                        {selectedRow?.method === "cash" ? "15,000" : "17,000"}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center">
                      <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", flex: 1 }}>
                        헤이즐넛라떼
                      </Typography>
                      <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", width: 40, textAlign: "right" }}>
                        2
                      </Typography>
                      <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", width: 84, textAlign: "right" }}>
                        {selectedRow?.method === "cash" ? "1,000" : "0"}
                      </Typography>
                      <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", width: 84, textAlign: "right" }}>
                        {selectedRow?.method === "cash" ? "7,000" : "16,000"}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>

                {/* 구분선 */}
                <Box sx={{ width: "100%", height: 0, borderTop: "1px dashed #000000" }} />

                {/* 금액 정보 */}
                <Stack spacing={1} sx={{ width: "100%" }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", width: 66 }}>
                      주문금액
                    </Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000" }}>:</Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", textAlign: "right" }}>
                      {selectedRow?.method === "cash" ? "30,000" : selectedRow?.method === "coupon" ? "8,500" : "33,000"}
                    </Typography>
                  </Stack>
                  
                  {selectedRow?.method === "cash" && (
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", width: 66 }}>
                        할인금액
                      </Typography>
                      <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000" }}>:</Typography>
                      <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", textAlign: "right" }}>
                        3,000
                      </Typography>
                    </Stack>
                  )}
                  
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", width: 66 }}>
                      과세 물품가액
                    </Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000" }}>:</Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", textAlign: "right" }}>
                      {selectedRow?.method === "cash" ? "27,273" : selectedRow?.method === "coupon" ? "7,650" : "29,700"}
                    </Typography>
                  </Stack>
                  
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", width: 66 }}>
                      부가세액
                    </Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000" }}>:</Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", textAlign: "right" }}>
                      {selectedRow?.method === "cash" ? "2,727" : selectedRow?.method === "coupon" ? "850" : "3,300"}
                    </Typography>
                  </Stack>
                  
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", width: 66 }}>
                      총액
                    </Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000" }}>:</Typography>
                    <Typography sx={{ fontSize: 18, fontWeight: 500, color: "#000000", textAlign: "right" }}>
                      {selectedRow?.method === "cash" ? "30,000" : selectedRow?.method === "coupon" ? "8,500" : "33,000"}
                    </Typography>
                  </Stack>
                </Stack>

                {/* 구분선 */}
                <Box sx={{ width: "100%", height: 0, borderTop: "1px dashed #000000" }} />

                {/* 결제 정보 */}
                <Stack spacing={1} sx={{ width: "100%" }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", width: 292 }}>
                    [결제수단별 결제내역]
                  </Typography>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", width: 66 }}>
                      {selectedRow?.method === "card" ? "카드결제" : selectedRow?.method === "cash" ? "현금결제" : "쿠폰결제"}
                    </Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000" }}>:</Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", textAlign: "right" }}>
                      {selectedRow?.method === "cash" ? "30,000" : selectedRow?.method === "coupon" ? "8,500" : "33,000"}
                    </Typography>
                  </Stack>
                </Stack>

                {/* 결제 승인 정보 */}
                <Stack spacing={1} sx={{ width: "100%" }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", width: 292 }}>
                    {selectedRow?.method === "card" ? "[신용카드 승인]" : selectedRow?.method === "cash" ? "[현금 승인]" : "[쿠폰 승인]"}
                  </Typography>
                  
                  {selectedRow?.method === "card" ? (
                    <>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", width: 66 }}>
                          카드사명
                        </Typography>
                        <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000" }}>:</Typography>
                        <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", textAlign: "right" }}>
                          삼성카드
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", width: 66 }}>
                          카드번호
                        </Typography>
                        <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000" }}>:</Typography>
                        <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", textAlign: "right" }}>
                          ****123*
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", width: 66 }}>
                          승인금액
                        </Typography>
                        <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000" }}>:</Typography>
                        <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", textAlign: "right" }}>
                          33,000
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", width: 66 }}>
                          승인번호
                        </Typography>
                        <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000" }}>:</Typography>
                        <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", textAlign: "right" }}>
                          11234113
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", width: 66 }}>
                          할부기간
                        </Typography>
                        <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000" }}>:</Typography>
                        <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", textAlign: "right" }}>
                          00
                        </Typography>
                      </Stack>
                    </>
                  ) : selectedRow?.method === "cash" ? (
                    <>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", width: 66 }}>
                          인식번호
                        </Typography>
                        <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000" }}>:</Typography>
                        <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", textAlign: "right" }}>
                          325235436
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", width: 66 }}>
                          거래구분
                        </Typography>
                        <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000" }}>:</Typography>
                        <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", textAlign: "right" }}>
                          소득공제용
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", width: 66 }}>
                          승인금액
                        </Typography>
                        <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000" }}>:</Typography>
                        <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", textAlign: "right" }}>
                          30,000
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", width: 66 }}>
                          승인번호
                        </Typography>
                        <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000" }}>:</Typography>
                        <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", textAlign: "right" }}>
                          11234113
                        </Typography>
                      </Stack>
                    </>
                  ) : (
                    <>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", width: 66 }}>
                          쿠폰명칭
                        </Typography>
                        <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000" }}>:</Typography>
                        <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", textAlign: "right" }}>
                          해피 할로윈 할인 쿠폰
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", width: 66 }}>
                          쿠폰번호
                        </Typography>
                        <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000" }}>:</Typography>
                        <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", textAlign: "right" }}>
                          32058934853
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", width: 66 }}>
                          승인금액
                        </Typography>
                        <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000" }}>:</Typography>
                        <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", textAlign: "right" }}>
                          8,500
                        </Typography>
                      </Stack>
                    </>
                  )}
                </Stack>

                {/* 적립 현황 */}
                <Stack spacing={1} sx={{ width: "100%" }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", width: 292 }}>
                    [적립 현황]
                  </Typography>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", width: 66 }}>
                      적립 스탬프
                    </Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000" }}>:</Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", textAlign: "right" }}>
                      2
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", width: 66 }}>
                      기존 스탬프
                    </Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000" }}>:</Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", textAlign: "right" }}>
                      9
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", width: 66 }}>
                      누적 스탬프
                    </Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000" }}>:</Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", textAlign: "right" }}>
                      1
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", width: 66 }}>
                      누적 쿠폰수
                    </Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000" }}>:</Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", textAlign: "right" }}>
                      1
                    </Typography>
                  </Stack>
                </Stack>

                {/* 구분선 */}
                <Box sx={{ width: "100%", height: 0, borderTop: "1px dashed #000000" }} />

                {/* 영수증번호 */}
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", width: 66 }}>
                    영수증번호
                  </Typography>
                  <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000" }}>:</Typography>
                  <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#000000", textAlign: "right" }}>
                    21223423794360
                  </Typography>
                </Stack>
              </Box>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: "20px 32px", gap: 1.5, borderTop: "1px solid #F3F4F6" }}>
          <Button
            variant="contained"
            onClick={() => setReceiptModalOpen(false)}
            sx={{
              flex: 1,
              bgcolor: "#226BEF",
              color: "white",
              textTransform: "none",
              height: 40,
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#1D5BB8",
              }
            }}
          >
            출력하기
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}


