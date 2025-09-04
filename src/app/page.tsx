import LibHealthCheckWrapper from "@/components/LibHealthCheck";
import Link from "next/link";
import { Button, Box, Typography, Container } from "@mui/material";

export default function Home() {
    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    🍽️ QR 주문 시스템
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                    간편한 QR 코드 주문 서비스
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Button 
                        variant="contained" 
                        size="large" 
                        component={Link} 
                        href="/test"
                        sx={{ minWidth: 200 }}
                    >
                        🚀 시스템 상태 확인
                    </Button>
                    <Button 
                        variant="outlined" 
                        size="large" 
                        component={Link} 
                        href="/dashboard"
                        sx={{ minWidth: 200 }}
                    >
                        📊 관리자 대시보드
                    </Button>
                </Box>
            </Box>
            
            <LibHealthCheckWrapper />
        </Container>
    )
}
