package com.nextpay.core.discount;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * ============================================================================
 * [NEXTPAY-103-2] 정률 할인 정책 (Rate Discount)
 * ----------------------------------------------------------------------------
 * 예: 10% 할인 (최대 한도 5,000원)
 * - discountRate: 할인 비율 (예: 10% = 0.10)
 * - maxDiscountLimit: 최대 할인 한도 (0이면 무제한)
 * - 할인 금액은 원단위 반올림(HALF_UP)
 * ============================================================================
 */
public class RateDiscountPolicy implements DiscountPolicy {

    private final double discountRate;
    private final long maxDiscountLimit;

    public RateDiscountPolicy(double discountRate, long maxDiscountLimit) {
        if (discountRate < 0.0 || discountRate > 1.0) {
            throw new IllegalArgumentException("할인율은 0% 이상 100% 이하여야 합니다.");
        }
        if (maxDiscountLimit < 0) {
            throw new IllegalArgumentException("최대 할인 한도는 0원 이상이어야 합니다.");
        }
        this.discountRate = discountRate;
        this.maxDiscountLimit = maxDiscountLimit;
    }

    @Override
    public long calculateDiscount(long originalAmount) {
        if (originalAmount <= 0) {
            return 0L;
        }

        // [TODO: 신입사원 업무]
        // 1. originalAmount * discountRate 계산 (반올림 처리)
        // 2. maxDiscountLimit > 0 일 때, 계산된 할인 금액이 maxDiscountLimit보다 크면 maxDiscountLimit 적용
        // 3. 원금(originalAmount)보다 할인액이 크면 원금까지만 적용
        return 0L;
    }

    @Override
    public String getPolicyName() {
        return "정률할인(" + (discountRate * 100) + "%, 최대 " + maxDiscountLimit + "원)";
    }
}
