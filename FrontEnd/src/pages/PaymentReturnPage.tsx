import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const PaymentReturnPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const code = searchParams.get('code');
        const id = searchParams.get('id');
        const cancel = searchParams.get('cancel');
        const status = searchParams.get('status');
        const orderCode = searchParams.get('orderCode');

        // Log for debugging
        console.log('Payment Return Params:', { code, id, cancel, status, orderCode });

        if (cancel === 'true' || status === 'CANCELLED') {
            navigate(`/payment/cancel?orderCode=${orderCode}&status=${status}&cancel=true`);
            return;
        }

        if (code === '00' && status === 'PAID') {
            navigate(`/payment/success?orderCode=${orderCode}&status=${status}`);
            return;
        }

        // Default to failed if not success and not explicitly cancelled
        navigate(`/payment/failed?orderCode=${orderCode}&status=${status}`);
    }, [searchParams, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
                <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Đang xử lý kết quả thanh toán...</p>
            </div>
        </div>
    );
};

export default PaymentReturnPage;
