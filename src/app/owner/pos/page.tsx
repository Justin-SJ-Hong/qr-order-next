"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import SpaceEditModal from "../../../components/SpaceEditModal";
import TableEditModal from "../../../components/TableEditModal";
import OrderModal from "../../../components/OrderModal";

const tabsData = [
  { label: "1층 홀", value: 0 },
  { label: "2층홀", value: 1 },
];

type TableCard = {
  id: string;
  floor: string;
  isActive: boolean;
  orderItem: string | null;
  quantity: number | null;
  price: string | null;
  time: string | null;
};

const tableCards: TableCard[] = [
  {
    id: "T-1",
    floor: "1층",
    isActive: true,
    orderItem: "나베세트",
    quantity: 1,
    price: "30,000원",
    time: "00:00",
  },
  {
    id: "T-2",
    floor: "1층",
    isActive: false,
    orderItem: null,
    quantity: null,
    price: null,
    time: null,
  },
];

export default function PosPage() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [spaceModalOpen, setSpaceModalOpen] = useState(false);
  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleSpaceEditClick = () => {
    setSpaceModalOpen(true);
  };

  const handleSpaceModalClose = () => {
    setSpaceModalOpen(false);
  };

  const handleTableEditClick = () => {
    setTableModalOpen(true);
  };

  const handleTableModalClose = () => {
    setTableModalOpen(false);
  };

  const handleOpenOrderModal = () => {
    setOrderModalOpen(true);
  };
  const handleCloseOrderModal = () => {
    setOrderModalOpen(false);
  };

  return (
    <Box sx={{ p: 3, bgcolor: "grey.100", minHeight: "100vh", minWidth: "100vw" }}>
      <Stack spacing={2.5}>
        <Box sx={{ borderBottom: 1, borderColor: "grey.300", pb: 0 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  minHeight: 48,
                  px: 1.5,
                  py: 1.5,
                },
                "& .Mui-selected": {
                  color: "primary.main",
                  borderBottom: 2,
                  borderColor: "primary.main",
                },
                "& .MuiTabs-indicator": {
                  display: "none",
                },
              }}
            >
              {tabsData.map((tab) => (
                <Tab
                  key={tab.value}
                  label={tab.label}
                  value={tab.value}
                  sx={{
                    color:
                      selectedTab === tab.value
                        ? "primary.main"
                        : "text.secondary",
                    borderBottom: selectedTab === tab.value ? 2 : 0,
                    borderColor:
                      selectedTab === tab.value
                        ? "primary.main"
                        : "transparent",
                  }}
                />
              ))}
            </Tabs>

            <Stack direction="row" spacing={1.5}>
              <Button
                variant="contained"
                onClick={handleSpaceEditClick}
                sx={{
                  bgcolor: "white",
                  color: "black",
                  height: 40,
                  px: 2,
                  borderRadius: 1,
                  boxShadow: "none",
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "grey.50",
                    boxShadow: "none",
                  },
                }}
              >
                공간 편집
              </Button>

              <Button
                variant="contained"
                onClick={handleTableEditClick}
                sx={{
                  bgcolor: "white",
                  color: "black",
                  height: 40,
                  px: 2,
                  borderRadius: 1,
                  boxShadow: "none",
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "grey.50",
                    boxShadow: "none",
                  },
                }}
              >
                테이블 편집
              </Button>
            </Stack>
          </Stack>
        </Box>

        <Stack spacing={2.5}>
          {tableCards.map((table) => (
            <Card
              key={`${table.floor}-${table.id}`}
              sx={{
                width: 260,
                height: 134,
                bgcolor: table.isActive ? "#226bef" : "white",
                border: table.isActive ? "none" : "2px solid #226bef",
                borderRadius: 1,
                overflow: "hidden",
                position: "relative",
              }}
              onClick={handleOpenOrderModal}
            >
              <CardContent
                sx={{ p: 0, position: "relative", height: "100%" }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    position: "absolute",
                    top: 5,
                    left: 14,
                    color: table.isActive ? "white" : "grey.400",
                  }}
                >
                  {table.floor} {table.id}
                </Typography>

                {table.isActive && (
                  <>
                    <Typography
                      variant="body2"
                      sx={{
                        position: "absolute",
                        top: 35,
                        left: 14,
                        color: "white",
                      }}
                    >
                      {table.orderItem}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        position: "absolute",
                        top: 5,
                        left: 202,
                        color: "white",
                      }}
                    >
                      {table.time}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        position: "absolute",
                        top: 35,
                        left: 238,
                        color: "white",
                      }}
                    >
                      {table.quantity}
                    </Typography>

                    <Typography
                      variant="h6"
                      sx={{
                        position: "absolute",
                        top: 97,
                        left: 176,
                        color: "white",
                        fontSize: "16px",
                        fontWeight: 600,
                      }}
                    >
                      {table.price}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Stack>

      {/* Space Edit Modal */}
      <SpaceEditModal 
        open={spaceModalOpen} 
        onClose={handleSpaceModalClose} 
      />

      {/* Table Edit Modal */}
      <TableEditModal 
        open={tableModalOpen} 
        onClose={handleTableModalClose} 
      />

      {/* Order Modal */}
      <OrderModal open={orderModalOpen} onClose={handleCloseOrderModal} onOpen={handleOpenOrderModal} />
    </Box>
  );
}
