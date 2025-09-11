"use client";

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";

interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
  totalAmountText?: string;
}

export default function PaymentDialog({ open, onClose, totalAmountText = "30,000원"}: PaymentDialogProps) {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>("0");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  return (
    <Dialog open={open} onClose={onClose} maxWidth={false} PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ width: 414, display: "flex", flexDirection: "column" }}>
          <Box sx={{ p: "20px 21px", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography sx={{ fontSize: 20, fontWeight: 600, color: "#374151" }}>결제하기</Typography>
            <IconButton size="small" onClick={() => {setShowPaymentForm(false); onClose()}}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ p: "20px", display: "flex", flexDirection: "column", gap: 3 }}>
            {!showPaymentForm ? (
              /* 결제 수단 선택 화면 */
              <Box>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#4B5563", mb: 1.5 }}>결제 수단</Typography>
                <Stack direction="row" spacing={2}>
                  <Box 
                    sx={{
                      flex: 1,
                      border: selectedPayment === "cash" ? "2px solid #226BEF" : "1px solid #E5E7EB",
                      borderRadius: 2,
                      p: 2,
                      bgcolor: selectedPayment === "cash" ? "#F0F7FF" : "#FFFFFF",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                      cursor: "pointer",
                    }}
                    onClick={() => {setSelectedPayment("cash"); setShowPaymentForm(true)}}
                  >
                    <Box sx={{ width: 48, height: 48 }}>
                      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.27778 12.6945C3 12.6945 3 14.9722 3 14.9722V38.8889C3 38.8889 3 41.1667 5.27778 41.1667H41.7222C44 41.1667 44 38.8889 44 38.8889V14.9722C44 14.9722 44 12.6945 41.7222 12.6945H5.27778Z" fill="#5C913B"/>
                        <path d="M5.27778 7C3 7 3 9.27778 3 9.27778V32.0556C3 32.0556 3 34.3333 5.27778 34.3333H41.7222C44 34.3333 44 32.0556 44 32.0556V9.27778C44 9.27778 44 7 41.7222 7H5.27778Z" fill="#A7D28B"/>
                        <path d="M31.4731 28.0695C35.5615 28.0695 38.8759 24.7551 38.8759 20.6667C38.8759 16.5783 35.5615 13.2639 31.4731 13.2639C27.3846 13.2639 24.0703 16.5783 24.0703 20.6667C24.0703 24.7551 27.3846 28.0695 31.4731 28.0695Z" fill="#77B255"/>
                        <path d="M40.582 32.625H6.41536C5.4735 32.625 4.70703 31.8586 4.70703 30.9167V10.4167C4.70703 9.47485 5.4735 8.70837 6.41536 8.70837H40.582C41.5239 8.70837 42.2904 9.47485 42.2904 10.4167V30.9167C42.2904 31.8586 41.5239 32.625 40.582 32.625ZM6.41536 9.84726C6.10217 9.84726 5.84592 10.1024 5.84592 10.4167V30.9167C5.84592 31.2299 6.10217 31.4862 6.41536 31.4862H40.582C40.8952 31.4862 41.1515 31.2299 41.1515 30.9167V10.4167C41.1515 10.1024 40.8952 9.84726 40.582 9.84726H6.41536Z" fill="#5C913B"/>
                        <path d="M18.9453 7H28.0564V34.4039H18.9453V7Z" fill="#FFE8B6"/>
                        <path d="M18.9453 34.3334H28.0564V41.1667H18.9453V34.3334Z" fill="#FFAC33"/>
                      </svg>
                    </Box>
                    <Typography sx={{ fontSize: 14, color: "#6B7280" }}>현금 결제</Typography>
                  </Box>
                  <Box 
                    sx={{
                      flex: 1,
                      border: selectedPayment === "card" ? "2px solid #226BEF" : "1px solid #E5E7EB",
                      borderRadius: 2,
                      p: 2,
                      bgcolor: selectedPayment === "card" ? "#F0F7FF" : "#FFFFFF",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                      cursor: "pointer",
                    }}
                    onClick={() => {setSelectedPayment("card"); setShowPaymentForm(true)}}
                  >
                    <Box sx={{ width: 48, height: 48 }}>
                      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M40.1728 7.08606L7.83036 7.08606C5.49486 7.08606 3.60156 8.97936 3.60156 11.3149L3.60156 36.6853C3.60156 39.0208 5.49486 40.9141 7.83036 40.9141L40.1728 40.9141C42.5083 40.9141 44.4016 39.0208 44.4016 36.6853L44.4016 11.3149C44.4016 8.97936 42.5083 7.08606 40.1728 7.08606Z" fill="#4592FB"/>
                        <path d="M15.0885 23.2267L11.1453 23.2267C10.4826 23.2267 9.94531 23.7639 9.94531 24.4267L9.94531 28.3699C9.94531 29.0326 10.4826 29.5699 11.1453 29.5699L15.0885 29.5699C15.7513 29.5699 16.2885 29.0326 16.2885 28.3699L16.2885 24.4267C16.2885 23.7639 15.7513 23.2267 15.0885 23.2267Z" fill="white"/>
                        <path d="M3.60156 13.8243L3.60156 19.6263L44.4016 19.6263L44.4016 13.8243L3.60156 13.8243Z" fill="#185DEE"/>
                      </svg>
                    </Box>
                    <Typography sx={{ fontSize: 14, color: "#6B7280" }}>카드 결제</Typography>
                  </Box>
                </Stack>
              </Box>
            ) : (
              /* 결제 금액 입력 화면 */
              <>
                {/* 총 주문금액 */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#6B7280", width: 120 }}>총 주문금액</Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 400, color: "#374151" }}>{totalAmountText}</Typography>
                </Box>

                {/* 결제 금액 입력 */}
                <Box>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#4B5563", mb: 1.5 }}>결제 금액</Typography>
                  <TextField
                    fullWidth
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="0"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: 48,
                        "& fieldset": {
                          borderColor: "#E5E7EB",
                        },
                        "&:hover fieldset": {
                          borderColor: "#E5E7EB",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#226BEF",
                        },
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <Typography sx={{ fontSize: 16, color: "rgba(0, 0, 0, 0.9)", mr: 1 }}>원</Typography>
                      ),
                    }}
                  />
                </Box>
              </>
            )}
          </Box>

          {/* 하단 버튼 */}
          <Box>
            {!showPaymentForm ? (
              /* 결제 수단 선택 화면의 버튼 */
              <></>
            ) : (
              /* 결제 금액 입력 화면의 버튼 */
              <Box sx={{ borderTop: "1px solid #E5E7EB", p: "20px 21px", display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
                <Button 
                  variant="contained" 
                  onClick={() => setShowPaymentForm(false)}
                  sx={{ 
                    bgcolor: "#F3F4F6", 
                    color: "#374151", 
                    height: 40, 
                    textTransform: "none",
                    px: 1.5,
                    "&:hover": {
                      bgcolor: "#E5E7EB",
                    }
                  }}
                >
                  취소
                </Button>
                <Button 
                  variant="contained" 
                  disabled={paymentAmount === "0"}
                  sx={{ 
                    bgcolor: "#226BEF", 
                    color: "#FFFFFF", 
                    height: 40, 
                    textTransform: "none",
                    width: 120,
                    "&:hover": {
                      bgcolor: "#1D5BB8",
                    },
                    "&:disabled": {
                      bgcolor: "#D1D5DB",
                      color: "#9CA3AF",
                    }
                  }}
                >
                  결제하기
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}


