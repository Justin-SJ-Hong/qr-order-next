'use client'

import BarChartIcon from "@mui/icons-material/BarChart";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import HelpIcon from "@mui/icons-material/Help";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PeopleIcon from "@mui/icons-material/People";
import ReceiptIcon from "@mui/icons-material/Receipt";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import SettingsIcon from "@mui/icons-material/Settings";
import SupportIcon from "@mui/icons-material/Support";
import {
    AppBar,
    Avatar,
    Box,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Stack,
    Toolbar,
    Typography,
} from "@mui/material";
import React, { useState } from "react";
import StoreInfoModal from "../../components/StoreInfoModal";
import Link from "next/link";
import { useRouter } from "next/navigation";

const mainNavigationItems = [
    { icon: HomeIcon, label: "POS 홈", href: "/owner/pos" },
    { icon: BarChartIcon, label: "통계∙분석", href: "/owner/analytics" },
    { icon: PeopleIcon, label: "고객∙알림∙쿠폰", href: "/owner/notify" },
    { icon: ReceiptIcon, label: "주문∙결제 내역", href: "/owner/orders" },
    { icon: RestaurantIcon, label: "메뉴판 관리", href: "/owner/menu-board" },
    { icon: SettingsIcon, label: "장비 설정", href: "/owner/settings" },
];

const bottomNavigationItems = [
    { icon: HelpIcon, label: "서비스명 기능 알아보기" },
    { icon: SupportIcon, label: "고객 센터 문의" },
];

export const OwnerLayout = ({ children }: { children: React.ReactNode }) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [storeModalOpen, setStoreModalOpen] = useState(false);
    const router = useRouter();

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    const handleMenuItemClick = (item: { label: string; href?: string }) => {
        if (item.href) {
            router.push(item.href);
            setDrawerOpen(false); // Close drawer after navigation
        } else {
            console.log(`Clicked: ${item.label}`);
        }
    };

    const handleStoreNameClick = () => {
        setStoreModalOpen(!storeModalOpen);
    };

    const handleStoreModalClose = () => {
        setStoreModalOpen(false);
    };

    return (
        <Box sx={{ display: "flex", width: "100vw", height: "100vh" }}>
            {/* Header */}
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
                <Toolbar sx={{ height: 60, px: 2.5, py: 1.75 }}>
                    <IconButton 
                        edge="start" 
                        onClick={handleDrawerToggle}
                        sx={{ mr: 1 }}
                    >
                        <MenuIcon sx={{ width: 28, height: 28 }} />
                    </IconButton>

                    <Box sx={{ flexGrow: 1 }} />

                    <Stack direction="row" spacing={2.5} alignItems="center">
                        <Typography variant="body2" color="text.secondary">
                            4.29(화) 오후 4:23
                        </Typography>

                        <IconButton>
                            <Link href="/owner/notify">
                                <NotificationsIcon sx={{ width: 28, height: 28 }} />
                            </Link>
                        </IconButton>

                        <Avatar
                            sx={{
                                width: 32,
                                height: 32,
                                bgcolor: "grey.100",
                                color: "text.primary",
                                fontSize: "16px",
                                fontWeight: "normal",
                            }}
                        >
                            CN
                        </Avatar>
                    </Stack>
                </Toolbar>
            </AppBar>

            {/* Sidebar Drawer */}
            <Drawer
                variant="temporary"
                anchor="left"
                open={drawerOpen}
                onClose={storeModalOpen ? undefined : handleDrawerClose}
                sx={{
                    width: 260,
                    flexShrink: 0,
                    zIndex: 1400, // Higher than AppBar (1300)
                    "& .MuiDrawer-paper": {
                        width: 260,
                        boxSizing: "border-box",
                        bgcolor: "white",
                        borderRight: "1px solid #e0e0e0",
                        top: 0, // Start from the very top
                        height: "100vh", // Full height
                    },
                }}
            >
                {/* Drawer Header */}
                <Box
                    sx={{
                        height: 60,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        px: 0.5,
                    }}
                >
                    <IconButton onClick={handleDrawerClose}>
                        <CloseIcon sx={{ width: 30, height: 30 }} />
                    </IconButton>
                </Box>

                {/* Store Name */}
                <Box sx={{ px: 2.5, py: 2.5, borderBottom: "1px solid #e0e0e0" }}>
                    <Stack 
                        direction="row" 
                        alignItems="center" 
                        spacing={1}
                        component="button"
                        onClick={handleStoreNameClick}
                        sx={{
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                            width: "100%",
                            textAlign: "left",
                            "&:hover": {
                                bgcolor: "action.hover",
                            },
                            borderRadius: 1,
                            p: 1,
                            mx: -1,
                        }}
                    >
                        <Typography variant="h6" color="text.secondary">
                            매장이름
                        </Typography>
                        <ChevronRightIcon sx={{ width: 20, height: 20 }} />
                    </Stack>
                </Box>

                {/* Main Navigation */}
                <Box sx={{ p: 1.5, borderBottom: "1px solid #e0e0e0" }}>
                    <List disablePadding>
                        {mainNavigationItems.map((item, index) => (
                            <ListItem
                                key={index}
                                component="button"
                                onClick={() => handleMenuItemClick(item)}
                                sx={{
                                    px: 2,
                                    py: 1.5,
                                    borderRadius: 1,
                                    "&:hover": {
                                        bgcolor: "action.hover",
                                    },
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

                {/* Bottom Navigation */}
                <Box sx={{ p: 1.5, flexGrow: 1 }}>
                    <List disablePadding>
                        {bottomNavigationItems.map((item, index) => (
                            <ListItem
                                key={index}
                                component="button"
                                onClick={() => handleMenuItemClick(item)}
                                sx={{
                                    px: 2,
                                    py: 1.5,
                                    borderRadius: 1,
                                    "&:hover": {
                                        bgcolor: "action.hover",
                                    },
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

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    pt: 7.5, // 60px for header height
                    width: "100vw",
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                {children}
            </Box>

            {/* Store Info Modal */}
            <StoreInfoModal 
                open={storeModalOpen} 
                onClose={handleStoreModalClose} 
            />
        </Box>
    );
};

export default OwnerLayout;
