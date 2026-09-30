package com.nextpay.core.discount;

/**
 * 할인 정책 인터페이스 (Strategy Pattern)
 */
public interface DiscountPolicy {
    /**
     * 할인 금액 계산
     * @param originalAmount 결제 원금
     * @return 할인 금액 (0 이상, 최대 originalAmount 이하)
     */
    long calculateDiscount(long originalAmount);
    
    /**
     * 할인 정책 명칭 반환
     */
    String getPolicyName();
}
