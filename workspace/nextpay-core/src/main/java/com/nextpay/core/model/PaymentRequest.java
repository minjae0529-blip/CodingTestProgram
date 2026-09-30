package com.nextpay.core.model;

/**
 * 결제 승인 요청 DTO (Data Transfer Object)
 */
public class PaymentRequest {
    private String orderId;       // 주문 번호 (예: "ORD-20260930-001")
    private String merchantId;    // 가맹점 ID (예: "MCH_1002")
    private long amount;          // 결제 금액 (원 단위)
    private String paymentMethod; // 결제 수단 ("CARD", "TRANSFER", "EASY_PAY")
    private String customerEmail; // 고객 이메일

    public PaymentRequest() {}

    public PaymentRequest(String orderId, String merchantId, long amount, String paymentMethod, String customerEmail) {
        this.orderId = orderId;
        this.merchantId = merchantId;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.customerEmail = customerEmail;
    }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public String getMerchantId() { return merchantId; }
    public void setMerchantId(String merchantId) { this.merchantId = merchantId; }

    public long getAmount() { return amount; }
    public void setAmount(long amount) { this.amount = amount; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
}
