package com.nextpay.core.discount;

/**
 * ============================================================================
 * [NEXTPAY-103-1] 고정 정액 할인 정책 (Flat Discount)
 * ----------------------------------------------------------------------------
 * 예: 3,000원 할인 쿠폰
 * - 원금보다 할인액이 클 경우, 결제 금액이 음수가 되지 않도록 원금 전체를 할인(할인액 = 원금)
 * - 원금이 0원 이하면 할인액 0원
 * ============================================================================
 */
public class FlatDiscountPolicy implements DiscountPolicy {

    private final long discountAmount;

    public FlatDiscountPolicy(long discountAmount) {
        if (discountAmount < 0) {
            throw new IllegalArgumentException("할인 금액은 음수일 수 없습니다.");
        }
        this.discountAmount = discountAmount;
    }

    @Override
    public long calculateDiscount(long originalAmount) {
        if (originalAmount <= 0) {
            return 0L;
        }
        // [TODO: 신입사원 업무]
        // 원금보다 할인액이 크면 원금까지만 할인하고, 그렇지 않으면 discountAmount를 반환하세요.
        return 0L;
    }

    @Override
    public String getPolicyName() {
        return "정액할인(" + discountAmount + "원)";
    }
}
