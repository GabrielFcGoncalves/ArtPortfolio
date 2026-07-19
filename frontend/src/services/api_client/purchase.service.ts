import apiClient from './apiClient';

export interface PaymentSessionResponse {
  session_id: string;
  checkout_url: string;
}

const purchaseService = {
  createCheckout: async (pieceId: string): Promise<PaymentSessionResponse> => {
    const { data } = await apiClient.post<PaymentSessionResponse>(`/portfolio/${pieceId}/purchase`);
    return data;
  }
};

export default purchaseService;
