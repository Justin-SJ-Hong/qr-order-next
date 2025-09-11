"use client";

import {
  Box,
  Button,
  Drawer,
  Stack,
  Typography,
  Dialog,
  DialogContent,
  TextField,
  Chip,
  IconButton,
} from "@mui/material";
import React, { useState } from "react";
import PaymentDialog from "./PaymentDialog";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

interface OrderModalProps {
  open: boolean;
  onClose: () => void;
  onOpen?: () => void;
}

export default function OrderModal({ open, onClose, onOpen }: OrderModalProps) {
  const [placeOrderOpen, setPlaceOrderOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("전체");
  const [page, setPage] = useState(1);
  const [paymentOpen, setPaymentOpen] = useState(false);

  return (
    <>
        <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        sx={{ zIndex: 1500 }}
        PaperProps={{ sx: { width: 500 } }}
        ModalProps={{ BackdropProps: { invisible: true } }}
        >
            {/* 주문내역 header */}
            <Box sx={{ px: 4, py: 2.5, borderBottom: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ fontSize: 20, fontWeight: 600, color: "#374151" }}>주문내역</Typography>
                <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                <Button variant="contained" sx={{ bgcolor: "#F3F4F6", color: "#374151", height: 40, boxShadow: "none", textTransform: "none" }}>테이블 비우기</Button>
                <Button variant="contained" sx={{ bgcolor: "#F3F4F6", color: "#374151", height: 40, boxShadow: "none", textTransform: "none" }}>영수증 출력</Button>
                </Box>
            </Box>

            {/* quantity controls + delete */}
            <Box sx={{ px: 4, py: 2.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Button variant="contained" sx={{ minWidth: 0, width: 32, height: 32, bgcolor: "#E9F0FD", color: "#226BEF" }}>-</Button>
                <Typography sx={{ fontWeight: 600 }}>1</Typography>
                <Button variant="contained" sx={{ minWidth: 0, width: 32, height: 32, bgcolor: "#E9F0FD", color: "#226BEF" }}>+</Button>
                </Box>
                <Button variant="contained" sx={{ height: 32, bgcolor: "#FFE6E2", color: "#E72B23", textTransform: "none", boxShadow: "none" }}>삭제</Button>
            </Box>

            {/* current order list (example) */}
            <Box sx={{ px: 4, py: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#6B7280" }}>헤이즐넛 라떼</Typography>
                <Typography sx={{ fontSize: 14, color: "#374151" }}>5,000원</Typography>
                </Box>
            </Box>

            {/* previous orders */}
            <Box sx={{ flex: 1, bgcolor: "#F9FAFB", px: 4, py: 2 }}>
                <Typography sx={{ fontSize: 16, fontWeight: 600, color: "#4B5563", mb: 1.5 }}>이전 주문 내역</Typography>
                <Stack spacing={1.5}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#6B7280" }}>바닐라 라떼 x 2</Typography>
                    <Typography sx={{ fontSize: 14, color: "#374151" }}>15,000원</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#6B7280" }}>헤이즐넛 라떼 x 2</Typography>
                    <Typography sx={{ fontSize: 14, color: "#374151" }}>15,000원</Typography>
                </Box>
                </Stack>
            </Box>

        {/* footer buttons */}
            <Box sx={{ borderTop: "1px solid #E5E7EB", p: "20px 21px", display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
                <Button onClick={() => { onClose(); setPlaceOrderOpen(true); }} variant="contained" sx={{ bgcolor: "#226BEF", color: "#FFFFFF", height: 40, width: "50%", textTransform: "none" }}>주문 넣기</Button>
                <Button onClick={() => { onClose(); setPaymentOpen(true); }} variant="contained" sx={{ bgcolor: "rgba(0,0,0,0.9)", color: "#FFFFFF", height: 40, width: "50%", textTransform: "none" }}>결제하기</Button>
            </Box>
        </Drawer>
        {/* 주문 넣기 Dialog (Figma 192-22230) */}
        <Dialog open={placeOrderOpen} onClose={() => setPlaceOrderOpen(false)} maxWidth={false} PaperProps={{ sx: { borderRadius: 2 } }}>
            <DialogContent sx={{ p: 0 }}>
                <Box sx={{ width: 768, height: 760, display: "flex", flexDirection: "column" }}>
                    {/* Header */}
                    <Box sx={{ p: "20px 21px", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Typography sx={{ fontSize: 20, fontWeight: 600, color: "#374151" }}>주문 넣기</Typography>
                        <IconButton size="small" onClick={() => setPlaceOrderOpen(false)}>
                        <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Body */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 2.5, flex: 1 }}>
                        {/* Search */}
                        <Box sx={{ display: "flex", gap: 1.5 }}>
                            <TextField
                                fullWidth
                                size="small"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="메뉴명으로 검색"
                                InputProps={{ startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1 }} /> }}
                            />
                        </Box>

                        {/* Category Pills */}
                        <Box sx={{ display: "flex", gap: 1.5 }}>
                            <Chip label="전체" onClick={() => setCategory("전체")} color={category === "전체" ? "primary" : "default"} variant={category === "전체" ? "filled" : "outlined"} sx={{ borderRadius: 9999, height: 36, px: 2 }} />
                            <Chip label="카테고리" onClick={() => setCategory("카테고리")} color={category === "카테고리" ? "primary" : "default"} variant={category === "카테고리" ? "filled" : "outlined"} sx={{ borderRadius: 9999, height: 36, px: 2 }} />
                            <Chip label="카테고리" onClick={() => setCategory("카테고리")} color={category === "카테고리" ? "primary" : "default"} variant={category === "카테고리" ? "filled" : "outlined"} sx={{ borderRadius: 9999, height: 36, px: 2 }} />
                        </Box>

                        {/* Pager */}
                        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", justifyContent: "center" }}>
                            <IconButton size="small" onClick={() => setPage((p) => Math.max(1, p - 1))}>
                                <ArrowBackIosNewIcon fontSize="small" />
                            </IconButton>
                            <Typography sx={{ fontWeight: 600, color: page === 1 ? "#226BEF" : "#111827" }}>1</Typography>
                            <Typography sx={{ fontWeight: 600, color: page === 2 ? "#226BEF" : "#111827" }}>2</Typography>
                            <Typography sx={{ fontWeight: 600, color: page === 3 ? "#226BEF" : "#111827" }}>3</Typography>
                            <Typography sx={{ fontWeight: 600, color: page === 4 ? "#226BEF" : "#111827" }}>4</Typography>
                            <Typography sx={{ fontWeight: 600, color: page === 5 ? "#226BEF" : "#111827" }}>5</Typography>
                            <IconButton size="small" onClick={() => setPage((p) => p + 1)}>
                                <ArrowForwardIosIcon fontSize="small" />
                            </IconButton>
                        </Box>

                        {/* Menu grid examples */}
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                            {[...Array(8)].map((_, i) => (
                                <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1.5, p: "12px 16px", width: 234.67, height: 68, borderRadius: 1, border: "1px solid #E5E7EB" }}>
                                    <Box sx={{ width: 36, height: 36, bgcolor: "#D9D9D9", borderRadius: 0.5 }} />
                                    <Box>
                                        <Typography sx={{ fontSize: 14, color: "#374151" }}>메뉴명</Typography>
                                        <Typography sx={{ fontSize: 12, color: "#6B7280" }}>5,600원</Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>

                        {/* Selected list header */}
                        <Box sx={{ borderTop: "1px solid #E5E7EB" }}>
                            <Box sx={{ display: "flex", alignItems: "center", height: 60, px: 1.5, bgcolor: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                                <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#6B7280" }}>선택한 메뉴</Typography>
                                <Box sx={{ ml: "auto", width: 160 }} />
                                <Box sx={{ width: 52 }} />
                            </Box>
                        {/* Example row */}
                            <Box sx={{ display: "flex", alignItems: "center", height: 68, px: 1.5, borderBottom: "1px solid #E5E7EB" }}>
                                <Box sx={{ flex: 1 }}>
                                    <Typography sx={{ fontSize: 14, color: "#374151" }}>메뉴명</Typography>
                                    <Typography sx={{ fontSize: 12, color: "#6B7280" }}>5,600원</Typography>
                                </Box>
                                <Box sx={{ width: 160, display: "flex", justifyContent: "center" }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                        <Button variant="contained" sx={{ minWidth: 0, width: 32, height: 32, bgcolor: "#E9F0FD", color: "#226BEF" }}><RemoveIcon fontSize="small" /></Button>
                                        <Typography sx={{ fontWeight: 600 }}>1</Typography>
                                        <Button variant="contained" sx={{ minWidth: 0, width: 32, height: 32, bgcolor: "#E9F0FD", color: "#226BEF" }}><AddIcon fontSize="small" /></Button>
                                    </Box>
                                </Box>
                                <Box sx={{ width: 52, display: "flex", justifyContent: "center" }}>
                                    <IconButton size="small">
                                        <CloseIcon fontSize="small" sx={{ color: "#9CA3AF" }} />
                                    </IconButton>
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    {/* Footer */}
                    <Box sx={{ borderTop: "1px solid #E5E7EB", p: "20px 21px", display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
                        <Button variant="contained" onClick={() => setPlaceOrderOpen(false)} sx={{ bgcolor: "#F3F4F6", color: "#374151", height: 40, textTransform: "none" }}>취소</Button>
                        <Button variant="contained" onClick={() => { setPlaceOrderOpen(false); onOpen && onOpen(); }} sx={{ bgcolor: "#226BEF", color: "#FFFFFF", height: 40, textTransform: "none" }}>주문 넣기</Button>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
        <PaymentDialog open={paymentOpen} onClose={() => setPaymentOpen(false)} />
    </>
  );
}


