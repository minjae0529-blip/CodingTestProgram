package com.nextpay.core.fee;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * [NEXTPAY-101] 가맹점 결제 수수료 계산기 (핫픽스 패치 완료)
 */
public class PaymentFeeCalculator {

    public static final long MINIMUM_FEE = 50L;

    /**
     * 결제 수수료 계산
     * @param amount 결제 원금 (원 단위)
     * @param feeRate 수수료율 (예: 0.8%는 0.008, 2.5%는 0.025)
     * @return 최종 청구 수수료 (원 단위)
     */
    public long calculateFee(long amount, double feeRate) {
        // 1. 유효성 검사 (Fail-Fast 원칙)
        if (amount <= 0 || feeRate <= 0.0 || feeRate > 1.0) {
            throw new IllegalArgumentException("유효하지 않은 결제 금액 또는 수수료율입니다.");
        }

        // 2. BigDecimal을 활용한 정밀한 금융 수수료 계산 및 반올림(HALF_UP)
        BigDecimal amt = BigDecimal.valueOf(amount);
        BigDecimal rate = BigDecimal.valueOf(feeRate);
        long calculatedFee = amt.multiply(rate).setScale(0, RoundingMode.HALF_UP).longValue();

        // 3. 소액 결제 최소 수수료(50원) 방어 정책 적용
        return Math.max(calculatedFee, MINIMUM_FEE);
    }
}
